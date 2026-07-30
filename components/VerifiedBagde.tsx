'use client';

import { UserBadges } from './Badge';

interface VerifiedBadgeProps {
    role: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    rank?: number;
}

export function VerifiedBadge({ role, size = 'sm', showLabel = false, rank }: VerifiedBadgeProps) {
    // If no special role and no rank, return null
    if (role !== 'professor' && role !== 'admin' && (!rank || rank > 3)) {
        return null;
    }

    return (
        <UserBadges 
            userId="" 
            userName="" 
            role={role} 
            rank={rank} 
            size={size} 
            showLabels={showLabel} 
        />
    );
}