'use client';

import { memo, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Heart, MessageCircle, Share2, Clock, BookOpen, 
  Loader2, X, Send, CheckCircle, Code
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

interface QuestionCardProps {
  question: any;
  isLoggedIn: boolean;
  currentUserId?: string;
  onRefresh: () => void;
  onImageClick: (url: string) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
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
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  // Fetch like status
  const { data: likeData, refetch: refetchLikes } = useQuery({
    queryKey: ['likes', question.id],
    queryFn: async () => {
      const res = await fetch(`/api/likes?questionId=${question.id}`);
      return res.json();
    },
    staleTime: 10000,
    enabled: isLoggedIn,
    initialData: { count: question.like_count || 0, liked: false }
  });

  // Fetch comments
  const { data: commentsData, refetch: refetchComments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments', question.id],
    queryFn: async () => {
      const res = await fetch(`/api/comments?questionId=${question.id}`);
      const data = await res.json();
      return data.comments || [];
    },
    enabled: showComments,
    staleTime: 30000,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id })
      });
      return res.json();
    },
    onSuccess: (data) => {
      // Update like data optimistically
      queryClient.setQueryData(['likes', question.id], (old: any) => ({
        ...old,
        count: data.liked ? (old?.count || 0) + 1 : (old?.count || 0) - 1,
        liked: data.liked
      }));
      // Invalidate questions list to update counts
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      onRefresh();
    }
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, content })
      });
      return res.json();
    },
    onSuccess: () => {
      refetchComments();
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      onRefresh();
    }
  });

  const handleLike = () => {
    if (!isLoggedIn) return;
    likeMutation.mutate();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedIn) return;
    commentMutation.mutate(newComment.trim());
    setNewComment('');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    const res = await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
    if (res.ok) {
      refetchComments();
      onRefresh();
    }
  };

  const likes = likeData || { count: 0, liked: false };
  const comments = commentsData || [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Author */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <img 
          src={question.author_avatar || '/default-avatar.png'} 
          alt={question.author_name} 
          className="w-10 h-10 rounded-full border-2 border-orange-500/20 object-cover" 
          onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }} 
        />
        <div>
          <p className="font-medium text-gray-900 text-sm flex items-center gap-1.5">
            {question.author_name || 'Anonyme'}
            <VerifiedBadge role={question.author_role || 'student'} size="sm" />
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {question.subject_name || 'Sans matière'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(question.created_at).toLocaleDateString('fr-FR', { 
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
              })}
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
        <div className="px-4 pb-2 cursor-pointer" onClick={() => onImageClick(question.image.image_url)}>
          <img 
            src={question.image.image_url} 
            alt="Image" 
            className="rounded-xl w-full h-48 object-cover hover:opacity-90 transition" 
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
          />
        </div>
      )}

      {/* Read More */}
      <div className="px-4 pb-3">
        <Link 
          href={`/questions/${question.id}`} 
          className="inline-block text-sm font-medium text-orange-500 hover:text-orange-600 transition group"
        >
          <span className="flex items-center gap-1">
            Voir plus → 
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-50">
        <button 
          onClick={handleLike} 
          disabled={likeMutation.isPending} 
          className={`flex items-center gap-1 text-sm transition ${likes.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} ${likeMutation.isPending ? 'opacity-50' : ''}`}
        >
          {likeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-4 h-4 ${likes.liked ? 'fill-red-500' : ''}`} />}
          <span>{formatNumber(likes.count)}</span>
        </button>
        <button 
          onClick={() => { if (!isLoggedIn) return; setShowComments(!showComments); }} 
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{formatNumber(question.comments_count || 0)}</span>
        </button>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition">
          <Share2 className="w-4 h-4" />
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
              <div className="text-center py-2">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-500" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-2">Aucun commentaire</p>
            ) : (
              comments.map((c: any) => (
                <div key={c.id} className="flex gap-2 group">
                  <img 
                    src={c.author_avatar || '/default-avatar.png'} 
                    alt="" 
                    className="w-8 h-8 rounded-full flex-shrink-0" 
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 relative">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-800">{c.author_name}</p>
                      {currentUserId === c.user_id && (
                        <button 
                          onClick={() => handleDeleteComment(c.id)} 
                          className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{c.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(c.created_at).toLocaleDateString('fr-FR', { 
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
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