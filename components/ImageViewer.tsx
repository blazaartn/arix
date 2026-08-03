'use client';

import { X } from 'lucide-react';

interface ImageViewerProps {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ imageUrl, isOpen, onClose }: ImageViewerProps) {
  if (!isOpen || !imageUrl) return null;
  
  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" 
      onClick={onClose}
    >
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
        onError={(e) => { 
          (e.target as HTMLImageElement).style.display = 'none'; 
        }} 
      />
    </div>
  );
}