'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Home, Plus, Menu, Award, BookOpen, 
  X, Bell, Loader2, LogOut, User, Code, Briefcase,
  CheckSquare, Trophy, Settings
} from 'lucide-react';
import { QuestionModal } from '@/components/QuestionModal';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { QuestionFeed } from '@/components/QuestionFeed';

// Types
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
  image?: any;
  code_content?: string;
  code_language?: string;
}

interface UserRank {
  id: string;
  name: string;
  avatar_url: string;
  xp_points: number;
  level: number;
  role: string;
}

interface Todo {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// Sidebar data
const SIDEBAR_PROJECTS = [
  { id: '1', title: 'Emploi du Temps - HTML', description: 'Créez un planning interactif', xp_reward: 30, category: 'html' },
  { id: '2', title: 'Restaurant App - HTML/CSS', description: 'Complétez le code CSS', xp_reward: 25, category: 'css' },
  { id: '3', title: 'JS Functions - 3 Exercices', description: 'Implémentez des fonctions', xp_reward: 40, category: 'javascript' },
];

const COMING_EVENTS = [
  { id: '1', title: 'Réunion globale bacplus', date: '07/10/2026 à 20:00', description: 'Explication de tout !' },
];

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Menu Drawer Component
function MenuDrawer({ isOpen, onClose, session, onLogout }: { isOpen: boolean; onClose: () => void; session: any; onLogout: () => void }) {
  const router = useRouter();
  if (!isOpen) return null;
  
  const menuItems = [
    { icon: User, label: 'Profil', href: '/profile' },
    { icon: Code, label: 'Code Playground', href: '/playground' },
    { icon: Briefcase, label: 'Projets', href: '/projects' },
    { icon: CheckSquare, label: 'Todos', href: '/todos' },
    { icon: Trophy, label: 'Classement', href: '/ranking' },
    { icon: Settings, label: 'Paramètres', href: '/settings' },
  ];

  return (
    <>
      <div className={`fixed inset-0 z-[200] bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 z-[201] h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={session?.user?.avatar_url || '/default-avatar.png'} alt={session?.user?.name} className="w-12 h-12 rounded-full border-2 border-orange-500/30 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }} />
              <div>
                <p className="font-semibold text-gray-900">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-orange-500 font-medium">★ Niv. {session?.user?.level || 1}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-400">{formatNumber(session?.user?.xp_points || 0)} XP</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-3 space-y-1">
          {menuItems.map((item) => (
            <button key={item.label} onClick={() => { onClose(); router.push(item.href); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition group">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-500 transition">
                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
            </button>
          ))}
          <div className="border-t border-gray-100 my-2"></div>
          {session && (
            <button onClick={() => { onClose(); onLogout(); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 transition group">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-sm font-medium text-red-600 group-hover:text-red-700">Déconnexion</span>
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">bacplus v1.0 • {new Date().getFullYear()}</p>
        </div>
      </div>
    </>
  );
}

// Image Viewer Component
function ImageViewer({ imageUrl, isOpen, onClose }: { imageUrl: string | null; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !imageUrl) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10">
        <X className="w-8 h-8" />
      </button>
      <img src={imageUrl} alt="Full screen" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    </div>
  );
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [topUsers, setTopUsers] = useState<UserRank[]>([]);
  const [loadingTopUsers, setLoadingTopUsers] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  
  const limit = 10;

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!session) return;
      try {
        const res = await fetch('/api/notifications?unread=true&limit=1');
        const data = await res.json();
        if (data.success) setUnreadCount(data.unreadCount || 0);
      } catch {}
    };
    fetchUnreadCount();
  }, [session]);

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      if (!session) { setLoadingTodos(false); return; }
      try {
        const res = await fetch('/api/todos?limit=5&filter=active');
        const data = await res.json();
        if (data.success) setTodos(data.todos || []);
      } catch {}
      setLoadingTodos(false);
    };
    fetchTodos();
  }, [session]);

  // Fetch top users
  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const res = await fetch('/api/ranking?limit=3');
        const data = await res.json();
        if (data.success) setTopUsers(data.users || []);
      } catch {}
      setLoadingTopUsers(false);
    };
    fetchTopUsers();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch questions
  const fetchQuestions = async (page: number = 1, search: string = '') => {
    setLoading(true);
    setIsSearching(true);
    try {
      const offset = (page - 1) * limit;
      const url = `/api/questions?limit=${limit}&offset=${offset}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions || []);
        if (data.questions?.length < limit) setTotalPages(page);
        else setTotalPages(page + 1);
        setCurrentPage(page);
      } else {
        setQuestions([]);
      }
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(1, debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchQuestions(1, '');
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !isPageLoading) {
      setIsPageLoading(true);
      fetchQuestions(page, debouncedSearch);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-[28%] flex-shrink-0 space-y-4">
            <Sidebar 
              session={session}
              loading={loading}
              loadingTopUsers={loadingTopUsers}
              loadingTodos={loadingTodos}
              topUsers={topUsers}
              todos={todos}
              sidebarProjects={SIDEBAR_PROJECTS}
              comingEvents={COMING_EVENTS}
            />
          </aside>

          {/* Main Feed */}
          <main className="flex-1 min-w-0">
            {/* Mobile XP Bar */}
            {!loading && session && (
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
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-700" 
                      style={{ width: `${Math.min(((session.user.xp_points || 0) % 100), 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Guest Banner (mobile only) */}
            {!loading && !session && (
              <div className="lg:hidden bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4 text-center">
                <p className="text-xs text-gray-600">👋 Connectez-vous pour interagir</p>
              </div>
            )}

            {/* Questions Feed */}
            <QuestionFeed 
              questions={questions}
              loading={loading}
              isLoggedIn={!!session}
              currentUserId={session?.user?.id}
              onRefresh={() => fetchQuestions(currentPage, debouncedSearch)}
              onImageClick={(url) => setViewerImage(url)}
              searchQuery={searchQuery}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isPageLoading={isPageLoading}
            />
          </main>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-2 py-1 flex justify-around items-center shadow-lg">
        <button onClick={() => router.push('/')} className="flex flex-col items-center py-1 px-3 text-orange-500 transition">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-0.5">Accueil</span>
        </button>
        <button onClick={() => router.push('/series')} className="flex flex-col items-center py-1 px-3 text-gray-400 hover:text-orange-500 transition">
          <BookOpen className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-0.5">Séries</span>
        </button>
        <button onClick={() => setIsQuestionModalOpen(true)} className="relative -mt-4 flex flex-col items-center transition-transform hover:scale-110">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300">
            <Plus className="w-7 h-7 text-white" />
          </div>
          <span className="text-[10px] font-medium text-orange-500 mt-0.5">Nouveau</span>
        </button>
        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center py-1 px-3 text-gray-400 hover:text-orange-500 transition">
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-0.5">Menu</span>
        </button>
      </nav>

      {/* Modals */}
      <QuestionModal 
        isOpen={isQuestionModalOpen} 
        onClose={() => setIsQuestionModalOpen(false)} 
        onQuestionCreated={() => fetchQuestions(1, debouncedSearch)} 
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