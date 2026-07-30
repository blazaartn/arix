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
import { AlertButton } from './AlertButton';
import { UserBadges } from './Badge';
import { useToast } from '@/contexts/ToastContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useLikes } from '@/hooks/useLikes';

interface Question {
  id: string;
  title: string;
  content: string;
  user_id: string;
  subject_name: string;
  author_name: string;
  author_avatar: string;
  author_role: string;
  user_rank?: number;
  view_count: number;
  created_at: string;
  comments_count: number;
  like_count: number;
  images_count: number;
  userLiked?: boolean;
  image?: any;
  code_content?: string;
  code_language?: string;
  is_blocked?: boolean;
  alert_count?: number;
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
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { 
    count: likesCount, 
    liked, 
    toggleLike,
    isPending: isLikePending
  } = useLikes(
    question.id,
    question.like_count || 0,
    question.userLiked || false
  );

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/questions/${question.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: question.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      showToast('🔗 Lien copié !', 'success');
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      showToast('Impossible de copier', 'error');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Écrivez un commentaire', 'warning');
      return;
    }
    if (!isLoggedIn) {
      showToast('Connectez-vous pour commenter', 'warning');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          content: newComment.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewComment('');
        showToast('Commentaire ajouté !', 'success');
        onRefresh();
        queryClient.invalidateQueries({ queryKey: ['questions'] });
      } else {
        showToast(data.error || 'Erreur', 'error');
      }
    } catch {
      showToast('Erreur lors de l\'ajout', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (question.is_blocked) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Author */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <Link href={`/profile/${question.user_id}`} className="flex-shrink-0">
          <img 
            src={question.author_avatar || '/default-avatar.png'} 
            alt={question.author_name} 
            className="w-10 h-10 rounded-full border-2 border-orange-500/20 object-cover hover:border-orange-500 transition" 
          />
        </Link>
        <div>
          <Link 
            href={`/profile/${question.user_id}`} 
            className="font-medium text-gray-900 text-sm flex items-center gap-1.5 hover:text-orange-500 transition flex-wrap"
          >
            {question.author_name || 'Anonyme'}
            <UserBadges 
              userId={question.user_id}
              userName={question.author_name}
              role={question.author_role || ''}
              rank={question.user_rank || 0}
              size="sm"
            />
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
        <p className="text-gray-500 text-sm line-clamp-2">
          {question.content}
        </p>
      </div>

      {/* Code Block (truncated) */}
      {question.code_content && (
        <div className="px-4 pb-2">
          <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
            <pre className="text-xs text-gray-200 font-mono whitespace-pre-wrap line-clamp-3">
              {question.code_content}
            </pre>
          </div>
        </div>
      )}

      {/* Image */}
      {question.image && (
        <div className="px-4 pb-2 cursor-pointer" onClick={() => onImageClick(question.image.image_url)}>
          <img 
            src={question.image.image_url} 
            alt="Image" 
            className="rounded-xl w-full h-48 object-cover hover:opacity-90 transition" 
          />
        </div>
      )}

      {/* View more */}
      <div className="px-4 pb-3">
        <button 
          onClick={() => router.push(`/questions/${question.id}`)} 
          className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition group"
        >
          <span>Voir plus</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-50">
        <button 
          onClick={toggleLike} 
          disabled={!isLoggedIn || isLikePending} 
          className={`flex items-center gap-1 text-sm transition-all duration-200 ${
            liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          } ${!isLoggedIn ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <Heart className={`w-4 h-4 transition-all duration-200 ${liked ? 'fill-red-500 scale-110' : ''}`} />
          <span className="font-medium">
            {isLikePending ? (
              <Loader2 className="w-3 h-3 animate-spin inline" />
            ) : (
              formatNumber(likesCount)
            )}
          </span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)} 
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{formatNumber(question.comments_count || 0)}</span>
        </button>
        
        <button 
          onClick={handleShare} 
          className={`flex items-center gap-1 text-sm transition ${
            shareCopied ? 'text-green-500' : 'text-gray-500 hover:text-orange-500'
          }`}
        >
          {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        </button>

        <AlertButton 
          targetId={question.id}
          targetType="question"
          size="sm"
          authorId={question.user_id}
          onAlert={onRefresh}
        />

        {!isLoggedIn && (
          <button 
            onClick={() => signIn('google', { callbackUrl: '/' })} 
            className="text-xs text-orange-500 hover:text-orange-600 font-medium ml-auto"
          >
            Connectez-vous
          </button>
        )}
      </div>

      {/* Comments section */}
      {showComments && isLoggedIn && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
            <p className="text-sm text-gray-400 text-center py-4">
              {question.comments_count === 0 ? 'Aucun commentaire' : `${question.comments_count} commentaires`}
            </p>
          </div>
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              placeholder="Écrire un commentaire..." 
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isSubmittingComment}
            />
            <button 
              type="submit" 
              disabled={isSubmittingComment || !newComment.trim()} 
              className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center min-w-[40px]"
            >
              {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
});