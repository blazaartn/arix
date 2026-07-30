'use client';

import { LoadingSpinner } from './LoadingSpinner';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 text-sm animate-pulse">Chargement...</p>
      </div>
    </div>
  );
}