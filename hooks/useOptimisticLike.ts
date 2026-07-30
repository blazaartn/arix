'use client';

import { useState, useCallback } from 'react';

export function useOptimisticLike(
  initialCount: number,
  initialLiked: boolean,
  onToggle: () => Promise<boolean>
) {
  const [likes, setLikes] = useState({ count: initialCount, liked: initialLiked });
  const [isPending, setIsPending] = useState(false);

  const toggle = useCallback(async () => {
    if (isPending) return;

    // Optimistic update
    const newLiked = !likes.liked;
    setLikes(prev => ({
      count: newLiked ? prev.count + 1 : prev.count - 1,
      liked: newLiked
    }));
    setIsPending(true);

    try {
      const result = await onToggle();
      // If server returns different state, sync it
      if (result !== newLiked) {
        setLikes(prev => ({
          count: result ? prev.count + 2 : prev.count - 2,
          liked: result
        }));
      }
    } catch (error) {
      // Revert on error
      setLikes(prev => ({
        count: newLiked ? prev.count - 1 : prev.count + 1,
        liked: !newLiked
      }));
    } finally {
      setIsPending(false);
    }
  }, [likes.liked, isPending, onToggle]);

  return { ...likes, toggle, isPending };
}