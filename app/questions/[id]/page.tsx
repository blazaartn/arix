'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BookOpen, Clock, Heart, MessageCircle, Share2,
  ArrowLeft, Send, Eye, Award, ThumbsUp,
  Image as ImageIcon, X, Home, Code, CheckCircle,
  AlertCircle, Trash2, Edit2, MoreVertical,
  Loader2, Check
} from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/contexts/ToastContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { useLikes } from '@/hooks/useLikes';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface Image {
  id: string;
  image_url: string;
  caption: string;
  is_primary: boolean;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  author_role: string;
  created_at: string;
  like_count: number;
  user_liked?: boolean;
  images: Image[];
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
  images: Image[];
  comments: Comment[];
  userLiked: boolean;
  code_content?: string;
  code_language?: string;
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

// ✅ Share Button Component
function ShareButton({ url, title }: { url: string; title: string }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
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
      setCopied(true);
      showToast('🔗 Lien copié dans le presse-papier !', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        showToast('🔗 Lien copié dans le presse-papier !', 'success');
        setTimeout(() => setCopied(false), 3000);
      } catch {
        showToast('Impossible de copier le lien', 'error');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-2 rounded-lg transition-all duration-200 ${
        copied 
          ? 'bg-green-100 text-green-600' 
          : 'hover:bg-gray-100 text-gray-600 hover:text-orange-500'
      }`}
      title="Partager"
    >
      {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
    </button>
  );
}

// ✅ Math rendering function
function renderMath(content: string): string {
  if (typeof window === 'undefined') return content;
  
  try {
    // Replace $$...$$ with rendered math (block display)
    const mathRegex = /\$\$([\s\S]*?)\$\$/g;
    // Replace $...$ with rendered math (inline display)
    const inlineRegex = /\$([^\$]+?)\$/g;
    
    let rendered = content;
    
    // Render block math ($$ ... $$) - do this first
    rendered = rendered.replace(mathRegex, (match, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
          trust: true,
        });
      } catch {
        return match;
      }
    });
    
    // Render inline math ($ ... $)
    rendered = rendered.replace(inlineRegex, (match, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
          trust: true,
        });
      } catch {
        return match;
      }
    });
    
    return rendered;
  } catch {
    return content;
  }
}

// ✅ Math Content Component
function MathContent({ content, className = '' }: { content: string; className?: string }) {
  const [renderedHtml, setRenderedHtml] = useState('');

  useEffect(() => {
    setRenderedHtml(renderMath(content));
  }, [content]);

  if (!content) return null;

  return (
    <div 
      className={`math-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}

// Question Detail Skeleton
function QuestionDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="flex items-center gap-6 pt-4 mt-4 border-t border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionDetailContent() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [commentImages, setCommentImages] = useState<File[]>([]);
  const [commentImagePreviews, setCommentImagePreviews] = useState<string[]>([]);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [commentPage, setCommentPage] = useState(1);
  const commentsPerPage = 10;

  // Get current URL for sharing
  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  // Fetch question data
  const { 
    data: question, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['question', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/questions/${params.id}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.success || !data.question) throw new Error('Question non trouvée');
      
      const allComments = data.question.comments || [];
      const start = (commentPage - 1) * commentsPerPage;
      const end = start + commentsPerPage;
      const paginatedComments = allComments.slice(start, end);
      
      // Map user_liked to userLiked for comments consistency
      const mappedComments = paginatedComments.map((comment: any) => ({
        ...comment,
        userLiked: comment.user_liked
      }));
      
      return {
        ...data.question,
        comments: mappedComments,
        totalComments: allComments.length
      };
    },
    staleTime: 60000,
    retry: 2,
  });

  // Instant likes
  const { 
    count: likesCount, 
    liked, 
    toggleLike 
  } = useLikes(
    params.id as string,
    question?.like_count || 0,
    question?.userLiked || false
  );

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!session) {
        showToast('Connectez-vous pour commenter', 'warning');
        return null;
      }
      
      let uploadedImageIds: string[] = [];
      if (commentImages.length > 0) {
        const formData = new FormData();
        commentImages.forEach(img => formData.append('images', img));
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedImageIds = uploadData.images.map((img: any) => img.id);
        }
      }

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: params.id,
          content,
          imageIds: uploadedImageIds
        })
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data && data.success) {
        setNewComment('');
        setCommentImages([]);
        setCommentImagePreviews([]);
        showToast('Commentaire ajouté !', 'success');
        refetch();
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      } else if (data && data.error) {
        showToast(data.error, 'error');
      }
    },
    onError: () => {
      showToast('Erreur lors de l\'ajout du commentaire', 'error');
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        showToast('Commentaire supprimé', 'success');
        refetch();
      } else {
        showToast(data.error || 'Erreur', 'error');
      }
    },
    onError: () => {
      showToast('Erreur lors de la suppression', 'error');
    },
  });

  const handleLike = () => {
    if (!session) {
      showToast('Connectez-vous pour aimer', 'warning');
      return;
    }
    toggleLike();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && commentImages.length === 0) {
      showToast('Écrivez un commentaire', 'warning');
      return;
    }
    if (!session) {
      showToast('Connectez-vous pour commenter', 'warning');
      return;
    }
    commentMutation.mutate(newComment.trim());
  };

  const handleCommentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + commentImages.length > 3) {
      showToast('Maximum 3 images par commentaire', 'warning');
      return;
    }
    setCommentImages([...commentImages, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setCommentImagePreviews([...commentImagePreviews, ...previews]);
  };

  const removeCommentImage = (index: number) => {
    setCommentImages(commentImages.filter((_, i) => i !== index));
    setCommentImagePreviews(commentImagePreviews.filter((_, i) => i !== index));
  };

  const handleCommentLike = (commentId: string) => {
    fetch('/api/comments/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId })
    }).catch(() => {});
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    deleteCommentMutation.mutate(commentId);
  };

  const handleCommentPageChange = (page: number) => {
    if (page >= 1 && page !== commentPage) {
      setCommentPage(page);
      document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading || status === 'loading') {
    return <QuestionDetailSkeleton />;
  }

  if (error || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{error instanceof Error ? error.message : 'Question non trouvée'}</p>
          <Link href="/" className="mt-4 inline-block text-orange-500 hover:text-orange-600">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil((question.totalComments || 0) / commentsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 truncate max-w-[120px] sm:max-w-xs">Détails</h1>
          </div>
          <div className="flex items-center gap-1">
            <ShareButton url={shareUrl} title={question.title} />
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Home className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={question.author_avatar || '/default-avatar.png'} 
              alt={question.author_name}
              className="w-12 h-12 rounded-full border-2 border-orange-500/20"
              onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }}
            />
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                {question.author_name || 'Anonyme'}
                <VerifiedBadge role={question.author_role || 'student'} size="sm" />
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {question.subject_name || 'Sans matière'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(question.created_at)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {question.view_count || 0}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">{question.title}</h1>
          
          {/* ✅ CONTENT WITH MATH RENDERING */}
          <div className="text-gray-700 mb-4 prose prose-sm max-w-none">
            <MathContent content={question.content} />
          </div>

          {question.code_content && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Code</span>
              </div>
              <pre className="p-4 bg-gray-900 rounded-lg overflow-x-auto text-sm text-gray-200 font-mono">
                <code>{question.code_content}</code>
              </pre>
            </div>
          )}

          {question.images && question.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {question.images.map((img: Image) => (
                <div 
                  key={img.id}
                  className="cursor-pointer group relative overflow-hidden rounded-xl"
                  onClick={() => setViewerImage(img.image_url)}
                >
                  <img 
                    src={img.image_url}
                    alt={img.caption || 'Image'}
                    className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button 
              onClick={handleLike}
              disabled={!session}
              className={`
                flex items-center gap-2 text-sm transition-all duration-200
                ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}
                cursor-pointer
              `}
            >
              <Heart className={`w-5 h-5 transition-all duration-200 ${liked ? 'fill-red-500 scale-110' : ''}`} />
              <span className="font-medium">{formatNumber(likesCount)}</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{formatNumber(question.totalComments || 0)}</span>
            </button>
            <ShareButton url={shareUrl} title={question.title} />
          </div>
        </div>

        {/* Comments Section */}
        <div id="comments-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {question.totalComments || 0} Commentaire{question.totalComments !== 1 ? 's' : ''}
          </h2>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {question.comments?.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400">Aucun commentaire</p>
                <p className="text-sm text-gray-300">Soyez le premier à commenter !</p>
              </div>
            ) : (
              question.comments?.map((comment: Comment) => (
                <div key={comment.id} className="flex gap-3 group animate-fadeIn">
                  <img 
                    src={comment.author_avatar || '/default-avatar.png'} 
                    alt={comment.author_name}
                    className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }}
                  />
                  <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 text-sm flex items-center gap-1.5">
                          {comment.author_name}
                          <VerifiedBadge role={comment.author_role || 'student'} size="sm" />
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTime(comment.created_at)}
                        </p>
                      </div>
                      {session?.user?.id === comment.user_id && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                    {comment.images && comment.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {comment.images.map((img: Image) => (
                          <div 
                            key={img.id}
                            className="cursor-pointer rounded-lg overflow-hidden"
                            onClick={() => setViewerImage(img.image_url)}
                          >
                            <img 
                              src={img.image_url}
                              alt=""
                              className="rounded-lg object-cover w-full h-24 hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <CommentPagination 
            currentPage={commentPage}
            totalPages={totalPages || 1}
            onPageChange={handleCommentPageChange}
            isLoading={isLoading}
          />

          {session ? (
            <form onSubmit={handleCommentSubmit} className="space-y-3 mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <img 
                  src={session.user.avatar_url || '/default-avatar.png'} 
                  alt={session.user.name}
                  className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-gray-200"
                />
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Écrire un commentaire..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={2}
                  disabled={commentMutation.isPending}
                />
              </div>

              {commentImagePreviews.length > 0 && (
                <div className="flex gap-2 ml-12">
                  {commentImagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeCommentImage(index)}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 ml-12">
                <label className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer transition">
                  <ImageIcon className="w-4 h-4" />
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCommentImageUpload}
                    className="hidden"
                  />
                </label>
                <Button
                  type="submit"
                  loading={commentMutation.isPending}
                  disabled={(!newComment.trim() && commentImages.length === 0)}
                  fullWidth
                >
                  <Send className="w-4 h-4" />
                  Commenter
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-xl mt-4">
              <p className="text-gray-500 mb-2">Connectez-vous pour commenter</p>
              <Button onClick={() => signIn('google')}>
                Se connecter
              </Button>
            </div>
          )}
        </div>
      </main>

      <ImageViewer 
        imageUrl={viewerImage}
        isOpen={!!viewerImage}
        onClose={() => setViewerImage(null)}
      />
    </div>
  );
}

// Image Viewer
function ImageViewer({ imageUrl, isOpen, onClose }: { imageUrl: string | null; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !imageUrl) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"><X className="w-8 h-8" /></button>
      <img src={imageUrl} alt="Full screen" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    </div>
  );
}

// Comment Pagination
function CommentPagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
  isLoading: boolean;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-100 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : '←'}
      </button>
      <span className="text-sm text-gray-600">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : '→'}
      </button>
    </div>
  );
}

export default function QuestionDetailPage() {
  return (
    <ToastProvider>
      <QuestionDetailContent />
    </ToastProvider>
  );
}
