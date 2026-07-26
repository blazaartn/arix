'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    BookOpen, Clock, Heart, MessageCircle, Share2,
    ArrowLeft, Send, Loader2, Eye, Award, ThumbsUp,
    Image as ImageIcon, X, Home, Code, CheckCircle,
    AlertCircle, Trash2, Edit2, MoreVertical
} from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import DOMPurify from 'dompurify';

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
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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

// ✅ HTML Preview Modal (kept compact)
function HtmlPreviewModal({ html, isOpen, onClose }: { html: string; isOpen: boolean; onClose: () => void }) {
    const [sanitizedHtml, setSanitizedHtml] = useState('');
    useEffect(() => {
        if (html && isOpen) {
            const clean = DOMPurify.sanitize(html, {
                ALLOWED_TAGS: ['a','abbr','acronym','address','area','article','aside','audio','b','bdi','bdo','big','blockquote','body','br','button','canvas','caption','center','cite','code','col','colgroup','command','datalist','dd','del','details','dfn','dialog','dir','div','dl','dt','em','embed','fieldset','figcaption','figure','font','footer','form','frame','frameset','h1','h2','h3','h4','h5','h6','head','header','hgroup','hr','html','i','iframe','img','input','ins','kbd','label','legend','li','link','main','map','mark','menu','meta','meter','nav','noframes','noscript','object','ol','optgroup','option','output','p','param','pre','progress','q','rp','rt','ruby','s','samp','section','select','small','source','span','strike','strong','style','sub','summary','sup','svg','table','tbody','td','textarea','tfoot','th','thead','time','title','tr','track','tt','u','ul','var','video','wbr'],
                ALLOWED_ATTR: ['accept','action','align','alt','autocomplete','autofocus','autoplay','background','bgcolor','border','cellpadding','cellspacing','checked','cite','class','clear','color','cols','colspan','controls','coords','data','datetime','default','dir','disabled','download','enctype','face','for','headers','height','hidden','high','href','hreflang','id','ismap','label','lang','list','loop','low','max','maxlength','media','method','min','multiple','name','noshade','novalidate','nowrap','open','optimum','pattern','placeholder','poster','preload','readonly','rel','required','rev','reversed','rows','rowspan','sandbox','scope','selected','shape','size','sizes','span','srclang','start','step','style','summary','tabindex','target','title','type','usemap','valign','value','width','wrap'],
                ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
            });
            setSanitizedHtml(clean);
        }
    }, [html, isOpen]);
    if (!isOpen || !html) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black/50 rounded-full p-2">
                <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                        <span className="text-sm text-gray-500 ml-2">Aperçu HTML</span>
                    </div>
                    <span className="text-xs text-gray-400">Code sécurisé</span>
                </div>
                <div className="flex-1 overflow-auto p-6 bg-white">
                    <iframe srcDoc={sanitizedHtml} sandbox="allow-scripts allow-modals allow-same-origin" className="w-full h-full border-0" title="HTML Preview" loading="lazy" />
                </div>
            </div>
        </div>
    );
}

// ✅ Fullscreen Code Viewer (compact)
function FullscreenCodeViewer({ code, language, isOpen, onClose }: { code: string; language: string; isOpen: boolean; onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (!isOpen || !code) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black/50 rounded-full p-2"><X className="w-8 h-8" /></button>
            <div className="w-full max-w-4xl max-h-[85vh] bg-gray-900 rounded-xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
                    <span className="text-sm text-gray-300 font-mono">{language || 'code'}</span>
                    <button onClick={handleCopy} className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm">
                        {copied ? <span className="text-green-400">✓ Copié</span> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copier</>}
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap break-words"><code>{code}</code></pre>
                </div>
            </div>
        </div>
    );
}

