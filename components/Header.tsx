'use client';

import { memo } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Bell, ChevronRight, Search, X, Loader2 } from 'lucide-react';

interface HeaderProps {
  session: any;
  unreadCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const Header = memo(function Header({ 
  session, 
  unreadCount = 0, 
  searchQuery, 
  setSearchQuery, 
  isSearching,
  setIsMenuOpen 
}: HeaderProps) {
  const router = useRouter();

  const handleNotificationsClick = () => {
    router.push('/notifications');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-gray-900">bac</span>
            <span className="text-orange-500">plus</span>
          </h1>
        </div>

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-xs mx-3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Rechercher une question..." 
              className="w-full pl-9 pr-9 py-1.5 text-sm bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* ✅ Notification bell with red badge */}
          <button 
            onClick={handleNotificationsClick}
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-red-500/30">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {session ? (
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition"
            >
              <img 
                src={session.user.avatar_url || '/default-avatar.png'} 
                alt={session.user.name} 
                className="w-9 h-9 rounded-full border-2 border-orange-500/30 object-cover" 
                onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }} 
              />
            </button>
          ) : (
            <button 
              onClick={() => signIn('google', { callbackUrl: '/' })} 
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="hidden sm:inline">Connexion</span>
              <ChevronRight className="hidden sm:inline w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
});