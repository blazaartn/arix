'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Maximize2, Minimize2, X } from 'lucide-react';
import { ToastProvider, useToast } from '@/contexts/ToastContext';

function PreviewContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [html, setHtml] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the saved HTML from localStorage
    const savedHtml = localStorage.getItem('playground_preview_html');
    if (savedHtml) {
      setHtml(savedHtml);
    } else {
      showToast('Aucun code à afficher. Retournez à l\'éditeur et exécutez le code.', 'warning');
    }
    setIsLoading(false);
  }, [showToast]);

  const refreshPreview = () => {
    const savedHtml = localStorage.getItem('playground_preview_html');
    if (savedHtml) {
      setHtml(savedHtml);
      showToast('✅ Aperçu actualisé', 'success');
    } else {
      showToast('Aucun code à afficher', 'warning');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/playground" className="p-2 hover:bg-gray-700 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🔍 Aperçu</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshPreview}
            className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
            title="Rafraîchir"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
            title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <Link
            href="/playground"
            className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
            title="Retour à l'éditeur"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Preview iframe */}
      <div className="flex-1 bg-white">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="animate-pulse">Chargement...</div>
          </div>
        ) : html ? (
          <iframe
            srcDoc={html}
            sandbox="allow-scripts allow-modals allow-downloads"
            className="w-full h-full border-none"
            title="Aperçu"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg font-medium">Aucun code à afficher</p>
            <p className="text-sm text-gray-400">Retournez à l'éditeur, exécutez votre code, puis revenez ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <ToastProvider>
      <PreviewContent />
    </ToastProvider>
  );
}