// ✅ Code Block (compact)
function CodeBlock({ code, language }: { code: string; language: string }) {
    const [copied, setCopied] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const isHtml = language === 'html' || language === 'HTML' || language === 'htm';
    const MAX_LINES = 20, MAX_CHARS = 2000, FULLSCREEN_LINES = 50, FULLSCREEN_CHARS = 5000;
    const lines = code.split('\n');
    const totalLines = lines.length;
    const totalChars = code.length;
    const isTooLong = totalLines > MAX_LINES || totalChars > MAX_CHARS;
    const needsFullscreen = totalLines > FULLSCREEN_LINES || totalChars > FULLSCREEN_CHARS;
    const truncatedLines = lines.slice(0, MAX_LINES);
    const truncatedCode = truncatedLines.join('\n');
    const handleCopy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (!code) return null;
    return (
        <>
            <div className="relative my-2 rounded-lg overflow-hidden border border-gray-200">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 text-xs">
                    <div className="flex items-center gap-3">
                        <span className="font-mono">{language || 'code'}</span>
                        {isTooLong && <span className="text-yellow-400 text-[10px] bg-yellow-400/20 px-2 py-0.5 rounded">{totalLines} lignes</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        {isHtml && <button onClick={() => setShowPreview(true)} className="flex items-center gap-1 hover:text-white transition px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>Aperçu</button>}
                        <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white transition">{copied ? <span className="text-green-400">✓ Copié</span> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copier</>}</button>
                        {needsFullscreen && <button onClick={() => setShowFullscreen(true)} className="flex items-center gap-1 hover:text-white transition px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>Plein écran</button>}
                    </div>
                </div>
                <div className="relative">
                    <div className={`p-4 bg-gray-900 overflow-x-auto ${isTooLong ? 'max-h-64' : ''}`}>
                        <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap break-words"><code>{isTooLong ? truncatedCode : code}</code></pre>
                    </div>
                    {isTooLong && (
                        <>
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pointer-events-none"></div>
                            <button onClick={() => setShowFullscreen(true)} className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition shadow-lg">Voir tout le code ({totalLines} lignes)</button>
                        </>
                    )}
                </div>
            </div>
            {isHtml && <HtmlPreviewModal html={code} isOpen={showPreview} onClose={() => setShowPreview(false)} />}
            {needsFullscreen && <FullscreenCodeViewer code={code} language={language} isOpen={showFullscreen} onClose={() => setShowFullscreen(false)} />}
        </>
    );
}

// ✅ Image Viewer
function ImageViewer({ imageUrl, isOpen, onClose }: { imageUrl: string | null; isOpen: boolean; onClose: () => void }) {
    if (!isOpen || !imageUrl) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"><X className="w-8 h-8" /></button>
            <img src={imageUrl} alt="Full screen" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
    );
}

// ✅ Comment Pagination
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
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : '←'}
            </button>
            <span className="text-sm text-gray-600">
                {currentPage} / {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : '→'}
            </button>
        </div>
    );
}

