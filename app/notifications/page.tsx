'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, Heart, MessageCircle, Award, 
    Bell, CheckCircle, Loader2, X, User,
    Calendar, Clock, Eye
} from 'lucide-react';

interface Notification {
    id: string;
    user_id: string;
    actor_id: string;
    actor_name: string;
    actor_avatar: string;
    actor_role: string;
    type: 'like' | 'comment' | 'reply' | 'accepted' | 'question' | 'answer' | 'mention' | 'system';
    content: string;
    question_id?: string;
    comment_id?: string;
    link?: string;
    is_read: boolean;
    read_at?: string;
    created_at: string;
}

function formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60 * 1000) return 'À l\'instant';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} min`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} h`;
    if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))} j`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
    switch (type) {
        case 'like':
            return <Heart className="w-5 h-5 text-red-500" />;
        case 'comment':
            return <MessageCircle className="w-5 h-5 text-blue-500" />;
        case 'accepted':
            return <Award className="w-5 h-5 text-green-500" />;
        case 'system':
            return <Bell className="w-5 h-5 text-purple-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-500" />;
    }
};

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [markingAll, setMarkingAll] = useState(false);

    // ✅ Redirect if not logged in
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    // ✅ Fetch notifications
    const fetchNotifications = async (reset = true) => {
        if (!session) return;
        
        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            const url = `/api/notifications?limit=20&offset=${(currentPage - 1) * 20}`;
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.success) {
                if (reset) {
                    setNotifications(data.notifications || []);
                } else {
                    setNotifications(prev => [...prev, ...(data.notifications || [])]);
                }
                setUnreadCount(data.unreadCount || 0);
                setHasMore(data.hasMore || false);
                if (reset) setPage(1);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchNotifications(true);
        }
    }, [session]);

    // ✅ Mark all as read
    const markAllAsRead = async () => {
        setMarkingAll(true);
        try {
            const res = await fetch('/api/notifications', {
                method: 'PUT',
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(notifications.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        } finally {
            setMarkingAll(false);
        }
    };

    // ✅ Mark single as read
    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications?id=${id}`, {
                method: 'PUT',
            });
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, is_read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // ✅ Load more
    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNotifications(false);
    };

    if (status === 'loading' || loading) {
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
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/" 
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="w-6 h-6 text-orange-500" />
                            Notifications
                        </h1>
                        {unreadCount > 0 && (
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            disabled={markingAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                            {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Tout lire
                        </button>
                    )}
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                {notifications.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Aucune notification</p>
                        <p className="text-sm text-gray-400">Vous serez notifié des interactions sur vos questions</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                href={notification.link || '#'}
                                onClick={() => {
                                    if (!notification.is_read) {
                                        markAsRead(notification.id);
                                    }
                                }}
                                className={`block p-4 rounded-xl hover:bg-gray-50 transition ${
                                    notification.is_read ? 'bg-white' : 'bg-blue-50/50 border-l-4 border-blue-500'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={notification.actor_avatar || '/default-avatar.png'}
                                            alt={notification.actor_name}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <span className="font-medium text-gray-900">
                                                        {notification.actor_name}
                                                    </span>
                                                    <span className="text-gray-600"> {notification.content}</span>
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <NotificationIcon type={notification.type} />
                                                    <span className="text-xs text-gray-400">
                                                        {formatTime(notification.created_at)}
                                                    </span>
                                                    {!notification.is_read && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Load More */}
                {hasMore && !loading && (
                    <button
                        onClick={loadMore}
                        className="w-full mt-4 py-3 text-sm text-orange-500 hover:text-orange-600 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                    >
                        Voir plus
                    </button>
                )}
            </main>
        </div>
    );
}