export interface SeriesItem {
    id: string;
    title: string;
    subject: 'math' | 'phy' | 'sti' | 'algorithme';
    type: 'exam' | 'series' | 'exercice' | 'correction';
    year: string;
    session?: 'principale' | 'controle' | 'rattrapage';
    pageUrl: string;
    is_completed: boolean;
    description?: string;
}

export const SUBJECT_CONFIG = {
    math: { 
        label: 'Mathématiques', 
        icon: 'GraduationCap',
        color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    phy: { 
        label: 'Physique', 
        icon: 'Sparkles',
        color: 'bg-purple-100 text-purple-600 border-purple-200'
    },
    sti: { 
        label: 'STI', 
        icon: 'TrendingUp',
        color: 'bg-green-100 text-green-600 border-green-200'
    },
    algorithme: { 
        label: 'Algorithme', 
        icon: 'FileText',
        color: 'bg-orange-100 text-orange-600 border-orange-200'
    },
} as const;

export const TYPE_CONFIG = {
    exam: { label: 'Examen', color: 'bg-red-100 text-red-600 border-red-200' },
    series: { label: 'Série', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    exercice: { label: 'Exercice', color: 'bg-green-100 text-green-600 border-green-200' },
    correction: { label: 'Correction', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
} as const;

export const MOCK_SERIES: SeriesItem[] = [
    {
        id: '1',
        title: 'Examen Math - Bac Principale 2025',
        subject: 'math',
        type: 'exam',
        year: '2025',
        session: 'principale',
        pageUrl: '/series/1',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '2',
        title: 'Série - Fonctions Logarithmes',
        subject: 'math',
        type: 'series',
        year: '2025',
        pageUrl: '/series/2',
        is_completed: false,
        description: '20 exercices progressifs sur les fonctions logarithmes.'
    },
    {
        id: '3',
        title: 'Exercices - Dérivées et Applications',
        subject: 'math',
        type: 'exercice',
        year: '2024',
        pageUrl: '/series/3',
        is_completed: false,
        description: '15 exercices corrigés sur les dérivées.'
    },
    // ✅ Add more series here easily
];