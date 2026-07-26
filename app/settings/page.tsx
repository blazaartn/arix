'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, User, Mail, Trash2, 
    Send, Save, X, AlertCircle, CheckCircle,
    Info, MessageCircle, Settings as SettingsIcon,
    Loader2, LogOut, Shield
} from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';

// ✅ Toast Component
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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] animate-fadeIn">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white ${bgColors[type]} max-w-md`}>
                {icons[type]}
                <span className="font-medium text-sm">{message}</span>
                <button onClick={onClose} className="ml-2 hover:opacity-80">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ✅ Modal Component
function Modal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText,
    confirmColor = 'bg-red-500 hover:bg-red-600'
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onConfirm: () => void; 
    title: string; 
    message: string; 
    confirmText: string;
    confirmColor?: string;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex gap-2">
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition ${confirmColor}`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
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

export default function SettingsPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    
    // ✅ User settings state
    const [username, setUsername] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    
    // ✅ Message state
    const [messageSubject, setMessageSubject] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    
    // ✅ Delete account state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    
    // ✅ App info
    const appVersion = '1.0.0';
    const appDescription = 'bacplus est une plateforme d\'entraide pour les étudiants du Bac Tunisien. Posez des questions, partagez des connaissances, et progressez ensemble !';

    useEffect(() => {
        if (session?.user) {
            setUsername(session.user.name || '');
            setCurrentUsername(session.user.name || '');
            setEmail(session.user.email || '');
        }
    }, [session]);

    // ✅ Update username with API
    const handleUpdateUsername = async () => {
        if (!username.trim() || username === currentUsername) {
            setIsEditingUsername(false);
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
                // ✅ Update session with new name
                await update({ name: username.trim() });
                setCurrentUsername(username.trim());
                setIsEditingUsername(false);
                setToast({ message: 'Nom d\'utilisateur mis à jour !', type: 'success' });
            } else {
                setToast({ message: data.error || 'Erreur', type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Erreur lors de la mise à jour', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ Send message with API
    const handleSendMessage = async () => {
        if (!messageSubject.trim() || !messageContent.trim()) {
            setToast({ message: 'Veuillez remplir tous les champs', type: 'warning' });
            return;
        }

        setIsSendingMessage(true);
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: messageSubject.trim(),
                    content: messageContent.trim()
                })
            });

            const data = await res.json();
            
            if (data.success) {
                setMessageSubject('');
                setMessageContent('');
                setToast({ message: 'Message envoyé avec succès !', type: 'success' });
            } else {
                setToast({ message: data.error || 'Erreur', type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Erreur lors de l\'envoi', type: 'error' });
        } finally {
            setIsSendingMessage(false);
        }
    };

    // ✅ Delete account with API
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'SUPPRIMER') {
            setToast({ message: 'Veuillez écrire SUPPRIMER pour confirmer', type: 'warning' });
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch('/api/user', {
                method: 'DELETE',
            });

            const data = await res.json();
            
            if (data.success) {
                // ✅ Sign out and redirect
                await signOut({ callbackUrl: '/' });
            } else {
                setToast({ message: data.error || 'Erreur', type: 'error' });
                setIsDeleting(false);
            }
        } catch (error) {
            setToast({ message: 'Erreur lors de la suppression', type: 'error' });
            setIsDeleting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!session) {
        router.push('/auth/signin');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Toast */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

            {/* Delete Account Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                }}
                onConfirm={handleDeleteAccount}
                title="Supprimer le compte"
                message="Cette action est irréversible. Toutes vos données seront supprimées définitivement. Pour confirmer, écrivez 'SUPPRIMER' ci-dessous."
                confirmText={isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
                confirmColor="bg-red-500 hover:bg-red-600"
            />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <SettingsIcon className="w-6 h-6 text-orange-500" />
                            Paramètres
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                {/* User Info Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-4">
                        <img 
                            src={session.user.avatar_url || '/default-avatar.png'} 
                            alt={session.user.name}
                            className="w-16 h-16 rounded-full border-2 border-orange-500/30 object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }}
                        />
                        <div>
                            <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {session.user.name}
                                <VerifiedBadge role={session.user.role || 'student'} size="md" showLabel />
                            </p>
                            <p className="text-sm text-gray-500">{session.user.email}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                <span>★ Niv. {session.user.level || 1}</span>
                                <span>•</span>
                                <span>{formatNumber(session.user.xp_points || 0)} XP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. Change Username */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Nom d'utilisateur</h3>
                                <p className="text-sm text-gray-400">Changez votre nom d'affichage</p>
                            </div>
                        </div>
                        {!isEditingUsername ? (
                            <button
                                onClick={() => setIsEditingUsername(true)}
                                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                            >
                                Modifier
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                />
                                <button
                                    onClick={handleUpdateUsername}
                                    disabled={isSubmitting}
                                    className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => {
                                        setUsername(currentUsername);
                                        setIsEditingUsername(false);
                                    }}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Email */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Email</h3>
                            <p className="text-sm text-gray-400">{email}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Send Message */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Envoyer un message</h3>
                            <p className="text-sm text-gray-400">Contactez l'équipe bacplus</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={messageSubject}
                            onChange={(e) => setMessageSubject(e.target.value)}
                            placeholder="Sujet..."
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            disabled={isSendingMessage}
                        />
                        <textarea
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder="Votre message..."
                            rows={4}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            disabled={isSendingMessage}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isSendingMessage || !messageSubject.trim() || !messageContent.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                        >
                            {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Envoyer le message
                        </button>
                    </div>
                </div>

                {/* 4. About the App */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border border-orange-100 p-6 shadow-sm mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                            <Info className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">À propos de bacplus</h3>
                            <p className="text-sm text-orange-600">Version {appVersion}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {appDescription}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 bg-white/70 rounded-full border border-orange-200 text-gray-600">
                            📚 Bac Tunisien
                        </span>
                        <span className="text-xs px-2 py-1 bg-white/70 rounded-full border border-orange-200 text-gray-600">
                            🤝 Entraide
                        </span>
                        <span className="text-xs px-2 py-1 bg-white/70 rounded-full border border-orange-200 text-gray-600">
                            🏆 XP & Niveaux
                        </span>
                    </div>
                </div>

                {/* 5. Delete Account */}
                <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-medium text-red-700">Supprimer le compte</h3>
                                <p className="text-sm text-red-400">Cette action est irréversible</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}