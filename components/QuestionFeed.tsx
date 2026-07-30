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
  user_rank?: number;
  view_count: number;
  created_at: string;
  comments_count: number;
  like_count: number;
  images_count: number;
  userLiked?: boolean;
  image?: any;
  code_content?: string;
  code_language?: string;
  is_blocked?: boolean;
  alert_count?: number;
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
  hasMore: boolean;
  onPageChange: (page: number) => void;
  isPageLoading: boolean;
  onLoadMore: () => void;
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

export function QuestionFeed({ 
  questions, 
  loading, 
  isLoggedIn, 
  currentUserId, 
  onRefresh, 
  onImageClick, 
  searchQuery,
  currentPage,
  hasMore,
  onPageChange,
  isPageLoading,
  onLoadMore
}: QuestionFeedProps) {
  if (loading && questions.length === 0) {
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
          {searchQuery ? 'Aucun résultat' : 'Aucune question'}
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
            key={`question-${q.id}`}
            question={q}
            isLoggedIn={isLoggedIn}
            currentUserId={currentUserId}
            onRefresh={onRefresh}
            onImageClick={onImageClick}
          />
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            disabled={isPageLoading}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
          >
            {isPageLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Chargement...
              </>
            ) : (
              'Charger plus'
            )}
          </button>
        </div>
      )}
    </>
  );
}