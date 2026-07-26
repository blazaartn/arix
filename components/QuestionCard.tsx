'use client';

import { useState, memo, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, MessageCircle, Share2, Clock, BookOpen, 
  X, Send, Code, Loader2, ChevronRight, Trash2, Check
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { useLikes } from '@/hooks/useLikes';
import { useToast } from '@/contexts/ToastContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

interface Image {
  id: string;
  image_url: string;
  caption: string;
  is_primary: boolean;
}

interface Question {
  id: string;
  title: string;
  content: string;
  user_id: string;
  subject_name: string;
  author_name: string;
  author_avatar: string;
  author_role: string;
  view_count: number;
  created_at: string;
  comments_count: number;
  like_count: number;
  images_count: number;
  userLiked?: boolean;
  image?: Image;
  code_content?: string;
  code_language?: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  created_at: string;
}

interface QuestionCardProps {
  question: Question;
  isLoggedIn: boolean;
  currentUserId?: string;
  onRefresh: () => void;
  onImageClick: (url: string) => void;
}

function formatNumber(num: number): string {
  const n = typeof num === 'number' ? num : parseInt(String(num)) || 0;
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60 * 1000) return 'À l\'instant';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} min`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} h`;
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))} j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (!code) return null;
  return (
    <div className="relative my-2 rounded-lg overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 text-xs">
        <span className="font-mono">{language || 'code'}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white transition">
          {copied ? <span className="text-green-400">✓ Copié</span> : 'Copier'}
        </button>
      </div>
      <div className="p-4 bg-gray-900 overflow-x-auto max-h-64">
        <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap break-words">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export const QuestionCard = memo(function QuestionCard({ 
  question, 
  isLoggedIn, 
  currentUserId, 
  onRefresh, 
  onImageClick 
}: QuestionCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const { 
    count: likesCount, 
    liked, 
    toggleLike,
    refreshFromServer
  } = useLikes(
    question.id,
    question.like_count || 0,
    question.userLiked || false
  );

  useEffect(() => {
    if (session) {
      refreshFromServer();
    }
  }, [session, refreshFromServer]);

  const { 
    data: comments = [], 
    isLoading: loadingComments, 
    refetch: refetchComments 
  } = useQuery({
    queryKey: ['comments', question.id],
    queryFn: async () => {
      const res = await fetch(`/api/comments?questionId=${question.id}`);
      const data = await res.json();
      return data.comments || [];
    },
    enabled: showComments,
    staleTime: 30000,
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, content })
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setNewComment('');
        showToast('Commentaire ajouté !', 'success');
        refetchComments();
        queryClient.invalidateQueries({ queryKey: ['questions'] });
        onRefresh();
      } else {
        showToast(data.error || 'Erreur', 'error');
      }
    },
    onError: () => {
      showToast('Erreur lors de l\'ajout du commentaire', 'error');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        showToast('Commentaire supprimé', 'success');
        refetchComments();
        queryClient.invalidateQueries({ queryKey: ['questions'] });
        onRefresh();
      } else {
        showToast(data.error || 'Erreur', 'error');
      }
    },
    onError: () => {
      showToast('Erreur lors de la suppression', 'error');
    },
  });

  const handleLike = () => {
    if (!isLoggedIn) {
      showToast('Connectez-vous pour aimer', 'warning');
      return;
    }
    toggleLike();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Écrivez un commentaire', 'warning');
      return;
    }
    if (!isLoggedIn) {
      showToast('Connectez-vous pour commenter', 'warning');
      return;
    }
    commentMutation.mutate(newComment.trim());
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    deleteCommentMutation.mutate(commentId);
  };

  const handleViewDetails = () => {
    router.push(`/questions/${question.id}`);
  };

  // ✅ Share functionality
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/questions/${question.id}`;
    const title = question.title || 'Question sur bacplus';
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Voir cette question sur bacplus: ${title}`,
          url: url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      showToast('🔗 Lien copié dans le presse-papier !', 'success');
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setShareCopied(true);
        showToast('🔗 Lien copié dans le presse-papier !', 'success');
        setTimeout(() => setShareCopied(false), 3000);
      } catch {
        showToast('Impossible de copier le lien', 'error');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Author - Clickable */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <Link 
          href={`/profile/${question.user_id}`} 
          className="flex-shrink-0"
        >
          <img 
            src={question.author_avatar || '/default-avatar.png'} 
            alt={question.author_name} 
            className="w-10 h-10 rounded-full border-2 border-orange-500/20 object-cover hover:border-orange-500 transition" 
            onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }} 
          />
        </Link>
        <div>
          <Link 
            href={`/profile/${question.user_id}`} 
            className="font-medium text-gray-900 text-sm flex items-center gap-1.5 hover:text-orange-500 transition"
          >
            {question.author_name || 'Anonyme'}
            <VerifiedBadge role={question.author_role || 'student'} size="sm" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {question.subject_name || 'Sans matière'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(question.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <h3 className="font-semibold text-gray-900 text-base mb-1.5 line-clamp-2">
          {question.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2">{question.content}</p>
      </div>

      {/* Code */}
      {question.code_content && (
        <div className="px-4 pb-2">
          <CodeBlock code={question.code_content} language={question.code_language || 'javascript'} />
        </div>
      )}

      {/* Image */}
      {question.image && (
        <div className="px-4 pb-2 cursor-pointer" onClick={() => onImageClick(question.image!.image_url)}>
          <img 
            src={question.image.image_url} 
            alt="Image" 
            className="rounded-xl w-full h-48 object-cover hover:opacity-90 transition" 
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
          />
        </div>
      )}

      {/* View Details */}
      <div className="px-4 pb-3">
        <button 
          onClick={handleViewDetails}
          className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition group"
        >
          <span>Voir plus</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-50">
        <button 
          onClick={handleLike} 
          disabled={!isLoggedIn}
          className={`
            flex items-center gap-1 text-sm transition-all duration-200
            ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}
            cursor-pointer
          `}
        >
          <Heart className={`w-4 h-4 transition-all duration-200 ${liked ? 'fill-red-500 scale-110' : ''}`} />
          <span className="font-medium">{formatNumber(likesCount)}</span>
        </button>
        
        <button 
          onClick={() => { 
            if (!isLoggedIn) {
              showToast('Connectez-vous pour commenter', 'warning');
              return;
            }
            setShowComments(!showComments); 
          }} 
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{formatNumber(question.comments_count || 0)}</span>
        </button>
        
        {/* ✅ Fixed Share Button */}
        <button 
          onClick={handleShare}
          className={`flex items-center gap-1 text-sm transition ${
            shareCopied ? 'text-green-500' : 'text-gray-500 hover:text-orange-500'
          }`}
          title="Partager"
        >
          {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        </button>
        
        {!isLoggedIn && (
          <button 
            onClick={() => signIn('google', { callbackUrl: '/' })} 
            className="text-xs text-orange-500 hover:text-orange-600 font-medium ml-auto"
          >
            Connectez-vous
          </button>
        )}
      </div>

      {/* Comments */}
      {showComments && isLoggedIn && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
            {loadingComments ? (
              <div className="text-center py-4">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-500" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucun commentaire</p>
            ) : (
              comments.map((c: Comment) => (
                <div key={c.id} className="flex gap-2 group">
                  <img 
                    src={c.author_avatar || '/default-avatar.png'} 
                    alt="" 
                    className="w-8 h-8 rounded-full flex-shrink-0" 
                    onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }}
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 relative">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-800">{c.author_name}</p>
                      {currentUserId === c.user_id && (
                        <button 
                          onClick={() => handleDeleteComment(c.id)} 
                          disabled={deleteCommentMutation.isPending}
                          className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        >
                          {deleteCommentMutation.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{c.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(c.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              placeholder="Écrire un commentaire..." 
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
              disabled={commentMutation.isPending}
            />
            <button 
              type="submit" 
              disabled={commentMutation.isPending || !newComment.trim()} 
              className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center min-w-[40px]"
            >
              {commentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}

      {showComments && !isLoggedIn && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Connectez-vous pour voir les commentaires</p>
            <button 
              onClick={() => signIn('google', { callbackUrl: '/' })} 
              className="px-4 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
            >
              Se connecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
});