'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, BookOpen, Download, 
    CheckCircle, Calendar, FileText, Search, Loader2,
    TrendingUp, Sparkles, GraduationCap,
    ChevronRight, ChevronLeft, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { MOCK_SERIES, SUBJECT_CONFIG, TYPE_CONFIG, SeriesItem } from './data';

// Helper functions for localStorage
function getCompletedSeries(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
        const stored = localStorage.getItem('bacplus_completed_series');
        if (stored) {
            return new Set(JSON.parse(stored));
        }
    } catch (error) {
        console.error('Error loading completed series:', error);
    }
    return new Set();
}

function saveCompletedSeries(completed: Set<string>) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('bacplus_completed_series', JSON.stringify([...completed]));
    } catch (error) {
        console.error('Error saving completed series:', error);
    }
}

function getHideCompleted(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const stored = localStorage.getItem('bacplus_hide_completed');
        return stored === 'true';
    } catch (error) {
        console.error('Error loading hide completed setting:', error);
    }
    return false;
}

function saveHideCompleted(hide: boolean) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('bacplus_hide_completed', String(hide));
    } catch (error) {
        console.error('Error saving hide completed setting:', error);
    }
}

// Subject Filter Component
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
            icon: getIcon(config.icon),
            color: config.color
        }))
    ];

    return (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {subjects.map((subject) => (
                <button
                    key={subject.key}
                    onClick={() => onChange(subject.key)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-all duration-200 text-xs sm:text-sm ${
                        selected === subject.key
                            ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                >
                    {subject.icon}
                    <span className="font-medium whitespace-nowrap">{subject.label}</span>
                </button>
            ))}
        </div>
    );
}

// Helper to get icon components
function getIcon(iconName: string) {
    switch (iconName) {
        case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
        case 'Sparkles': return <Sparkles className="w-4 h-4" />;
        case 'TrendingUp': return <TrendingUp className="w-4 h-4" />;
        case 'FileText': return <FileText className="w-4 h-4" />;
        default: return <BookOpen className="w-4 h-4" />;
    }
}

// Series Card
function SeriesCard({ 
    item, 
    onToggleComplete 
}: { 
    item: SeriesItem; 
    onToggleComplete: (id: string) => void;
}) {
    const router = useRouter();
    const subjectConfig = SUBJECT_CONFIG[item.subject];
    const typeConfig = TYPE_CONFIG[item.type];

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(item.pageUrl, '_blank');
    };

    const handleToggleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleComplete(item.id);
    };

    const handleClick = () => {
        router.push(item.pageUrl);
    };

    return (
        <div 
            onClick={handleClick}
            className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer ${
                item.is_completed ? 'border-green-300' : 'border-gray-100'
            }`}
        >
            <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${subjectConfig.color}`}>
                                {subjectConfig.label}
                            </span>
                            <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${typeConfig.color}`}>
                                {typeConfig.label}
                            </span>
                            {item.session && (
                                <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                    {item.session}
                                </span>
                            )}
                            {item.is_completed && (
                                <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full border border-green-200">
                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                    Terminé
                                </span>
                            )}
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mt-1.5 group-hover:text-orange-500 transition line-clamp-2">
                            {item.title}
                        </h3>
                        {item.description && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-[10px] sm:text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {item.year}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                        <button
                            onClick={handleToggleComplete}
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-lg border transition whitespace-nowrap ${
                                item.is_completed
                                    ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            {item.is_completed ? '✓ Terminé' : 'Terminer'}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-orange-500 text-white text-[10px] sm:text-xs font-medium rounded-lg hover:bg-orange-600 transition shadow-sm whitespace-nowrap"
                        >
                            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="hidden xs:inline">Ouvrir</span>
                            <span className="xs:hidden">Ouvrir</span>
                        </button>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Series Skeleton
function SeriesSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                    <div className="flex flex-wrap gap-1.5">
                        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mt-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex gap-3 mt-2">
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}

// Pagination Component
function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange 
}: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showEllipsis = totalPages > 7;
        
        if (!showEllipsis) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            pages.push(totalPages);
        }
        
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            
            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 px-2 sm:px-3 rounded-lg border transition text-xs sm:text-sm font-medium ${
                        page === currentPage
                            ? 'bg-orange-500 text-white border-orange-500'
                            : typeof page === 'number'
                            ? 'border-gray-200 hover:bg-gray-50'
                            : 'border-transparent cursor-default'
                    }`}
                    disabled={typeof page !== 'number'}
                >
                    {page}
                </button>
            ))}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function SeriesContent() {
    const [items, setItems] = useState<SeriesItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<SeriesItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [hideCompleted, setHideCompleted] = useState(false);
    const itemsPerPage = 10;

    // Load data and completed status from localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            const completedIds = getCompletedSeries();
            const hide = getHideCompleted();
            
            const itemsWithCompletion = MOCK_SERIES.map(item => ({
                ...item,
                is_completed: completedIds.has(item.id)
            }));
            
            setItems(itemsWithCompletion);
            setFilteredItems(itemsWithCompletion);
            setHideCompleted(hide);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Filter items
    useEffect(() => {
        let filtered = items;

        // Filter by subject
        if (selectedSubject !== 'all') {
            filtered = filtered.filter(item => item.subject === selectedSubject);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query)
            );
        }

        // Filter by completion status
        if (hideCompleted) {
            filtered = filtered.filter(item => !item.is_completed);
        }

        setFilteredItems(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [items, selectedSubject, searchQuery, hideCompleted]);

    // Toggle complete status with localStorage
    const toggleComplete = (id: string) => {
        setItems(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    return { ...item, is_completed: !item.is_completed };
                }
                return item;
            });
            
            const completedIds = new Set(
                updated.filter(item => item.is_completed).map(item => item.id)
            );
            saveCompletedSeries(completedIds);
            
            return updated;
        });
    };

    // Toggle hide completed
    const toggleHideCompleted = () => {
        const newValue = !hideCompleted;
        setHideCompleted(newValue);
        saveHideCompleted(newValue);
    };

    // Pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                    <div className="grid grid-cols-1 gap-3">
                        <SeriesSkeleton />
                        <SeriesSkeleton />
                        <SeriesSkeleton />
                    </div>
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
                            <span className="hidden sm:inline">Séries & Examens</span>
                            <span className="sm:hidden">Séries</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 hidden sm:inline">
                            {filteredItems.length} document{filteredItems.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{filteredItems.length}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Documents</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-500">
                            {filteredItems.filter(i => i.is_completed).length}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Complétés</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-500">
                            {filteredItems.length > 0 ? Math.round((filteredItems.filter(i => i.is_completed).length / filteredItems.length) * 100) : 0}%
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Progression</div>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher un document..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* Hide Completed Toggle */}
                        <button
                            onClick={toggleHideCompleted}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm whitespace-nowrap ${
                                hideCompleted
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:shadow-md'
                            }`}
                        >
                            {hideCompleted ? (
                                <Eye className="w-4 h-4" />
                            ) : (
                                <EyeOff className="w-4 h-4" />
                            )}
                            <span className="font-medium">
                                {hideCompleted ? 'Afficher complétés' : 'Cacher complétés'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Subject Filters */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm overflow-x-auto">
                    <SubjectFilter 
                        selected={selectedSubject} 
                        onChange={setSelectedSubject} 
                    />
                </div>

                {/* Disclaimer */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
                    <div className="flex items-start gap-2 sm:gap-3">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-xs sm:text-sm text-blue-700">
                            <p className="font-medium">📚 À propos des documents</p>
                            <p className="mt-0.5 text-blue-600">
                                Tous les examens sont hébergés sur <strong>bacweb.tn</strong>, la plateforme officielle du Bac Tunisien.
                                Nous ne faisons que fournir des liens directs vers ces ressources. Si un fichier est indisponible,
                                veuillez consulter directement le site officiel.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm">
                        <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Aucun document trouvé</p>
                        <p className="text-sm text-gray-400">Essayez de modifier les filtres</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-3">
                            {currentItems.map((item) => (
                                <SeriesCard
                                    key={item.id}
                                    item={item}
                                    onToggleComplete={toggleComplete}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default function SeriesPage() {
    return <SeriesContent />;
}