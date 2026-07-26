'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    ArrowLeft, Heart, MessageCircle, Award, 
    Bell, CheckCircle, Loader2, X, User,
    Calendar, Clock, Eye, Check, Share2
} from 'lucide-react';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

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

// ✅ Notification Skeleton
function NotificationSkeleton() {
    return (
        <div className="block p-4 rounded-xl animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotificationsContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 20;

    // ✅ Redirect if not logged in
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    // ✅ Fetch notifications with React Query
    const { 
        data, 
        isLoading, 
        refetch,
        isFetching 
    } = useQuery({
        queryKey: ['notifications', page],
        queryFn: async () => {
            if (!session) return { notifications: [], unreadCount: 0, hasMore: false };
            
            const url = `/api/notifications?limit=${limit}&offset=${(page - 1) * limit}`;
            const res = await fetch(url);
            const data = await res.json();
            
            if (!data.success) throw new Error('Failed to fetch notifications');
            return {
                notifications: data.notifications || [],
                unreadCount: data.unreadCount || 0,
                hasMore: data.hasMore || false
            };
        },
        staleTime: 10000,
        enabled: !!session,
        placeholderData: (previousData) => previousData,
    });

    const notifications = data?.notifications || [];
    const unreadCount = data?.unreadCount || 0;
    const hasMore = data?.hasMore || false;

    // ✅ Mark all as read mutation
    const markAllMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/notifications', { method: 'PUT' });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                queryClient.setQueryData(['notifications', page], (old: any) => ({
                    ...old,
                    notifications: old?.notifications?.map((n: Notification) => ({ ...n, is_read: true })) || [],
                    unreadCount: 0
                }));
                showToast('Toutes les notifications sont lues', 'success');
            }
        },
        onError: () => {
            showToast('Erreur lors du marquage', 'error');
        }
    });

    // ✅ Mark single as read mutation
    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/notifications?id=${id}`, { method: 'PUT' });
        },
        onSuccess: (_, id) => {
            queryClient.setQueryData(['notifications', page], (old: any) => ({
                ...old,
                notifications: old?.notifications?.map((n: Notification) => 
                    n.id === id ? { ...n, is_read: true } : n
                ) || [],
                unreadCount: Math.max(0, (old?.unreadCount || 0) - 1)
            }));
        }
    });

    const markAllAsRead = () => {
        if (unreadCount === 0) {
            showToast('Aucune notification non lue', 'info');
            return;
        }
        markAllMutation.mutate();
    };

    const markAsRead = (id: string) => {
        if (!notifications.find((n: { id: string; }) => n.id === id)?.is_read) {
            markReadMutation.mutate(id);
        }
    };

    const loadMore = () => {
        if (hasMore && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    if (status === 'loading') {
        return <LoadingScreen />;
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
                            disabled={markAllMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                        >
                            {markAllMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}
                            Tout lire
                        </button>
                    )}
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                {/* ✅ Loading Skeletons */}
                {isLoading ? (
                    <div className="space-y-1">
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Aucune notification</p>
                        <p className="text-sm text-gray-400">Vous serez notifié des interactions sur vos questions</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {notifications.map((notification: Notification) => (
                            <Link
                                key={notification.id}
                                href={notification.link || '#'}
                                onClick={() => markAsRead(notification.id)}
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
                {hasMore && !isLoading && (
                    <button
                        onClick={loadMore}
                        disabled={isFetching}
                        className="w-full mt-4 py-3 text-sm text-orange-500 hover:text-orange-600 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isFetching ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Chargement...
                            </>
                        ) : (
                            'Voir plus'
                        )}
                    </button>
                )}
            </main>
        </div>
    );
}

export default function NotificationsPage() {
    return (
        <ToastProvider>
            <NotificationsContent />
        </ToastProvider>
    );
}