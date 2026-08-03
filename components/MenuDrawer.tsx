'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  X, LogOut, User, Code, Briefcase, 
  CheckSquare, Trophy, Settings, BookOpen 
} from 'lucide-react';

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  onLogout: () => void;
}

export function MenuDrawer({ isOpen, onClose, session, onLogout }: MenuDrawerProps) {
  const router = useRouter();
  
  if (!isOpen) return null;
  
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
            <button
              onClick={handleSignIn}
              className="w-full mt-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition"
            >
              Se connecter
            </button>
          </div>
        )}

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
          
          {session ? (
            <button 
              onClick={onLogout} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
            >
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition">
                <LogOut className="w-5 h-5 text-red-500 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">Déconnexion</span>
            </button>
          ) : (
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