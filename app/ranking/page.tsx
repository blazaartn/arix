'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, Trophy, Star, Award, 
    Crown, Medal, Loader2, Search,
    User, ChevronUp, ChevronDown
} from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';

interface RankedUser {
    id: string;
    name: string;
    avatar_url: string;
    xp_points: number;
    level: number;
    role: string;
    rank_position: number;
}

function formatNumber(num: number): string {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Rank Icon Component
function RankIcon({ position }: { position: number }) {
    if (position === 1) return <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
    if (position === 2) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    if (position === 3) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />;
    return <span className="text-[10px] sm:text-xs font-bold text-gray-400 text-center">#{position}</span>;
}

// Rank Badge Colors
function RankBadge({ position }: { position: number }) {
    if (position === 1) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (position === 2) return 'bg-gray-100 text-gray-600 border-gray-300';
    if (position === 3) return 'bg-orange-100 text-orange-600 border-orange-300';
    return 'bg-gray-50 text-gray-500 border-gray-200';
}

// ✅ Ranking Skeleton
function RankingSkeleton() {
    return (
        <div className="space-y-2 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-2 bg-gray-200 rounded w-12 mt-0.5"></div>
                    </div>
                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    );
}

export default function RankingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<RankedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<RankedUser[]>([]);
    const limit = 20;

    // Redirect if not logged in
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    // Fetch ranking
    const fetchRanking = async (reset = true) => {
        if (!session) return;
        
        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            const url = `/api/ranking?limit=${limit}&offset=${(currentPage - 1) * limit}`;
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.success) {
                if (reset) {
                    setUsers(data.users || []);
                } else {
                    setUsers(prev => [...prev, ...(data.users || [])]);
                }
                setTotal(data.total || 0);
                setUserRank(data.userRank || null);
                setHasMore(data.hasMore || false);
                if (reset) setPage(1);
            }
        } catch (error) {
            console.error('Error fetching ranking:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchRanking(true);
        }
    }, [session]);

    // Filter users by search
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    // Load more
    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRanking(false);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-3 sm:px-4 py-3">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Link 
                            href="/" 
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2 truncate">
                            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0" />
                            <span className="truncate">Classement</span>
                        </h1>
                        {total > 0 && (
                            <span className="text-[10px] sm:text-xs text-gray-400 flex-shrink-0">
                                {total}
                            </span>
                        )}
                    </div>
                    {userRank && (
                        <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-orange-50 rounded-full border border-orange-200 flex-shrink-0">
                            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                            <span className="text-[10px] sm:text-xs font-medium text-gray-700 whitespace-nowrap">
                                #{userRank}
                            </span>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* Search Bar */}
                <div className="mb-4 sm:mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un étudiant..."
                            className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Stats Cards - Mobile First */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-4 sm:mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-3 shadow-sm text-center">
                        <div className="text-base sm:text-xl font-bold text-yellow-500">{total}</div>
                        <div className="text-[8px] sm:text-[10px] text-gray-500">Participants</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-3 shadow-sm text-center">
                        <div className="text-base sm:text-xl font-bold text-orange-500">
                            {users.length > 0 ? formatNumber(users[0]?.xp_points || 0) : '0'}
                        </div>
                        <div className="text-[8px] sm:text-[10px] text-gray-500">Top XP</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-3 shadow-sm text-center">
                        <div className="text-base sm:text-xl font-bold text-green-500 truncate">
                            {users.length > 0 ? users[0]?.name?.split(' ')[0] || '-' : '-'}
                        </div>
                        <div className="text-[8px] sm:text-[10px] text-gray-500">Leader</div>
                    </div>
                </div>

                {/* Ranking List - Mobile First */}
                {loading ? (
                    <RankingSkeleton />
                ) : filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm">
                        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base text-gray-500 font-medium">
                            {searchQuery ? 'Aucun résultat' : 'Aucun participant'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400">
                            {searchQuery ? 'Essayez une autre recherche' : 'Soyez le premier à gagner des XP !'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Table Header - Hidden on mobile, visible on sm */}
                        <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
                            <div className="col-span-2 text-center">Rang</div>
                            <div className="col-span-6">Étudiant</div>
                            <div className="col-span-2 text-center">Niveau</div>
                            <div className="col-span-2 text-right">XP</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => {
                                const isCurrentUser = user.id === session?.user?.id;
                                return (
                                    <div 
                                        key={user.id}
                                        className={`grid grid-cols-12 gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 items-center transition hover:bg-gray-50 ${
                                            isCurrentUser ? 'bg-orange-50 border-l-2 sm:border-l-4 border-orange-500' : ''
                                        }`}
                                    >
                                        {/* Rank */}
                                        <div className="col-span-2 flex justify-center">
                                            <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border ${RankBadge({ position: user.rank_position })}`}>
                                                <RankIcon position={user.rank_position} />
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div className="col-span-8 sm:col-span-6 flex items-center gap-2 sm:gap-3 min-w-0">
                                            <img
                                                src={user.avatar_url || '/default-avatar.png'}
                                                alt={user.name}
                                                className="w-7 h-7 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                                                }}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                        {user.name}
                                                    </span>
                                                    {user.role === 'admin' && (
                                                        <VerifiedBadge role="admin" size="sm" />
                                                    )}
                                                    {user.role === 'professor' && (
                                                        <VerifiedBadge role="professor" size="sm" />
                                                    )}
                                                    {isCurrentUser && (
                                                        <span className="text-[8px] sm:text-[10px] bg-orange-500 text-white px-1 py-0.5 rounded-full flex-shrink-0">
                                                            Vous
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Show level on mobile as text */}
                                                <span className="sm:hidden text-[10px] text-gray-400">
                                                    ★ {user.level}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Level - Hidden on mobile, visible on sm */}
                                        <div className="hidden sm:flex col-span-2 justify-center">
                                            <span className="text-sm font-medium text-gray-700">
                                                ★ {user.level}
                                            </span>
                                        </div>

                                        {/* XP */}
                                        <div className="col-span-2 text-right">
                                            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                                                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                                                <span className="text-[10px] sm:text-sm font-bold text-orange-500">
                                                    {formatNumber(user.xp_points)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Load More */}
                {hasMore && !loading && (
                    <button
                        onClick={loadMore}
                        className="w-full mt-3 sm:mt-4 py-2.5 sm:py-3 text-xs sm:text-sm text-orange-500 hover:text-orange-600 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                    >
                        Voir plus
                    </button>
                )}
            </main>
        </div>
    );
}