export default function QuestionDetailPage() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [commentImages, setCommentImages] = useState<File[]>([]);
    const [commentImagePreviews, setCommentImagePreviews] = useState<string[]>([]);
    const [viewerImage, setViewerImage] = useState<string | null>(null);
    const [commentPage, setCommentPage] = useState(1);
    const [totalCommentPages, setTotalCommentPages] = useState(1);
    const [isCommentPageLoading, setIsCommentPageLoading] = useState(false);
    const [commentLikes, setCommentLikes] = useState<Record<string, { liked: boolean; count: number }>>({});
    const commentsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, [params.id, commentPage]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        setIsCommentPageLoading(true);
        try {
            const res = await fetch(`/api/questions?id=${params.id}`);
            const data = await res.json();
            
            if (data.error) {
                setError(data.error);
                return;
            }

            if (data.success && data.question) {
                const allComments = data.question.comments || [];
                const start = (commentPage - 1) * commentsPerPage;
                const end = start + commentsPerPage;
                const paginatedComments = allComments.slice(start, end);
                
                setQuestion({
                    ...data.question,
                    comments: paginatedComments,
                });
                setTotalCommentPages(Math.ceil(allComments.length / commentsPerPage) || 1);
                setLikesCount(data.question.like_count || 0);
                setLiked(data.question.userLiked || false);
            } else {
                setError('Question non trouvée');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Erreur de chargement');
        } finally {
            setLoading(false);
            setIsCommentPageLoading(false);
        }
    };

    // ✅ Handle question like
    const handleLike = async () => {
        if (!session || isLiking) return;
        setIsLiking(true);
        try {
            const res = await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId: params.id })
            });
            const data = await res.json();
            if (data.liked !== undefined) {
                setLiked(data.liked);
                setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error('Error liking question:', error);
        } finally {
            setIsLiking(false);
        }
    };

    // ✅ Handle comment like
    const handleCommentLike = async (commentId: string) => {
        if (!session) return;
        
        const current = commentLikes[commentId] || { liked: false, count: 0 };
        const newLiked = !current.liked;
        
        // Optimistic update
        setCommentLikes(prev => ({
            ...prev,
            [commentId]: {
                liked: newLiked,
                count: newLiked ? current.count + 1 : current.count - 1
            }
        }));

        try {
            const res = await fetch('/api/comments/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId })
            });
            const data = await res.json();
            if (!data.success) {
                // Revert on error
                setCommentLikes(prev => ({
                    ...prev,
                    [commentId]: current
                }));
            }
        } catch (error) {
            // Revert on error
            setCommentLikes(prev => ({
                ...prev,
                [commentId]: current
            }));
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() && commentImages.length === 0) return;
        if (!session) {
            signIn('google');
            return;
        }

        setSubmitting(true);
        try {
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
                    content: newComment.trim(),
                    imageIds: uploadedImageIds
                })
            });

            const data = await res.json();
            if (data.success) {
                setNewComment('');
                setCommentImages([]);
                setCommentImagePreviews([]);
                // Reset to first page to see new comment
                setCommentPage(1);
                fetchData();
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCommentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + commentImages.length > 3) {
            alert('Maximum 3 images par commentaire');
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

    const handleCommentPageChange = (page: number) => {
        if (page >= 1 && page <= totalCommentPages && !isCommentPageLoading) {
            setCommentPage(page);
            document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    <p className="text-gray-400 text-sm">Chargement de la question...</p>
                </div>
            </div>
        );
    }

    if (error || !question) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{error || 'Question non trouvée'}</p>
                    <Link href="/" className="mt-4 inline-block text-orange-500 hover:text-orange-600">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3 max-w-3xl mx-auto">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 flex-1 truncate">Détails</h1>
                    <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Home className="w-5 h-5" />
                    </Link>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Share2 className="w-5 h-5" />
                    </button>
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
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {question.view_count || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">{question.title}</h1>
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">{question.content}</p>

                    {question.code_content && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Code className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">Code</span>
                            </div>
                            <CodeBlock code={question.code_content} language={question.code_language || 'javascript'} />
                        </div>
                    )}

                    {question.images && question.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {question.images.map((img) => (
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

                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                        <button 
                            onClick={handleLike}
                            disabled={isLiking}
                            className={`flex items-center gap-2 text-sm transition-all duration-200 ${
                                liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLiking ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Heart className={`w-5 h-5 transition-all ${liked ? 'fill-red-500 scale-110' : ''}`} />
                            )}
                            <span className="font-medium">{formatNumber(likesCount)}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">{formatNumber(question.comments?.length || 0)}</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div id="comments-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {question.comments?.length || 0} Commentaire{question.comments?.length !== 1 ? 's' : ''}
                    </h2>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {question.comments?.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400">Aucun commentaire</p>
                                <p className="text-sm text-gray-300">Soyez le premier à commenter !</p>
                            </div>
                        ) : (
                            question.comments?.map((comment) => {
                                const likeData = commentLikes[comment.id] || { 
                                    liked: comment.user_liked || false, 
                                    count: comment.like_count || 0 
                                };
                                return (
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
                                            </div>
                                            <p className="text-gray-700 text-sm">{comment.content}</p>
                                            {comment.images && comment.images.length > 0 && (
                                                <div className="grid grid-cols-3 gap-2 mt-2">
                                                    {comment.images.map((img) => (
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
                                            <button 
                                                onClick={() => handleCommentLike(comment.id)}
                                                className={`text-xs mt-2 flex items-center gap-1 transition ${
                                                    likeData.liked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
                                                }`}
                                            >
                                                <ThumbsUp className={`w-3 h-3 ${likeData.liked ? 'fill-blue-500' : ''}`} />
                                                {likeData.count > 0 && formatNumber(likeData.count)}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <CommentPagination 
                        currentPage={commentPage}
                        totalPages={totalCommentPages}
                        onPageChange={handleCommentPageChange}
                        isLoading={isCommentPageLoading}
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
                                <button
                                    type="submit"
                                    disabled={submitting || (!newComment.trim() && commentImages.length === 0)}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {submitting ? 'Publication...' : 'Commenter'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-xl mt-4">
                            <p className="text-gray-500 mb-2">Connectez-vous pour commenter</p>
                            <button 
                                onClick={() => signIn('google')}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                            >
                                Se connecter
                            </button>
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