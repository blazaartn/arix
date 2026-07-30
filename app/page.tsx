'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  Home, Plus, Menu, Award, BookOpen, 
  X, LogOut, User, Code, Briefcase,
  CheckSquare, Trophy, Settings
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { QuestionFeed } from '@/components/QuestionFeed';
import { QuestionModal } from '@/components/QuestionModal';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { clearLikesCache } from '@/hooks/useLikes';

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// ============================================
// MENU DRAWER - FIXED
// ============================================

function MenuDrawer({ 
  isOpen, 
  onClose, 
  session, 
  onLogout 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  session: any; 
  onLogout: () => void;
}) {
  const router = useRouter();
  
  if (!isOpen) return null;
  
  // ✅ Different menu items based on auth status
  const menuItems = session ? [
    { icon: User, label: 'Profil', href: `/profile/${session?.user?.id}` },
    { icon: Code, label: 'Code Playground', href: '/playground' },
    { icon: Briefcase, label: 'Projets', href: '/projects' },
    { icon: CheckSquare, label: 'Todos', href: '/todos' },
    { icon: Trophy, label: 'Classement', href: '/ranking' },
    { icon: Settings, label: 'Paramètres', href: '/settings' },
  ] : [
    { icon: Trophy, label: 'Classement', href: '/ranking' },
    { icon: BookOpen, label: 'Séries', href: '/series' },
    { icon: Briefcase, label: 'Projets', href: '/projects' },
  ];

  const handleNavigation = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleLogout = async () => {
    onClose();
    await onLogout();
  };

  const handleSignIn = async () => {
    onClose();
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-[200] bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <div className={`fixed top-0 right-0 z-[201] h-full w-80 bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* ✅ LOGGED IN - Show user info with avatar, name, email, XP, level */}
        {session ? (
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={session?.user?.avatar_url || '/default-avatar.png'} 
                  alt={session?.user?.name} 
                  className="w-12 h-12 rounded-lg border-2 border-orange-500/30 object-cover" 
                  onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }} 
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-50">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{session?.user?.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">★ Niv. {session?.user?.level || 1}</span>
                    <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatNumber(session?.user?.xp_points || 0)} XP</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          </div>
        ) : (
          // ✅ GUEST - Simple gray banner with "Utilisateur inconnu"
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-600 dark:text-slate-400">Utilisateur inconnu</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Connectez-vous pour plus</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition">
                <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </button>
            </div>
            {/* ✅ Login button inside the gray banner */}
            <button
              onClick={handleSignIn}
              className="w-full mt-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition"
            >
              Se connecter
            </button>
          </div>
        )}

        {/* Menu Items */}
        <div className="p-3 space-y-1">
          {menuItems.map((item) => (
            <button 
              key={item.label} 
              onClick={() => handleNavigation(item.href)} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition group"
            >
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900 transition">
                <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50">{item.label}</span>
            </button>
          ))}
          
          <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
          
          {/* ✅ ONLY show logout when logged in */}
          {session ? (
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
            >
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition">
                <LogOut className="w-5 h-5 text-red-500 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">Déconnexion</span>
            </button>
          ) : (
            // ✅ GUEST - Show login button (not logout)
            <button 
              onClick={handleSignIn} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition group"
            >
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition">
                <LogOut className="w-5 h-5 text-orange-500 dark:text-orange-400 rotate-180" />
              </div>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300">Se connecter</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================
// IMAGE VIEWER
// ============================================

function ImageViewer({ 
  imageUrl, 
  isOpen, 
  onClose 
}: { 
  imageUrl: string | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen || !imageUrl) return null;
  
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
      >
        <X className="w-8 h-8" />
      </button>
      <img 
        src={imageUrl} 
        alt="Full screen" 
        className="max-w-full max-h-full object-contain rounded-lg" 
        onClick={(e) => e.stopPropagation()} 
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
      />
    </div>
  );
}

// ============================================
// MAIN HOME COMPONENT
// ============================================

function HomeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch unread count
  useEffect(() => {
    if (!session) return;
    
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch('/api/notifications?unread=true&limit=1');
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // Silent fail
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [session]);

  // Fetch questions
  const { 
    data: questionsData, 
    isLoading, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['questions', currentPage, debouncedSearch],
    queryFn: async () => {
      setIsSearching(true);
      try {
        const offset = (currentPage - 1) * limit;
        const url = `/api/questions?limit=${limit}&offset=${offset}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      } catch {
        throw new Error('Failed to fetch');
      } finally {
        setIsSearching(false);
      }
    },
    staleTime: 30000,
    placeholderData: (previousData) => previousData,
    retry: 2,
  });

  // Fetch sidebar data
  const { data: sidebarData } = useQuery({
    queryKey: ['sidebar', session?.user?.id],
    queryFn: async () => {
      if (!session) return { topUsers: [], todos: [] };
      
      try {
        const [topUsersRes, todosRes] = await Promise.all([
          fetch('/api/ranking?limit=3'),
          fetch('/api/todos?limit=5&filter=active')
        ]);
        
        const [topUsers, todos] = await Promise.all([
          topUsersRes.json(),
          todosRes.json()
        ]);
        
        return {
          topUsers: topUsers.users || [],
          todos: todos.todos || []
        };
      } catch (error) {
        console.error('Sidebar data error:', error);
        return { topUsers: [], todos: [] };
      }
    },
    staleTime: 60000,
    enabled: !!session,
    initialData: { topUsers: [], todos: [] }
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    try {
      clearLikesCache();
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleQuestionCreated = () => {
    refetch();
  };

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  const totalQuestions = questionsData?.totalCount || questionsData?.questions?.length || 0;
  const totalPages = Math.ceil(totalQuestions / limit) || 1;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <Header 
        session={session}
        unreadCount={unreadCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        setIsMenuOpen={setIsMenuOpen}
      />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-[28%] flex-shrink-0 space-y-4">
            <Sidebar 
              session={session}
              topUsers={sidebarData?.topUsers || []}
              todos={sidebarData?.todos || []}
            />
          </aside>

          {/* Main Feed */}
          <main className="flex-1 min-w-0">
            {/* Mobile XP Bar */}
            {!isLoading && session && (
              <div className="lg:hidden">
                <div className="bg-white border border-gray-100 rounded-xl p-3 mb-4 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-medium text-gray-700">Niv. {session.user.level || 1}</span>
                    </div>
                    <span className="text-xs text-gray-400">{formatNumber(session.user.xp_points || 0)} XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-700" 
                      style={{ width: `${Math.min(((session.user.xp_points || 0) % 100), 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Guest Banner - Mobile */}
            {!isLoading && !session && (
              <div className="lg:hidden bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4 text-center">
                <p className="text-xs text-gray-600">👋 Connectez-vous pour interagir</p>
              </div>
            )}

            {/* Question Feed */}
            <QuestionFeed 
              questions={questionsData?.questions || []}
              loading={isLoading || isFetching}
              isLoggedIn={!!session}
              currentUserId={session?.user?.id}
              onRefresh={() => refetch()}
              onImageClick={(url) => setViewerImage(url)}
              searchQuery={searchQuery}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isPageLoading={isFetching}
            />
          </main>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-2 py-1 flex justify-around items-center shadow-lg">
        <button 
          onClick={() => router.push('/')} 
          className="flex flex-col items-center py-1 px-3 text-orange-500 transition"
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-0.5">Accueil</span>
        </button>
        
        <button 
          onClick={() => router.push('/series')} 
          className="flex flex-col items-center py-1 px-3 text-gray-400 hover:text-orange-500 transition"
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-0.5">Séries</span>
        </button>
        
        <button 
          onClick={() => {
            if (!session) {
              // ✅ If not logged in, open sign-in
              signIn('google', { callbackUrl: '/' });
              return;
            }
            setIsQuestionModalOpen(true);
          }} 
          className="relative -mt-4 flex flex-col items-center transition-transform hover:scale-110"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300">
            <Plus className="w-7 h-7 text-white" />
          </div>
          <span className="text-[10px] font-medium text-orange-500 mt-0.5">
            {session ? 'Nouveau' : 'Connexion'}
          </span>
        </button>
        
        <button 
          onClick={() => setIsMenuOpen(true)} 
          className="flex flex-col items-center py-1 px-3 text-gray-400 hover:text-orange-500 transition"
        >
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-0.5">Menu</span>
        </button>
      </nav>

      {/* Modals */}
      <QuestionModal 
        isOpen={isQuestionModalOpen} 
        onClose={() => setIsQuestionModalOpen(false)} 
        onQuestionCreated={handleQuestionCreated}
      />
      
      <MenuDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        session={session} 
        onLogout={handleLogout}
      />
      
      <ImageViewer 
        imageUrl={viewerImage} 
        isOpen={!!viewerImage} 
        onClose={() => setViewerImage(null)} 
      />
    </div>
  );
}

// ============================================
// EXPORT
// ============================================

export default function HomePage() {
  return <HomeContent />;
}