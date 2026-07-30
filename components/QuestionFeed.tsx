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
  userLiked?: boolean;
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
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        </div>
      </div>
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
      </div>
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, onPageChange, isLoading }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void; isLoading: boolean }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 py-6 mt-6 border-t border-slate-200 dark:border-slate-700">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1 || isLoading} className="px-4 py-2.5 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}Précédent
      </button>
      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium px-3 py-2">Page {currentPage} / {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages || isLoading} className="px-4 py-2.5 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2">
        Suivant {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      </button>
    </div>
  );
}

export function QuestionFeed({ questions, loading, isLoggedIn, currentUserId, onRefresh, onImageClick, searchQuery, currentPage, totalPages, onPageChange, isPageLoading }: QuestionFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <QuestionSkeleton /><QuestionSkeleton /><QuestionSkeleton />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
        <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-300 font-medium text-lg mb-1">
          {searchQuery ? 'Aucun résultat' : 'Aucune question'}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
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
            key={`question-${q.id}`}
            question={q}
            isLoggedIn={isLoggedIn}
            currentUserId={currentUserId}
            onRefresh={onRefresh}
            onImageClick={onImageClick}
          />
        ))}
      </div>
      {totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} isLoading={isPageLoading} />}
    </>
  );
}
