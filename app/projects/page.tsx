'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, Download, Code, 
    FileCode, Database, Server, Terminal, 
    Layout, Globe, CheckCircle,
    Clock, Award, ChevronRight, 
    ExternalLink, FolderOpen, Sparkles,
    Trophy, RotateCcw, X, Briefcase, Search
} from 'lucide-react';

// ✅ GitHub Icon SVG
const GithubIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
);

// ✅ Project Type Definition
interface Project {
    id: string;
    title: string;
    description: string;
    category: 'html' | 'css' | 'javascript' | 'php' | 'sql' | 'python' | 'fullstack';
    xp_reward: number;
    github_url: string;
    zip_url: string;
    demo_url?: string;
    technologies: string[];
    tasks: string[];
}

// ✅ Project Progress Type
interface ProjectProgress {
    projectId: string;
    completedTasks: number[];
    isCompleted: boolean;
    completedAt?: string;
}

// ✅ Static Projects Data
const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Emploi du Temps - HTML',
        description: 'Créez un emploi du temps interactif en HTML pur. Concevez une page web qui affiche un planning hebdomadaire avec des cours, des pauses et des activités.',
        category: 'html',
        xp_reward: 30,
        github_url: 'https://github.com/yourusername/emploi-du-temps',
        zip_url: 'https://github.com/yourusername/emploi-du-temps/archive/refs/heads/main.zip',
        demo_url: 'https://your-demo-link.com',
        technologies: ['HTML5', 'CSS3'],
        tasks: [
            'Créer une grille 7x24 (jours x heures)',
            'Ajouter des cours avec des couleurs différentes par matière',
            'Ajouter des pauses et des activités',
            'Faire une version responsive pour mobile'
        ],
    },
    {
        id: '2',
        title: 'Restaurant App - HTML/CSS',
        description: 'Complétez le code HTML et CSS d\'une petite application de restaurant. Le squelette HTML est fourni, vous devez ajouter les styles et les interactions manquantes.',
        category: 'css',
        xp_reward: 25,
        github_url: 'https://github.com/yourusername/restaurant-app',
        zip_url: 'https://github.com/yourusername/restaurant-app/archive/refs/heads/main.zip',
        demo_url: 'https://your-demo-link.com',
        technologies: ['HTML5', 'CSS3', 'Flexbox', 'Grid'],
        tasks: [
            'Styliser le menu du restaurant',
            'Ajouter des animations hover sur les plats',
            'Créer un panier interactif (frontend uniquement)',
            'Rendre la page responsive'
        ],
    },
    {
        id: '3',
        title: 'Fonctions JavaScript - 3 Exercices',
        description: 'Implémentez 3 fonctions JavaScript essentielles : vérification de nombre premier, validation d\'email, et formatage de chaîne de caractères.',
        category: 'javascript',
        xp_reward: 40,
        github_url: 'https://github.com/yourusername/js-functions',
        zip_url: 'https://github.com/yourusername/js-functions/archive/refs/heads/main.zip',
        technologies: ['JavaScript', 'ES6'],
        tasks: [
            'Fonction isPrime(n) : vérifier si un nombre est premier',
            'Fonction validateEmail(email) : valider un format d\'email avec regex',
            'Fonction formatString(str, style) : formater une chaîne (upper, lower, capitalize)',
            'Écrire des tests unitaires pour chaque fonction'
        ],
    },
    {
        id: '4',
        title: 'PHP - Connexion à la Base de Données',
        description: 'Complétez le code PHP manquant pour établir une connexion sécurisée à une base de données MySQL. Le projet inclut la gestion des erreurs et des requêtes préparées.',
        category: 'php',
        xp_reward: 45,
        github_url: 'https://github.com/yourusername/php-db-connection',
        zip_url: 'https://github.com/yourusername/php-db-connection/archive/refs/heads/main.zip',
        technologies: ['PHP', 'MySQL', 'PDO'],
        tasks: [
            'Configurer la connexion PDO avec les variables d\'environnement',
            'Implémenter les fonctions CRUD (Create, Read, Update, Delete)',
            'Gérer les erreurs de connexion',
            'Ajouter des requêtes préparées pour la sécurité'
        ],
    },
    {
        id: '5',
        title: 'SQL - Schéma Produit-Achat-Client',
        description: 'Créez et complétez un schéma de base de données pour un système de gestion de produits, achats et clients. Le schéma doit inclure les relations et contraintes.',
        category: 'sql',
        xp_reward: 35,
        github_url: 'https://github.com/yourusername/sql-schema',
        zip_url: 'https://github.com/yourusername/sql-schema/archive/refs/heads/main.zip',
        technologies: ['SQL', 'PostgreSQL', 'MySQL'],
        tasks: [
            'Créer la table "produits" avec les colonnes appropriées',
            'Créer la table "clients" avec email unique et contraintes',
            'Créer la table "achats" avec les relations (clés étrangères)',
            'Ajouter des index pour optimiser les requêtes',
            'Écrire les requêtes JOIN pour les rapports'
        ],
    },
    {
        id: '6',
        title: 'Python - Calculateur de Factorielle',
        description: 'Créez un petit programme Python qui calcule la factorielle d\'un nombre. Version interactive et interface simple à implémenter.',
        category: 'python',
        xp_reward: 20,
        github_url: 'https://github.com/yourusername/python-factorial',
        zip_url: 'https://github.com/yourusername/python-factorial/archive/refs/heads/main.zip',
        technologies: ['Python', 'PyQt5'],
        tasks: [
            'Créer une fonction factorial(n) en récursif et itératif',
            'Ajouter une interface en ligne de commande',
            'Créer une interface simple avec PyQt5 ou Tkinter',
            'Gérer les erreurs (nombre négatif, non-entier)'
        ],
    },
    {
        id: '7',
        title: 'Python - Interface PyQt5 To-Do',
        description: 'Créez une interface utilisateur avec PyQt5 pour une application de gestion de tâches. Widgets et gestion d\'événements à implémenter.',
        category: 'python',
        xp_reward: 50,
        github_url: 'https://github.com/yourusername/pyqt5-todo',
        zip_url: 'https://github.com/yourusername/pyqt5-todo/archive/refs/heads/main.zip',
        technologies: ['Python', 'PyQt5', 'QWidgets'],
        tasks: [
            'Créer une fenêtre principale avec QMainWindow',
            'Ajouter une liste de tâches avec QListWidget',
            'Ajouter des boutons Ajouter, Supprimer, Modifier',
            'Persister les tâches dans un fichier JSON',
            'Ajouter des couleurs pour les tâches complétées'
        ],
    }
];

