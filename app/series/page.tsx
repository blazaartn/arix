'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
    ArrowLeft, BookOpen, Download, Filter, 
    CheckCircle, Clock, Award, Star, 
    Calendar, FileText, Search, Loader2,
    TrendingUp, ChevronDown, ChevronRight,
    Eye, Users, Sparkles, GraduationCap
} from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';

// ✅ Types
interface SeriesItem {
    id: string;
    title: string;
    subject: 'math' | 'phy' | 'sti' | 'algorithme';
    type: 'exam' | 'series' | 'exercice' | 'correction';
    year: string;
    session?: 'principale' | 'controle' | 'rattrapage';
    difficulty: 'facile' | 'moyen' | 'difficile';
    xp_reward: number;
    file_url: string;
    download_count: number;
    is_completed: boolean;
    description?: string;
}

// ✅ Mock Data
const MOCK_SERIES: SeriesItem[] = [
    // MATH
    {
        id: '1',
        title: 'Examen Math - Bac Principale 2025',
        subject: 'math',
        type: 'exam',
        year: '2025',
        session: 'principale',
        difficulty: 'difficile',
        xp_reward: 50,
        file_url: '/mock/math-exam-2025.pdf',
        download_count: 245,
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '2',
        title: 'Série - Fonctions Logarithmes',
        subject: 'math',
        type: 'series',
        year: '2025',
        difficulty: 'moyen',
        xp_reward: 25,
        file_url: '/mock/math-series-log.pdf',
        download_count: 189,
        is_completed: false,
        description: '20 exercices progressifs sur les fonctions logarithmes.'
    },
    {
        id: '3',
        title: 'Exercices - Dérivées et Applications',
        subject: 'math',
        type: 'exercice',
        year: '2024',
        difficulty: 'facile',
        xp_reward: 15,
        file_url: '/mock/math-derivatives.pdf',
        download_count: 312,
        is_completed: false,
        description: '15 exercices corrigés sur les dérivées.'
    },
    {
        id: '4',
        title: 'Correction - Bac Math 2024',
        subject: 'math',
        type: 'correction',
        year: '2024',
        session: 'controle',
        difficulty: 'moyen',
        xp_reward: 30,
        file_url: '/mock/math-correction-2024.pdf',
        download_count: 178,
        is_completed: false,
        description: 'Correction complète de l\'examen de Mathématiques 2024.'
    },
    {
        id: '5',
        title: 'Série - Suites Numériques',
        subject: 'math',
        type: 'series',
        year: '2025',
        difficulty: 'moyen',
        xp_reward: 25,
        file_url: '/mock/math-suites.pdf',
        download_count: 156,
        is_completed: false,
        description: '25 exercices sur les suites numériques.'
    },

    // PHYSICS
    {
        id: '6',
        title: 'Examen Physique - Bac Principale 2025',
        subject: 'phy',
        type: 'exam',
        year: '2025',
        session: 'principale',
        difficulty: 'difficile',
        xp_reward: 50,
        file_url: '/mock/phy-exam-2025.pdf',
        download_count: 198,
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé.'
    },
    {
        id: '7',
        title: 'Série - Mécanique Newtonienne',
        subject: 'phy',
        type: 'series',
        year: '2025',
        difficulty: 'moyen',
        xp_reward: 25,
        file_url: '/mock/phy-mechanics.pdf',
        download_count: 167,
        is_completed: false,
        description: '15 exercices sur la mécanique newtonienne.'
    },
    {
        id: '8',
        title: 'Exercices - Électricité',
        subject: 'phy',
        type: 'exercice',
        year: '2024',
        difficulty: 'facile',
        xp_reward: 15,
        file_url: '/mock/phy-electricity.pdf',
        download_count: 234,
        is_completed: false,
        description: '12 exercices sur les circuits électriques.'
    },
    {
        id: '9',
        title: 'Correction - Bac Physique 2024',
        subject: 'phy',
        type: 'correction',
        year: '2024',
        session: 'principale',
        difficulty: 'moyen',
        xp_reward: 30,
        file_url: '/mock/phy-correction-2024.pdf',
        download_count: 145,
        is_completed: false,
        description: 'Correction détaillée de l\'examen de Physique 2024.'
    },
    {
        id: '10',
        title: 'Série - Optique Géométrique',
        subject: 'phy',
        type: 'series',
        year: '2025',
        difficulty: 'moyen',
        xp_reward: 25,
        file_url: '/mock/phy-optics.pdf',
        download_count: 123,
        is_completed: false,
        description: '20 exercices sur l\'optique géométrique.'
    },

    // STI (Sciences et Techniques Industrielles)
    {
        id: '11',
        title: 'Examen STI - Bac Principale 2025',
        subject: 'sti',
        type: 'exam',
        year: '2025',
        session: 'principale',
        difficulty: 'difficile',
        xp_reward: 50,
        file_url: '/mock/sti-exam-2025.pdf',
        download_count: 89,
        is_completed: false,
        description: 'Examen complet de STI avec corrigé.'
    },
    {
        id: '12',
        title: 'Série - Cinématique',
        subject: 'sti',
        type: 'series',
        year: '2025',
        difficulty: 'moyen',
        xp_reward: 25,
        file_url: '/mock/sti-kinematics.pdf',
        download_count: 67,
        is_completed: false,
        description: '15 exercices sur la cinématique des solides.'
    },
    {
        id: '13',
        title: 'Exercices - Résistance des Matériaux',
        subject: 'sti',
        type: 'exercice',
        year: '2024',
        difficulty: 'moyen',
        xp_reward: 20,
        file_url: '/mock/sti-materials.pdf',
        download_count: 78,
        is_completed: false,
        description: '10 exercices sur la résistance des matériaux.'
    },
    {
        id: '14',
        title: 'Correction - Bac STI 2024',
        subject: 'sti',
        type: 'correction',
        year: '2024',
        session: 'controle',
        difficulty: 'moyen',
        xp_reward: 30,
        file_url: '/mock/sti-correction-2024.pdf',
        download_count: 56,
        is_completed: false,
        description: 'Correction de l\'examen de STI 2024.'
    },

    // ALGORITHME
    {
        id: '15',
        title: 'Examen Algorithme - Bac Principale 2025',
        subject: 'algorithme',
        type: 'exam',
        year: '2025',
        session: 'principale',
        difficulty: 'difficile',
        xp_reward: 50,
        file_url: '/mock/algorithm-exam-2025.pdf',
        download_count: 234,
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé.'
    },
    {
        id: '16',
        title: 'Série - Tableaux et Structures',
        subject: 'algorithme',
        type: 'series',
        year: '2025',
        difficulty: 'moyen',
        xp_reward: 25,
        file_url: '/mock/algorithm-arrays.pdf',
        download_count: 189,
        is_completed: false,
        description: '20 exercices sur les tableaux et structures de données.'
    },
    {
        id: '17',
        title: 'Exercices - Boucles et Conditions',
        subject: 'algorithme',
        type: 'exercice',
        year: '2024',
        difficulty: 'facile',
        xp_reward: 15,
        file_url: '/mock/algorithm-loops.pdf',
        download_count: 278,
        is_completed: false,
        description: '15 exercices sur les boucles et conditions.'
    },
    {
        id: '18',
        title: 'Série - Fonctions et Procédures',
        subject: 'algorithme',
        type: 'series',
        year: '2025',
        difficulty: 'moyen',
        xp_reward: 25,
        file_url: '/mock/algorithm-functions.pdf',
        download_count: 156,
        is_completed: false,
        description: '18 exercices sur les fonctions et procédures.'
    },
    {
        id: '19',
        title: 'Correction - Bac Algorithme 2024',
        subject: 'algorithme',
        type: 'correction',
        year: '2024',
        session: 'principale',
        difficulty: 'moyen',
        xp_reward: 30,
        file_url: '/mock/algorithm-correction-2024.pdf',
        download_count: 134,
        is_completed: false,
        description: 'Correction détaillée de l\'examen d\'Algorithme 2024.'
    },
    {
        id: '20',
        title: 'Exercices - Tri et Recherche',
        subject: 'algorithme',
        type: 'exercice',
        year: '2025',
        difficulty: 'difficile',
        xp_reward: 20,
        file_url: '/mock/algorithm-sort.pdf',
        download_count: 145,
        is_completed: false,
        description: '12 exercices sur les algorithmes de tri et recherche.'
    },
];

