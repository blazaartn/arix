'use client';

import { memo, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Bell, ChevronRight, Search, X, Loader2, User } from 'lucide-react';

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
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleNotificationsClick = () => {
    router.push('/notifications');
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    await signIn('google', { callbackUrl: '/' });
    setIsSigningIn(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo - Modern Minimal */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight hidden sm:block">
            <span className="text-slate-900 dark:text-slate-50">bac</span>
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">plus</span>
          </h1>
        </div>

        {/* Search - Modern style with better spacing */}
        <div className="flex-1 max-w-sm mx-3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Rechercher des questions..." 
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-700 transition-all" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
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

        {/* Right Actions - Modern styling */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={handleNotificationsClick}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {session ? (
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <img 
                src={session.user.avatar_url || '/default-avatar.png'} 
                alt={session.user.name} 
                className="w-8 h-8 rounded-full border-2 border-blue-500/30 object-cover" 
                onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }} 
              />
            </button>
          ) : (
            <button 
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-70"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Connexion...</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Se connecter</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
});
