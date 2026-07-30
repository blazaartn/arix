'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, User, Mail, Award, 
    Calendar, BookOpen, Loader2, Settings,
    Pencil, Share2, Check, X
} from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { useToast } from '@/contexts/ToastContext';
import { ToastProvider } from '@/contexts/ToastContext';

interface UserPost {
    id: string;
    title: string;
    content: string;
    subject_name: string;
    created_at: string;
}

interface ProfileUser {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
    role: string;
    xp_points: number;
    level: number;
    created_at: string;
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

// ✅ Share Profile Button
function ShareProfileButton({ userId, userName }: { userId: string; userName: string }) {
    const { showToast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}/profile/${userId}`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Profil de ${userName} sur bacplus`,
                    text: `Découvrez le profil de ${userName} sur bacplus !`,
                    url: url,
                });
                return;
            }

            await navigator.clipboard.writeText(url);
            setCopied(true);
            showToast('🔗 Lien du profil copié !', 'success');
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
                showToast('🔗 Lien du profil copié !', 'success');
                setTimeout(() => setCopied(false), 3000);
            } catch {
                showToast('Impossible de copier le lien', 'error');
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                copied 
                    ? 'bg-green-100 text-green-600 border border-green-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
            title="Partager le profil"
        >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copié !' : 'Partager'}</span>
        </button>
    );
}

function PostSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    );
}

function ProfileContent() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const { showToast } = useToast();
    const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    const userId = params?.id as string;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            
            setLoading(true);
            try {
                // Fetch user profile
                const userRes = await fetch(`/api/user/${userId}`);
                const userData = await userRes.json();
                
                if (userData.success) {
                    setProfileUser(userData.user);
                    setIsOwnProfile(session?.user?.id === userData.user.id);
                } else {
                    showToast('Utilisateur non trouvé', 'error');
                    router.push('/');
                    return;
                }

                // Fetch user's posts
                const postsRes = await fetch(`/api/user/${userId}/posts`);
                const postsData = await postsRes.json();
                
                if (postsData.success) {
                    setPosts(postsData.questions || []);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                showToast('Erreur lors du chargement du profil', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, session, router, showToast]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Utilisateur non trouvé</p>
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
                    <div className="flex items-center gap-2">
                        {/* ✅ Share Profile Button */}
                        <ShareProfileButton userId={profileUser.id} userName={profileUser.name} />
                        
                        {isOwnProfile && (
                            <Link 
                                href="/settings" 
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                            >
                                <Settings className="w-4 h-4" />
                                <span className="hidden sm:inline">Paramètres</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    <div className="relative h-32 md:h-40 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                                <div className="relative -mt-12">
                                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                        <img 
                                            src={profileUser.avatar_url || '/default-avatar.png'} 
                                            alt={profileUser.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                                            }}
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>

                                <div className="flex-1 text-white">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-xl md:text-2xl font-bold">
                                            {profileUser.name}
                                        </h2>
                                        <VerifiedBadge role={profileUser.role || 'student'} size="md" showLabel />
                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                            ★ Niv. {profileUser.level || 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/80 mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-3.5 h-3.5" />
                                            {profileUser.email}
                                        </span>
                                        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Membre depuis {formatDate(profileUser.created_at)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                                    <Award className="w-5 h-5 text-yellow-300" />
                                    <div>
                                        <div className="text-xs text-white/70">XP Total</div>
                                        <div className="font-bold text-white">
                                            {profileUser.xp_points || 0} XP
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-orange-500" />
                            Questions
                        </h3>
                        <span className="text-sm text-gray-400">
                            {posts.length} question{posts.length > 1 ? 's' : ''}
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
                            <p className="text-sm text-gray-400">Cet utilisateur n'a pas encore posé de questions</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {posts.map((post) => (
                                <div 
                                    key={post.id}
                                    className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-200 group"
                                >
                                    <div className="flex items-start justify-between">
                                        <Link href={`/questions/${post.id}`} className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full border border-orange-200">
                                                    {post.subject_name || 'Sans matière'}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-semibold text-gray-800 hover:text-orange-500 transition">
                                                {post.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatTimeAgo(post.created_at)}
                                                </span>
                                            </div>
                                        </Link>
                                        
                                        {isOwnProfile && (
                                            <div className="flex-shrink-0 ml-2">
                                                <Link
                                                    href={`/questions/${post.id}/edit`}
                                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                                    title="Modifier cette question"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        )}
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

export default function ProfilePage() {
    return (
        <ToastProvider>
            <ProfileContent />
        </ToastProvider>
    );
}