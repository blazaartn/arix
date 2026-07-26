'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, User, Mail, Award, Star, 
    MessageCircle, Heart, Eye, Clock,
    Calendar, BookOpen, TrendingUp, Share2,
    Loader2, Settings, LogOut, Edit2,
    CheckCircle, Sparkles, GraduationCap,
    Trash2, AlertCircle, X, ChevronRight,
    Info
} from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';

// ✅ Types
interface UserPost {
    id: string;
    title: string;
    content: string;
    subject_name: string;
    created_at: string;
    view_count: number;
    like_count: number;
    comments_count: number;
    images_count: number;
}

interface UserStats {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalViews: number;
    joinDate: string;
}

function formatNumber(num: number): string {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60 * 1000) return 'À l\'instant';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} min`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} h`;
    if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))} j`;
    if (diff < 30 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (30 * 24 * 60 * 60 * 1000))} mois`;
    return formatDate(dateString);
}

// ✅ Toast Component
function Toast({ 
    message, 
    type, 
    onClose 
}: { 
    message: string; 
    type: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
}) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />
    };

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] animate-fadeIn">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white ${bgColors[type]} max-w-md`}>
                {icons[type]}
                <span className="font-medium text-sm">{message}</span>
                <button onClick={onClose} className="ml-2 hover:opacity-80">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ✅ Post Skeleton
function PostSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                <div className="h-5 bg-gray-200 rounded w-12"></div>
                <div className="h-5 bg-gray-200 rounded w-12"></div>
                <div className="h-5 bg-gray-200 rounded w-12"></div>
            </div>
        </div>
    );
}

// ✅ Delete Post Modal
function DeleteModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onConfirm: () => void; 
    title: string; 
    message: string; 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex gap-2">
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                    >
                        Supprimer
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; postId: string; title: string }>({
        isOpen: false,
        postId: '',
        title: ''
    });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [stats, setStats] = useState<UserStats>({
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalViews: 0,
        joinDate: ''
    });

    // ✅ Redirect if not logged in
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    // ✅ Fetch user posts - FIXED: Use userId parameter
    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!session) return;
            
            setLoading(true);
            try {
                const res = await fetch(`/api/questions?userId=${session.user.id}`);
                const data = await res.json();
                
                if (data.success) {
                    setPosts(data.questions || []);
                    
                    // Calculate stats
                    const userPosts = data.questions || [];
                    const totalLikes = userPosts.reduce((acc: number, p: UserPost) => acc + (p.like_count || 0), 0);
                    const totalComments = userPosts.reduce((acc: number, p: UserPost) => acc + (p.comments_count || 0), 0);
                    const totalViews = userPosts.reduce((acc: number, p: UserPost) => acc + (p.view_count || 0), 0);
                    
                    setStats({
                        totalPosts: userPosts.length,
                        totalLikes,
                        totalComments,
                        totalViews,
                        joinDate: session.user.created_at || new Date().toISOString()
                    });
                }
            } catch (error) {
                console.error('Error fetching user posts:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserPosts();
    }, [session]);

    // ✅ Delete post
    const handleDeletePost = async () => {
        if (!deleteModal.postId) return;
        
        setDeleting(deleteModal.postId);
        try {
            const res = await fetch(`/api/questions?id=${deleteModal.postId}`, {
                method: 'DELETE',
            });
            
            const data = await res.json();
            
            if (data.success) {
                // ✅ Remove post from state
                setPosts(posts.filter(p => p.id !== deleteModal.postId));
                setStats(prev => ({
                    ...prev,
                    totalPosts: prev.totalPosts - 1
                }));
                setToast({ message: 'Question supprimée avec succès !', type: 'success' });
            } else {
                setToast({ message: data.error || 'Erreur lors de la suppression', type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Erreur lors de la suppression', type: 'error' });
        } finally {
            setDeleting(null);
            setDeleteModal({ isOpen: false, postId: '', title: '' });
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Toast */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, postId: '', title: '' })}
                onConfirm={handleDeletePost}
                title={`Supprimer "${deleteModal.title}"`}
                message="Cette action est irréversible. Tous les commentaires et likes associés seront également supprimés."
            />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-6 h-6 text-orange-500" />
                            Profil
                        </h1>
                    </div>
                    <Link 
                        href="/settings" 
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                    >
                        <Settings className="w-4 h-4" />
                        Paramètres
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* ✅ Profile Card - Banner + Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    {/* Banner */}
                    <div className="relative h-32 md:h-40 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                                {/* Avatar */}
                                <div className="relative -mt-12">
                                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                        <img 
                                            src={session.user.avatar_url || '/default-avatar.png'} 
                                            alt={session.user.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                                            }}
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-white">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-xl md:text-2xl font-bold">
                                            {session.user.name}
                                        </h2>
                                        <VerifiedBadge role={session.user.role || 'student'} size="md" showLabel />
                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                            ★ Niv. {session.user.level || 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/80 mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-3.5 h-3.5" />
                                            {session.user.email}
                                        </span>
                                        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Membre depuis {formatDate(stats.joinDate)}
                                        </span>
                                    </div>
                                </div>

                                {/* XP Badge */}
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                                    <Award className="w-5 h-5 text-yellow-300" />
                                    <div>
                                        <div className="text-xs text-white/70">XP Total</div>
                                        <div className="font-bold text-white">
                                            {formatNumber(session.user.xp_points || 0)} XP
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-orange-500">{stats.totalPosts}</div>
                        <div className="text-xs text-gray-500">Questions</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-red-500">{formatNumber(stats.totalLikes)}</div>
                        <div className="text-xs text-gray-500">Likes reçus</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-blue-500">{formatNumber(stats.totalComments)}</div>
                        <div className="text-xs text-gray-500">Commentaires</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-purple-500">{formatNumber(stats.totalViews)}</div>
                        <div className="text-xs text-gray-500">Vues</div>
                    </div>
                </div>

                {/* ✅ User Posts */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-orange-500" />
                            Mes Questions
                        </h3>
                        <span className="text-sm text-gray-400">
                            {stats.totalPosts} question{stats.totalPosts > 1 ? 's' : ''}
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Aucune question publiée</p>
                            <p className="text-sm text-gray-400">Commencez à poser des questions !</p>
                            <Link 
                                href="/" 
                                className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                            >
                                Poser une question
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {posts.map((post) => (
                                <div 
                                    key={post.id}
                                    className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-200 relative group"
                                >
                                    {/* ✅ Link wrapper - only wraps the content, not the delete button */}
                                    <div className="flex items-start justify-between">
                                        <Link href={`/questions/${post.id}`} className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full border border-orange-200">
                                                    {post.subject_name || 'Sans matière'}
                                                </span>
                                                {post.images_count > 0 && (
                                                    <span className="text-xs text-gray-400">🖼️</span>
                                                )}
                                            </div>
                                            <h4 className="text-base font-semibold text-gray-800 hover:text-orange-500 transition">
                                                {post.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatTimeAgo(post.created_at)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3" />
                                                    {formatNumber(post.like_count || 0)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle className="w-3 h-3" />
                                                    {formatNumber(post.comments_count || 0)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {formatNumber(post.view_count || 0)}
                                                </span>
                                            </div>
                                        </Link>
                                        
                                        {/* ✅ Delete Button - Outside the Link, always visible on hover */}
                                        <div className="flex-shrink-0 ml-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteModal({
                                                        isOpen: true,
                                                        postId: post.id,
                                                        title: post.title
                                                    });
                                                }}
                                                disabled={deleting === post.id}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                                title="Supprimer cette question"
                                            >
                                                {deleting === post.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}