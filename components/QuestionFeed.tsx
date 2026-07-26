'use client';

import { QuestionCard } from './QuestionCard';
import { BookOpen, Loader2 } from 'lucide-react';

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

interface QuestionFeedProps {
  questions: Question[];
  loading: boolean;
  isLoggedIn: boolean;
  currentUserId?: string;
  onRefresh: () => void;
  onImageClick: (url: string) => void;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPageLoading: boolean;
}

function QuestionSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="h-5 bg-gray-200 rounded w-12"></div>
        <div className="h-5 bg-gray-200 rounded w-12"></div>
        <div className="h-5 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );
}

function PaginationControls({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
  isLoading: boolean;
}) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage <= 1 || isLoading} 
        className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} 
        Précédent
      </button>
      <span className="text-sm text-gray-600">Page {currentPage} sur {totalPages}</span>
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage >= totalPages || isLoading} 
        className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} 
        Suivant
      </button>
    </div>
  );
}

export function QuestionFeed({ 
  questions, 
  loading, 
  isLoggedIn, 
  currentUserId, 
  onRefresh, 
  onImageClick,
  searchQuery,
  currentPage,
  totalPages,
  onPageChange,
  isPageLoading
}: QuestionFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <QuestionSkeleton />
        <QuestionSkeleton />
        <QuestionSkeleton />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
        <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">
          {searchQuery ? 'Aucun résultat pour cette recherche' : 'Aucune question pour le moment'}
        </p>
        <p className="text-sm text-gray-400">
          {searchQuery ? 'Essayez une autre recherche' : 'Soyez le premier à poser une question !'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            isLoggedIn={isLoggedIn}
            currentUserId={currentUserId}
            onRefresh={onRefresh}
            onImageClick={onImageClick}
          />
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isPageLoading}
      />
    </>
  );
}