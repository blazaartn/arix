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
import { useToast } from '@/contexts/ToastContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

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
  image?: any;
  code_content?: string;
  code_language?: string;
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
  const [liked, setLiked] = useState(question.userLiked || false);
  const [likesCount, setLikesCount] = useState(question.like_count || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!isLoggedIn || isLiking) {
      if (!isLoggedIn) showToast('Connectez-vous pour aimer', 'warning');
      return;
    }

    setIsLiking(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id })
      });
      const data = await res.json();
      if (data.count !== undefined) {
        setLikesCount(data.count);
        setLiked(data.liked);
      }
    } catch {
      // Revert on error
      setLiked(!newLiked);
      setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLiking(false);
    }
  };

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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-600 transition-all duration-300 overflow-hidden group">
      {/* Header with author info */}
      <div className="flex items-center gap-3 p-5">
        <Link href={`/profile/${question.user_id}`} className="flex-shrink-0">
          <img src={question.author_avatar || '/default-avatar.png'} alt={question.author_name} className="w-11 h-11 rounded-lg border-2 border-orange-500/20 object-cover hover:border-orange-500 transition" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${question.user_id}`} className="font-semibold text-slate-900 dark:text-slate-50 text-sm flex items-center gap-1.5 hover:text-orange-600 transition">
            {question.author_name || 'Anonyme'}
            <VerifiedBadge size="sm" role={''} />
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded"><BookOpen className="w-3 h-3" />{question.subject_name || 'Général'}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(question.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-50 text-base mb-2 line-clamp-2 leading-tight">{question.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">{question.content}</p>
      </div>

      {/* Code block if present */}
      {question.code_content && (
        <div className="px-5 pb-4">
          <pre className="p-3 bg-slate-900 dark:bg-slate-950 rounded-lg overflow-x-auto text-xs text-slate-300 font-mono border border-slate-700">{question.code_content}</pre>
        </div>
      )}

      {/* Image if present */}
      {question.image && (
        <div className="px-5 pb-4 cursor-pointer" onClick={() => onImageClick(question.image.image_url)}>
          <img src={question.image.image_url} alt="Image" className="rounded-lg w-full h-40 object-cover hover:opacity-90 transition" />
        </div>
      )}

      {/* Stats and Actions Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} disabled={!isLoggedIn || isLiking} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-slate-600 dark:text-slate-400 hover:text-red-500'} cursor-pointer`}>
            <Heart className={`w-4 h-4 transition-all duration-200 ${liked ? 'fill-red-500 scale-110' : ''}`} />
            <span>{formatNumber(likesCount)}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition">
            <MessageCircle className="w-4 h-4" />
            <span>{formatNumber(question.comments_count || 0)}</span>
          </button>
          <button onClick={handleShare} className={`flex items-center gap-1.5 text-sm font-medium transition ${shareCopied ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400'}`}>
            {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
        <button onClick={() => router.push(`/questions/${question.id}`)} className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 transition group/link">
          <span>Voir</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </button>
      </div>

      {showComments && isLoggedIn && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
            <p className="text-sm text-gray-400 text-center py-4">Aucun commentaire</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); }} className="flex gap-2">
            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Écrire un commentaire..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            <button type="submit" className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center min-w-[40px]">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
});
