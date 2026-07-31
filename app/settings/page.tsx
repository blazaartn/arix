'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, User, Mail, Trash2, 
  Send, Save, X, AlertCircle, CheckCircle,
  Info, MessageCircle, Settings as SettingsIcon,
  Loader2, LogOut, Shield, Code, Database,
  Moon, Sun, Monitor, Smartphone, ChevronRight,
  Download, Upload, RefreshCw
} from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { useToast } from '@/contexts/ToastContext';
import { ToastProvider } from '@/contexts/ToastContext';

// Toast Component
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
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[300] animate-fadeIn w-[90%] max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-white ${bgColors[type]}`}>
        {icons[type]}
        <span className="font-medium text-sm flex-1">{message}</span>
        <button onClick={onClose} className="hover:opacity-80 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ✅ UPDATED Modal with confirmation input
function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText,
  confirmColor = 'bg-red-500 hover:bg-red-600',
  inputValue = '',
  onInputChange = () => {},
  inputPlaceholder = 'Tapez SUPPRIMER pour confirmer',
  requiredText = 'SUPPRIMER',
  isConfirmDisabled = false
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string; 
  confirmText: string;
  confirmColor?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputPlaceholder?: string;
  requiredText?: string;
  isConfirmDisabled?: boolean;
}) {
  if (!isOpen) return null;

  const isInputValid = inputValue === requiredText;

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{message}</p>
        
        {/* ✅ Confirmation input */}
        {onInputChange && (
          <div className="mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            {inputValue && inputValue !== requiredText && (
              <p className="text-xs text-red-500 mt-1">Le texte ne correspond pas</p>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            disabled={isConfirmDisabled || (!!onInputChange && !isInputValid)}
            className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition ${confirmColor} ${
              (isConfirmDisabled || (!!onInputChange && !isInputValid)) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function SettingsContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  
  // User settings state
  const [username, setUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  // App info
  const appVersion = '1.0.0';

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || '');
      setCurrentUsername(session.user.name || '');
      setEmail(session.user.email || '');
    }
    
    const savedTheme = localStorage.getItem('bacplus_theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, [session]);

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
    localStorage.setItem('bacplus_theme', theme);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    applyTheme(newTheme);
    showToast(`Thème: ${newTheme === 'system' ? 'Système' : newTheme === 'dark' ? 'Sombre' : 'Clair'}`, 'success');
  };

  // Update username
  const handleUpdateUsername = async () => {
    if (!username.trim() || username === currentUsername) {
      setIsEditingUsername(false);
      return;
    }

    if (username.trim().length < 2) {
      showToast('Le nom doit contenir au moins 2 caractères', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username.trim() })
      });

      const data = await res.json();
      
      if (data.success) {
        await update({ name: username.trim() });
        setCurrentUsername(username.trim());
        setIsEditingUsername(false);
        showToast('Nom mis à jour !', 'success');
      } else {
        showToast(data.error || 'Erreur', 'error');
      }
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete account - now with input validation
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'SUPPRIMER') {
      showToast('Écrivez SUPPRIMER pour confirmer', 'warning');
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/user', {
        method: 'DELETE',
      });

      const data = await res.json();
      
      if (data.success) {
        showToast('Compte supprimé', 'success');
        await signOut({ callbackUrl: '/' });
      } else {
        showToast(data.error || 'Erreur', 'error');
        setIsDeleting(false);
      }
    } catch {
      showToast('Erreur lors de la suppression', 'error');
      setIsDeleting(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      showToast('Déconnecté', 'success');
    } catch {
      showToast('Erreur lors de la déconnexion', 'error');
    }
  };

  // Clear playground cache
  const clearPlaygroundCache = () => {
    try {
      localStorage.removeItem('playground_files');
      showToast('Cache du playground vidé', 'success');
    } catch {
      showToast('Erreur', 'error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* ✅ Updated Delete Account Modal with input */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmText('');
        }}
        onConfirm={handleDeleteAccount}
        title="Supprimer le compte"
        message="Cette action est irréversible. Toutes vos données seront supprimées définitivement. Pour confirmer, écrivez 'SUPPRIMER' ci-dessous."
        confirmText={isDeleting ? 'Suppression...' : 'Confirmer'}
        inputValue={deleteConfirmText}
        onInputChange={setDeleteConfirmText}
        inputPlaceholder="Tapez SUPPRIMER pour confirmer"
        requiredText="SUPPRIMER"
        isConfirmDisabled={isDeleting}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate">
              <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" />
              <span className="truncate">Paramètres</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm mb-4">
          <div className="flex items-center gap-4">
            <img 
              src={session.user.avatar_url || '/default-avatar.png'} 
              alt={session.user.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-orange-500/30 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                {session.user.name}
                <VerifiedBadge role={session.user.role || 'student'} size="sm" showLabel />
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span>★ Niv. {session.user.level || 1}</span>
                <span>•</span>
                <span>{formatNumber(session.user.xp_points || 0)} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Change Username */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm mb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Nom d'utilisateur</h3>
                <p className="text-xs sm:text-sm text-gray-400 truncate">{currentUsername}</p>
              </div>
            </div>
            {!isEditingUsername ? (
              <button
                onClick={() => setIsEditingUsername(true)}
                className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 font-medium flex-shrink-0"
              >
                Modifier
              </button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-24 sm:w-32 px-2 sm:px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isSubmitting}
                  autoFocus
                />
                <button
                  onClick={handleUpdateUsername}
                  disabled={isSubmitting}
                  className="p-1.5 sm:p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
                <button
                  onClick={() => {
                    setUsername(currentUsername);
                    setIsEditingUsername(false);
                  }}
                  className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Email */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Email</h3>
              <p className="text-xs sm:text-sm text-gray-400 truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* 4. Playground Cache */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm mb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Playground Cache</h3>
                <p className="text-xs sm:text-sm text-gray-400 truncate">Vider le cache du playground</p>
              </div>
            </div>
            <button
              onClick={clearPlaygroundCache}
              className="p-2 px-3 sm:px-4 text-xs sm:text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex-shrink-0"
            >
              Vider
            </button>
          </div>
        </div>

        {/* 5. About */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl border border-orange-200 dark:border-orange-800/30 p-4 sm:p-6 shadow-sm mb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-200 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">À propos</h3>
              <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400">Version {appVersion}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            bacplus est une plateforme d'entraide pour les étudiants du Bac Tunisien. 
            Posez des questions, partagez des connaissances, et progressez ensemble !
          </p>
        </div>

        {/* 6. Logout */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm mb-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl p-2 -m-2 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-red-600 dark:text-red-400 text-sm sm:text-base">Déconnexion</h3>
                <p className="text-xs sm:text-sm text-gray-400">Se déconnecter du compte</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 7. Delete Account */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-200 dark:border-red-800/30 p-4 sm:p-6 shadow-sm">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl p-2 -m-2 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-red-600 dark:text-red-400 text-sm sm:text-base">Supprimer le compte</h3>
                <p className="text-xs sm:text-sm text-gray-400">Cette action est irréversible</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsContent />
    </ToastProvider>
  );
}