// ✅ Subject Config
const SUBJECT_CONFIG = {
    math: { 
        label: 'Mathématiques', 
        icon: <GraduationCap className="w-5 h-5" />, 
        color: 'bg-blue-100 text-blue-600 border-blue-200',
        bgColor: 'from-blue-50 to-blue-100',
        progressColor: 'bg-blue-500'
    },
    phy: { 
        label: 'Physique', 
        icon: <Sparkles className="w-5 h-5" />, 
        color: 'bg-purple-100 text-purple-600 border-purple-200',
        bgColor: 'from-purple-50 to-purple-100',
        progressColor: 'bg-purple-500'
    },
    sti: { 
        label: 'STI', 
        icon: <TrendingUp className="w-5 h-5" />, 
        color: 'bg-green-100 text-green-600 border-green-200',
        bgColor: 'from-green-50 to-green-100',
        progressColor: 'bg-green-500'
    },
    algorithme: { 
        label: 'Algorithme', 
        icon: <FileText className="w-5 h-5" />, 
        color: 'bg-orange-100 text-orange-600 border-orange-200',
        bgColor: 'from-orange-50 to-orange-100',
        progressColor: 'bg-orange-500'
    },
};

const TYPE_CONFIG = {
    exam: { label: 'Examen', color: 'bg-red-100 text-red-600 border-red-200' },
    series: { label: 'Série', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    exercice: { label: 'Exercice', color: 'bg-green-100 text-green-600 border-green-200' },
    correction: { label: 'Correction', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
};

const DIFFICULTY_CONFIG = {
    facile: { label: 'Facile', color: 'text-green-600 bg-green-50 border-green-200' },
    moyen: { label: 'Moyen', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    difficile: { label: 'Difficile', color: 'text-red-600 bg-red-50 border-red-200' },
};

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ✅ Subject Filter Component
function SubjectFilter({ 
    selected, 
    onChange 
}: { 
    selected: string; 
    onChange: (subject: string) => void;
}) {
    const subjects = [
        { key: 'all', label: 'Tous', icon: <BookOpen className="w-4 h-4" /> },
        ...Object.entries(SUBJECT_CONFIG).map(([key, config]) => ({
            key,
            label: config.label,
            icon: config.icon,
            color: config.color
        }))
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
                <button
                    key={subject.key}
                    onClick={() => onChange(subject.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                        selected === subject.key
                            ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                >
                    {subject.icon}
                    <span className="text-sm font-medium">{subject.label}</span>
                </button>
            ))}
        </div>
    );
}

// ✅ Type Filter Component
function TypeFilter({ 
    selected, 
    onChange 
}: { 
    selected: string; 
    onChange: (type: string) => void;
}) {
    const types = [
        { key: 'all', label: 'Tous' },
        ...Object.entries(TYPE_CONFIG).map(([key, config]) => ({
            key,
            label: config.label
        }))
    ];

    return (
        <div className="flex flex-wrap gap-1.5">
            {types.map((type) => (
                <button
                    key={type.key}
                    onClick={() => onChange(type.key)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition ${
                        selected === type.key
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {type.label}
                </button>
            ))}
        </div>
    );
}

// ✅ Difficulty Filter Component
function DifficultyFilter({ 
    selected, 
    onChange 
}: { 
    selected: string; 
    onChange: (difficulty: string) => void;
}) {
    const difficulties = [
        { key: 'all', label: 'Tous' },
        { key: 'facile', label: 'Facile' },
        { key: 'moyen', label: 'Moyen' },
        { key: 'difficile', label: 'Difficile' },
    ];

    return (
        <div className="flex flex-wrap gap-1.5">
            {difficulties.map((diff) => (
                <button
                    key={diff.key}
                    onClick={() => onChange(diff.key)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition ${
                        selected === diff.key
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {diff.label}
                </button>
            ))}
        </div>
    );
}

export default function SeriesPage() {
    const { data: session } = useSession();
    const [items, setItems] = useState<SeriesItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<SeriesItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [completedCount, setCompletedCount] = useState(0);
    const [totalXP, setTotalXP] = useState(0);

    // ✅ Load mock data
    useEffect(() => {
        // Simulate API loading
        const timer = setTimeout(() => {
            setItems(MOCK_SERIES);
            setFilteredItems(MOCK_SERIES);
            setCompletedCount(MOCK_SERIES.filter(item => item.is_completed).length);
            setTotalXP(MOCK_SERIES.reduce((acc, item) => acc + (item.is_completed ? item.xp_reward : 0), 0));
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // ✅ Filter items
    useEffect(() => {
        let filtered = items;

        // Subject filter
        if (selectedSubject !== 'all') {
            filtered = filtered.filter(item => item.subject === selectedSubject);
        }

        // Type filter
        if (selectedType !== 'all') {
            filtered = filtered.filter(item => item.type === selectedType);
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all') {
            filtered = filtered.filter(item => item.difficulty === selectedDifficulty);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query)
            );
        }

        setFilteredItems(filtered);
    }, [items, selectedSubject, selectedType, selectedDifficulty, searchQuery]);

    // ✅ Toggle complete status
    const toggleComplete = (id: string) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newCompleted = !item.is_completed;
                setTotalXP(prevTotal => newCompleted ? prevTotal + item.xp_reward : prevTotal - item.xp_reward);
                setCompletedCount(prevCount => newCompleted ? prevCount + 1 : prevCount - 1);
                return { ...item, is_completed: newCompleted };
            }
            return item;
        }));
    };

    // ✅ Download handler
    const handleDownload = (item: SeriesItem) => {
        setItems(prev => prev.map(i => 
            i.id === item.id ? { ...i, download_count: i.download_count + 1 } : i
        ));
        // Simulate file download
        window.open(item.file_url, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    <p className="text-gray-400 text-sm">Chargement des séries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-orange-500" />
                            Séries & Examens
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                            {filteredItems.length} document{filteredItems.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-gray-900">{filteredItems.length}</div>
                        <div className="text-xs text-gray-500">Documents</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-green-500">{completedCount}</div>
                        <div className="text-xs text-gray-500">Complétés</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-orange-500">{totalXP}</div>
                        <div className="text-xs text-gray-500">XP Gagné</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-blue-500">
                            {filteredItems.length > 0 ? Math.round((completedCount / filteredItems.length) * 100) : 0}%
                        </div>
                        <div className="text-xs text-gray-500">Progression</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher un document..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* Subject Filter */}
                        <SubjectFilter 
                            selected={selectedSubject} 
                            onChange={setSelectedSubject} 
                        />

                        {/* Type & Difficulty Filters */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">Type:</span>
                                <TypeFilter selected={selectedType} onChange={setSelectedType} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">Difficulté:</span>
                                <DifficultyFilter selected={selectedDifficulty} onChange={setSelectedDifficulty} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Aucun document trouvé</p>
                        <p className="text-sm text-gray-400">Essayez de modifier les filtres</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {filteredItems.map((item) => {
                            const subjectConfig = SUBJECT_CONFIG[item.subject];
                            const typeConfig = TYPE_CONFIG[item.type];
                            const difficultyConfig = DIFFICULTY_CONFIG[item.difficulty];
                            
                            return (
                                <div 
                                    key={item.id}
                                    className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                                        item.is_completed ? 'border-green-300' : 'border-gray-100'
                                    }`}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${subjectConfig.color}`}>
                                                        {subjectConfig.label}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${typeConfig.color}`}>
                                                        {typeConfig.label}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyConfig.color}`}>
                                                        {difficultyConfig.label}
                                                    </span>
                                                    {item.session && (
                                                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                                            {item.session}
                                                        </span>
                                                    )}
                                                    {item.is_completed && (
                                                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full border border-green-200">
                                                            <CheckCircle className="w-3 h-3 inline mr-1" />
                                                            Terminé
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-semibold text-gray-900 mt-1.5">
                                                    {item.title}
                                                </h3>
                                                {item.description && (
                                                    <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {item.year}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Download className="w-3 h-3" />
                                                        {formatNumber(item.download_count)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Award className="w-3 h-3 text-orange-500" />
                                                        +{item.xp_reward} XP
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                                <button
                                                    onClick={() => toggleComplete(item.id)}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                                                        item.is_completed
                                                            ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {item.is_completed ? '✓ Terminé' : 'Marquer terminé'}
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(item)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition shadow-sm"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Télécharger
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}