'use client';

import { useState, useEffect, useCallback } from 'react';

interface LikeState {
  count: number;
  liked: boolean;
}

interface LikeCache {
  [key: string]: LikeState;
}

export function useLikes(
  questionId: string,
  initialCount: number = 0,
  initialLiked: boolean = false
) {
  const [state, setState] = useState<LikeState>({
    count: typeof initialCount === 'number' ? initialCount : parseInt(String(initialCount)) || 0,
    liked: Boolean(initialLiked)
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Load from localStorage OR use server data
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('bacplus_likes');
      if (stored) {
        const cache: LikeCache = JSON.parse(stored);
        if (cache[questionId]) {
          setState({
            count: typeof cache[questionId].count === 'number' ? cache[questionId].count : parseInt(String(cache[questionId].count)) || 0,
            liked: Boolean(cache[questionId].liked)
          });
          return;
        }
      }
    } catch (error) {
      console.error('Error loading likes from localStorage:', error);
    }
    
    setState({
      count: typeof initialCount === 'number' ? initialCount : parseInt(String(initialCount)) || 0,
      liked: Boolean(initialLiked)
    });
  }, [questionId, initialCount, initialLiked]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('bacplus_likes');
      const cache: LikeCache = stored ? JSON.parse(stored) : {};
      cache[questionId] = {
        count: typeof state.count === 'number' ? state.count : parseInt(String(state.count)) || 0,
        liked: Boolean(state.liked)
      };
      localStorage.setItem('bacplus_likes', JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving likes to localStorage:', error);
    }
  }, [questionId, state, isHydrated]);

  const toggleLike = useCallback(async () => {
    if (isPending) return;
    
    const currentCount = typeof state.count === 'number' ? state.count : parseInt(String(state.count)) || 0;
    const newLiked = !state.liked;
    
    // ✅ CORRECT: Only change by +/-1, not based on server response
    const newCount = newLiked ? currentCount + 1 : currentCount - 1;
    
    // Optimistic update
    setState({
      count: newCount,
      liked: newLiked
    });
    setIsPending(true);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      });
      const data = await res.json();
      
      // ✅ Use server count directly - it's the total
      if (data.count !== undefined) {
        setState({
          count: typeof data.count === 'number' ? data.count : parseInt(String(data.count)) || 0,
          liked: Boolean(data.liked)
        });
      }
    } catch {
      // ✅ Revert on error - go back to original state
      setState({
        count: currentCount,
        liked: !newLiked
      });
    } finally {
      setIsPending(false);
    }
  }, [questionId, state, isPending]);

  const refreshFromServer = useCallback(async () => {
    try {
      const res = await fetch(`/api/likes?questionId=${questionId}`);
      const data = await res.json();
      if (data.count !== undefined) {
        const newState = {
          count: typeof data.count === 'number' ? data.count : parseInt(String(data.count)) || 0,
          liked: Boolean(data.liked)
        };
        setState(newState);
        
        if (typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem('bacplus_likes');
            const cache: LikeCache = stored ? JSON.parse(stored) : {};
            cache[questionId] = newState;
            localStorage.setItem('bacplus_likes', JSON.stringify(cache));
          } catch (error) {
            console.error('Error updating localStorage from server:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing likes:', error);
    }
  }, [questionId]);

  return {
    count: typeof state.count === 'number' ? state.count : 0,
    liked: Boolean(state.liked),
    toggleLike,
    refreshFromServer,
    isPending
  };
}

export function clearLikesCache() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bacplus_likes');
    }
  } catch (error) {
    console.error('Error clearing likes cache:', error);
  }
}