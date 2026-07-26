'use client';

import { Award } from 'lucide-react';

interface VerifiedBadgeProps {
    role: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function VerifiedBadge({ role, size = 'md', showLabel = false }: VerifiedBadgeProps) {
    // Only show for professors and admins
    if (role !== 'professor' && role !== 'admin') return null;

    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const labelClasses = {
        sm: 'text-[8px]',
        md: 'text-[10px]',
        lg: 'text-xs'
    };

    return (
        <div className="inline-flex items-center gap-1">
            <div 
                className={`inline-flex items-center justify-center bg-blue-500 rounded-full p-0.5 shadow-sm shadow-blue-500/20 ${sizeClasses[size]}`}
                title="Professeur vérifié"
            >
                <Award className="w-full h-full text-white fill-white" />
            </div>
            {showLabel && (
                <span className={`font-medium text-blue-600 ${labelClasses[size]}`}>
                    Professeur
                </span>
            )}
        </div>
    );
}