// ✅ Category Icons
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

// ✅ Category Colors
const CategoryColors = {
    html: 'bg-orange-100 text-orange-600 border-orange-200',
    css: 'bg-blue-100 text-blue-600 border-blue-200',
    javascript: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    php: 'bg-purple-100 text-purple-600 border-purple-200',
    sql: 'bg-green-100 text-green-600 border-green-200',
    python: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    fullstack: 'bg-pink-100 text-pink-600 border-pink-200'
};

function formatNumber(num: number): string {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

export default function ProjectsPage() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ Load progress from localStorage
    const [progress, setProgress] = useState<Record<string, ProjectProgress>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('projectProgress');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return {};
                }
            }
        }
        return {};
    });

    // ✅ Save progress to localStorage
    useEffect(() => {
        localStorage.setItem('projectProgress', JSON.stringify(progress));
    }, [progress]);

    // ✅ Filter projects by search only
    const filteredProjects = PROJECTS.filter(project => {
        const matchSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchSearch;
    });

    // ✅ Handle task completion toggle
    const toggleTask = (projectId: string, taskIndex: number) => {
        const current = progress[projectId];
        const completedTasks = current?.completedTasks || [];
        const isCompleted = completedTasks.includes(taskIndex);

        let newCompletedTasks;
        if (isCompleted) {
            newCompletedTasks = completedTasks.filter(i => i !== taskIndex);
        } else {
            newCompletedTasks = [...completedTasks, taskIndex];
        }

        const project = PROJECTS.find(p => p.id === projectId);
        const allTasksCompleted = newCompletedTasks.length === project?.tasks.length;

        setProgress({
            ...progress,
            [projectId]: {
                projectId,
                completedTasks: newCompletedTasks,
                isCompleted: allTasksCompleted,
                completedAt: allTasksCompleted ? new Date().toISOString() : undefined
            }
        });
    };

    // ✅ Reset progress for a project
    const resetProgress = (projectId: string) => {
        if (confirm('Réinitialiser la progression de ce projet ?')) {
            const newProgress = { ...progress };
            delete newProgress[projectId];
            setProgress(newProgress);
        }
    };

    // ✅ Get stats
    const totalProjects = PROJECTS.length;
    const completedProjects = Object.values(progress).filter(p => p.isCompleted).length;
    const totalTasksCompleted = Object.values(progress).reduce((acc, p) => acc + p.completedTasks.length, 0);
    const progressPercentage = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-3 sm:px-4 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link 
                            href="/" 
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                            <span className="hidden xs:inline">Projets</span>
                            <span className="xs:hidden">Projets</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm text-gray-500">
                            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* ✅ Stats Summary - Mobile Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{completedProjects}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Terminés</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-orange-500">{totalProjects}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Total</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-500">{progressPercentage}%</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Progression</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-500">{totalTasksCompleted}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Tâches</div>
                    </div>
                </div>

                {/* ✅ Search Bar - Only Filter */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
                    <div className="relative">
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

                {/* ✅ Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm">
                        <FolderOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Aucun projet trouvé</p>
                        <p className="text-sm text-gray-400">Essayez une autre recherche</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {filteredProjects.map((project) => (
                            <ProjectCard 
                                key={project.id} 
                                project={project} 
                                progress={progress[project.id]}
                                onToggleTask={toggleTask}
                                onResetProgress={resetProgress}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// ✅ Project Card Component with Progress
function ProjectCard({ 
    project, 
    progress,
    onToggleTask,
    onResetProgress
}: { 
    project: Project; 
    progress?: ProjectProgress;
    onToggleTask: (projectId: string, taskIndex: number) => void;
    onResetProgress: (projectId: string) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const completedTasks = progress?.completedTasks || [];
    const isCompleted = progress?.isCompleted || false;
    const progressPercentage = project.tasks.length > 0 ? Math.round((completedTasks.length / project.tasks.length) * 100) : 0;

    return (
        <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
            isCompleted ? 'border-green-500 border-2' : 'border-gray-100'
        }`}>
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-50">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1.5 sm:p-2 rounded-lg border flex-shrink-0 ${CategoryColors[project.category]}`}>
                            <CategoryIcon category={project.category} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-1.5 truncate">
                                <span className="truncate">{project.title}</span>
                                {isCompleted && (
                                    <span className="text-green-500 flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 fill-green-500 text-white" />
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-orange-500 font-medium">+{project.xp_reward} XP</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0 ml-2">
                        <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {isCompleted ? '✓ Terminé' : `${progressPercentage}%`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="px-3 sm:px-4 pt-2">
                <div className="w-full h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${
                            isCompleted ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Body */}
            <div className="p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{project.description}</p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
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
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[10px] sm:text-xs text-orange-500 hover:text-orange-600 font-medium mt-2 sm:mt-3 flex items-center gap-1"
                >
                    {isExpanded ? 'Masquer les tâches' : 'Voir les tâches'}
                    <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                    <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-1.5">
                        {project.tasks.map((task, index) => {
                            const isTaskCompleted = completedTasks.includes(index);
                            return (
                                <label 
                                    key={index}
                                    className={`flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs cursor-pointer p-1.5 rounded-lg transition ${
                                        isTaskCompleted ? 'bg-green-50' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isTaskCompleted}
                                        onChange={() => onToggleTask(project.id, index)}
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer mt-0.5 flex-shrink-0"
                                    />
                                    <span className={`${isTaskCompleted ? 'line-through text-gray-400' : 'text-gray-600'} flex-1`}>
                                        {task}
                                    </span>
                                    {isTaskCompleted && (
                                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 ml-1" />
                                    )}
                                </label>
                            );
                        })}

                        {/* Reset Progress Button */}
                        {completedTasks.length > 0 && (
                            <button
                                onClick={() => onResetProgress(project.id)}
                                className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-red-400 hover:text-red-600 transition flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Réinitialiser
                            </button>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-50">
                    <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-900 text-white text-[10px] sm:text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                    >
                        <GithubIcon />
                        <span className="hidden xs:inline">GitHub</span>
                    </a>
                    <a
                        href={project.zip_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-orange-500 text-white text-[10px] sm:text-sm font-medium rounded-lg hover:bg-orange-600 transition"
                    >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">ZIP</span>
                    </a>
                    {project.demo_url && (
                        <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-700 text-[10px] sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                        >
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}