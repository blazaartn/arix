'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, BookOpen, Code, 
    FileCode, Database, Server, Terminal, 
    Layout, Globe, CheckCircle,
    Clock, ChevronRight, 
    ExternalLink, FolderOpen, Search,
    Briefcase, X, Loader2
} from 'lucide-react';
import { PROJECTS, Project } from './data';

// Category Icons
const CategoryIcon = ({ category }: { category: Project['category'] }) => {
    const icons = {
        html: <Layout className="w-4 h-4 md:w-5 md:h-5" />,
        css: <Layout className="w-4 h-4 md:w-5 md:h-5" />,
        javascript: <FileCode className="w-4 h-4 md:w-5 md:h-5" />,
        php: <Server className="w-4 h-4 md:w-5 md:h-5" />,
        sql: <Database className="w-4 h-4 md:w-5 md:h-5" />,
        python: <Terminal className="w-4 h-4 md:w-5 md:h-5" />,
        fullstack: <Globe className="w-4 h-4 md:w-5 md:h-5" />
    };
    return icons[category] || <Code className="w-4 h-4 md:w-5 md:h-5" />;
};

// Category Colors
const CategoryColors = {
    html: 'bg-orange-100 text-orange-600 border-orange-200',
    css: 'bg-blue-100 text-blue-600 border-blue-200',
    javascript: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    php: 'bg-purple-100 text-purple-600 border-purple-200',
    sql: 'bg-green-100 text-green-600 border-green-200',
    python: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    fullstack: 'bg-pink-100 text-pink-600 border-pink-200'
};

// Helper functions for localStorage
function getCompletedProjects(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
        const stored = localStorage.getItem('bacplus_completed_projects');
        if (stored) {
            return new Set(JSON.parse(stored));
        }
    } catch (error) {
        console.error('Error loading completed projects:', error);
    }
    return new Set();
}

function saveCompletedProjects(completed: Set<string>) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('bacplus_completed_projects', JSON.stringify([...completed]));
    } catch (error) {
        console.error('Error saving completed projects:', error);
    }
}

// Category Filter Component
function CategoryFilter({ 
    selected, 
    onChange 
}: { 
    selected: string; 
    onChange: (category: string) => void;
}) {
    const categories = [
        { key: 'all', label: 'Tous' },
        { key: 'html', label: 'HTML' },
        { key: 'css', label: 'CSS' },
        { key: 'javascript', label: 'JavaScript' },
        { key: 'php', label: 'PHP' },
        { key: 'sql', label: 'SQL' },
        { key: 'python', label: 'Python' },
        { key: 'fullstack', label: 'Fullstack' },
    ];

    return (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((cat) => (
                <button
                    key={cat.key}
                    onClick={() => onChange(cat.key)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full border transition ${
                        selected === cat.key
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}

// Project Card
function ProjectCard({ 
    project, 
    onToggleComplete 
}: { 
    project: Project; 
    onToggleComplete: (id: string) => void;
}) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        router.push(project.pageUrl);
    };

    const handleToggleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleComplete(project.id);
    };

    return (
        <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer ${
            project.is_completed ? 'border-green-300 border-2' : 'border-gray-100'
        }`}>
            <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1.5 sm:p-2 rounded-lg border flex-shrink-0 ${CategoryColors[project.category]}`}>
                            <CategoryIcon category={project.category} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                                <span className="truncate">{project.title}</span>
                                {project.is_completed && (
                                    <span className="text-green-500 flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 fill-green-500 text-white" />
                                    </span>
                                )}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{project.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0 ml-2">
                        <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {project.is_completed ? '✓ Terminé' : `${project.tasks.length} tâches`}
                        </span>
                    </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {tech}
                        </span>
                    ))}
                    {project.technologies.length > 4 && (
                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 text-gray-400">+{project.technologies.length - 4}</span>
                    )}
                </div>

                {/* Expand/Collapse Tasks */}
                <button
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    className="text-[10px] sm:text-xs text-orange-500 hover:text-orange-600 font-medium mt-2 flex items-center gap-1"
                >
                    {isExpanded ? 'Masquer les tâches' : 'Voir les tâches'}
                    <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                    <div className="mt-2 space-y-1">
                        {project.tasks.map((task, index) => (
                            <div key={index} className="flex items-start gap-1.5 text-[10px] sm:text-xs p-1.5 rounded-lg hover:bg-gray-50">
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5"></div>
                                <span className="text-gray-600 flex-1">{task}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-50">
                    <button
                        onClick={handleClick}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-orange-500 text-white text-[10px] sm:text-sm font-medium rounded-lg hover:bg-orange-600 transition"
                    >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Ouvrir
                    </button>
                    <button
                        onClick={handleToggleComplete}
                        className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-lg border transition whitespace-nowrap ${
                            project.is_completed
                                ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                        {project.is_completed ? '✓ Terminé' : 'Terminer'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Project Skeleton
function ProjectSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-48 mt-1"></div>
                    </div>
                </div>
            </div>
            <div className="flex gap-1 mt-2">
                <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                <div className="h-8 flex-1 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
}

function ProjectsContent() {
    const [items, setItems] = useState<Project[]>([]);
    const [filteredItems, setFilteredItems] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Load data and completed status from localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            const completedIds = getCompletedProjects();
            
            const itemsWithCompletion = PROJECTS.map(item => ({
                ...item,
                is_completed: completedIds.has(item.id)
            }));
            
            setItems(itemsWithCompletion);
            setFilteredItems(itemsWithCompletion);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Filter items
    useEffect(() => {
        let filtered = items;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.technologies.some(t => t.toLowerCase().includes(query))
            );
        }

        setFilteredItems(filtered);
    }, [items, selectedCategory, searchQuery]);

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
            saveCompletedProjects(completedIds);
            
            return updated;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <ProjectSkeleton />
                        <ProjectSkeleton />
                        <ProjectSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    const totalTasks = filteredItems.reduce((acc, p) => acc + p.tasks.length, 0);
    const completedTasks = filteredItems.reduce((acc, p) => 
        acc + (p.is_completed ? p.tasks.length : 0), 0
    );
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
                            <Briefcase className="w-6 h-6 text-orange-500" />
                            <span className="hidden sm:inline">Projets</span>
                            <span className="sm:hidden">Projets</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 hidden sm:inline">
                            {filteredItems.length} projet{filteredItems.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* Stats Cards - No XP */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{filteredItems.length}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Projets</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-500">
                            {filteredItems.filter(i => i.is_completed).length}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Terminés</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-500">{progressPercentage}%</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Progression</div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher un projet..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <CategoryFilter 
                            selected={selectedCategory} 
                            onChange={setSelectedCategory} 
                        />
                    </div>
                </div>

                {/* Results */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm">
                        <FolderOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Aucun projet trouvé</p>
                        <p className="text-sm text-gray-400">Essayez de modifier les filtres</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {filteredItems.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onToggleComplete={toggleComplete}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ProjectsPage() {
    return <ProjectsContent />;
}