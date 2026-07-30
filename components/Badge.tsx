'use client';

import { Crown, Medal, Award, Star, User } from 'lucide-react';

interface BadgeProps {
  type: 'rank' | 'professor' | 'admin' | 'verified';
  rank?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function Badge({ 
  type, 
  rank, 
  size = 'sm', 
  showLabel = false,
  className = ''
}: BadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 text-[8px]',
    md: 'w-5 h-5 text-[10px]',
    lg: 'w-6 h-6 text-xs',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const labelSize = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  // ✅ Rank Badges (Top 3)
  if (type === 'rank') {
    const rankColors = {
      1: 'bg-yellow-500 text-white border-yellow-600 shadow-lg shadow-yellow-500/30',
      2: 'bg-gray-400 text-white border-gray-500 shadow-lg shadow-gray-400/30',
      3: 'bg-orange-600 text-white border-orange-700 shadow-lg shadow-orange-600/30',
    };

    const rankLabels = {
      1: '🏆 1er',
      2: '🥈 2ème',
      3: '🥉 3ème',
    };

    const rankIcons = {
      1: <Crown className={`${iconSize[size]} fill-yellow-300`} />,
      2: <Medal className={`${iconSize[size]} text-gray-300`} />,
      3: <Medal className={`${iconSize[size]} text-orange-300`} />,
    };

    if (!rank || rank > 3) return null;

    return (
      <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border font-bold ${rankColors[rank as keyof typeof rankColors]} ${className}`}>
        {rankIcons[rank as keyof typeof rankIcons]}
        <span className={`${labelSize[size]} font-bold`}>
          #{rank}
        </span>
      </div>
    );
  }

  // ✅ Professor Badge
  if (type === 'professor') {
    return (
      <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 ${className}`}>
        <User className={`${iconSize[size]} text-blue-500`} />
        <span className={`${labelSize[size]} font-medium`}>
          {showLabel ? 'Professeur' : '👨‍🏫'}
        </span>
      </div>
    );
  }

  // ✅ Admin Badge
  if (type === 'admin') {
    return (
      <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 ${className}`}>
        <Crown className={`${iconSize[size]} text-purple-500`} />
        <span className={`${labelSize[size]} font-medium`}>
          {showLabel ? 'Admin' : '👑'}
        </span>
      </div>
    );
  }

  // ✅ Verified Badge
  if (type === 'verified') {
    return (
      <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 ${className}`}>
        <Star className={`${iconSize[size]} text-green-500 fill-green-500`} />
        <span className={`${labelSize[size]} font-medium`}>
          {showLabel ? 'Vérifié' : '✓'}
        </span>
      </div>
    );
  }

  return null;
}

// ✅ Helper component to display all badges for a user
interface UserBadgesProps {
  userId: string;
  userName: string;
  role: string;
  rank?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function UserBadges({ 
  userId, 
  userName, 
  role, 
  rank, 
  size = 'sm',
  showLabels = false
}: UserBadgesProps) {
  const badges = [];

  // ✅ Rank badge (Top 3)
  if (rank && rank <= 3) {
    badges.push(
      <Badge key="rank" type="rank" rank={rank} size={size} showLabel={showLabels} />
    );
  }

  // ✅ Role badges
  if (role === 'admin') {
    badges.push(
      <Badge key="admin" type="admin" size={size} showLabel={showLabels} />
    );
  } else if (role === 'professor') {
    badges.push(
      <Badge key="professor" type="professor" size={size} showLabel={showLabels} />
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {badges}
    </div>
  );
}