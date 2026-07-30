'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Flag, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface AlertButtonProps {
  targetId: string;
  targetType: 'question' | 'comment';
  onAlert?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  authorId?: string; // ✅ Add authorId to check ownership
}

const ALERT_REASONS = [
  { value: 'spam', label: 'Spam ou publicité' },
  { value: 'inappropriate', label: 'Contenu inapproprié' },
  { value: 'harassment', label: 'Harcèlement ou insultes' },
  { value: 'offensive', label: 'Langage offensant' },
  { value: 'false_info', label: 'Information fausse ou trompeuse' },
  { value: 'other', label: 'Autre raison' },
];

export function AlertButton({ 
  targetId, 
  targetType, 
  onAlert, 
  className = '',
  size = 'md',
  authorId
}: AlertButtonProps) {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlerted, setIsAlerted] = useState(false);

  // ✅ Check if user is the author (cannot flag own content)
  const isOwnContent = authorId && session?.user?.id === authorId;

  // Check local storage for existing alert
  const getAlertKey = () => `alert_${targetType}_${targetId}`;
  
  const hasAlerted = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(getAlertKey()) === 'true';
  };

  const handleOpen = () => {
    if (!session) {
      showToast('Connectez-vous pour signaler', 'warning');
      signIn('google', { callbackUrl: '/' });
      return;
    }
    
    // ✅ Prevent flagging own content
    if (isOwnContent) {
      showToast('Vous ne pouvez pas signaler votre propre contenu', 'warning');
      return;
    }
    
    if (hasAlerted()) {
      showToast('Vous avez déjà signalé ce contenu', 'info');
      return;
    }
    
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    const reason = selectedReason === 'other' ? customReason : selectedReason;
    
    if (!reason) {
      showToast('Veuillez sélectionner une raison', 'warning');
      return;
    }

    if (selectedReason === 'other' && !customReason.trim()) {
      showToast('Veuillez décrire la raison', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId,
          targetType,
          reason: reason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(getAlertKey(), 'true');
        setIsAlerted(true);
        setIsOpen(false);
        setSelectedReason('');
        setCustomReason('');
        showToast('✅ Signalement envoyé', 'success');
        
        // ✅ Trigger refresh to hide the content
        if (onAlert) onAlert();
        
        // ✅ Dispatch event for global refresh
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('contentReported', { 
            detail: { targetId, targetType } 
          }));
        }
      } else {
        showToast(data.error || 'Erreur lors du signalement', 'error');
      }
    } catch {
      showToast('Erreur lors du signalement', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const alreadyAlerted = isAlerted || hasAlerted();

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const iconSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // ✅ Don't show button for own content or if already alerted
  if (isOwnContent) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={alreadyAlerted}
        className={`rounded-lg transition-all duration-200 ${
          alreadyAlerted 
            ? 'text-green-500 bg-green-50 cursor-default' 
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
        } ${sizeClasses[size]} ${className}`}
        title={alreadyAlerted ? 'Signalé' : 'Signaler un problème'}
      >
        {alreadyAlerted ? (
          <Check className={iconSize[size]} />
        ) : (
          <Flag className={iconSize[size]} />
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setIsOpen(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Signaler un problème
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Pourquoi signalez-vous ce contenu ?
            </p>

            <div className="space-y-2 mb-4">
              {ALERT_REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                    selectedReason === reason.value
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="alertReason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {reason.label}
                  </span>
                </label>
              ))}
            </div>

            {selectedReason === 'other' && (
              <div className="mb-4">
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Décrivez le problème..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Signaler'
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}