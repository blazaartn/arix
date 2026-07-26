'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    BookOpen, LogOut, User, ChevronRight,
    MessageCircle, Award,
    Clock, Heart, Share2, Eye, Home, Plus, Bell, Send, Loader2, Code,
    Briefcase, CheckSquare, Settings, X, Sparkles, Calendar, Users as UsersIcon,
    TrendingUp, Trophy, Zap, Star, Gift, Rocket, Coffee,
    CheckCircle, Search, Menu, ListChecks, CalendarDays
} from 'lucide-react';
import { QuestionModal } from '@/components/QuestionModal';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import DOMPurify from 'dompurify';

interface Image {
    id: string;
    image_url: string;
    caption: string;
    is_primary: boolean;
}

interface Question {
    id: string;
    title: string;
    content: string;
    user_id: string;
    subject_name: string;
    author_name: string;
    author_avatar: string;
    author_role: string;
    view_count: number;
    created_at: string;
    comments_count: number;
    like_count: number;
    images_count: number;
    image?: Image;
    code_content?: string;
    code_language?: string;
}

// ✅ User type for ranking
interface UserRank {
    id: string;
    name: string;
    avatar_url: string;
    xp_points: number;
    level: number;
    role: string;
}

// ✅ Todo type - matches database
interface Todo {
    id: string;
    user_id: string;
    text: string;
    completed: boolean;
    due_date?: string;
    created_at: string;
    updated_at: string;
}

// ✅ Project type for sidebar
interface SidebarProject {
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    category: string;
}

function formatNumber(num: number): string {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function QuestionSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                <div className="h-5 bg-gray-200 rounded w-12"></div>
                <div className="h-5 bg-gray-200 rounded w-12"></div>
                <div className="h-5 bg-gray-200 rounded w-12"></div>
            </div>
        </div>
    );
}

// ✅ Sidebar Skeleton
function SidebarSkeleton() {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
                <div className="space-y-3">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
                <div className="space-y-3">
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-28 mb-3"></div>
                <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-36 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}

// ✅ HTML Preview Modal - FIXED: Proper CSS rendering
function HtmlPreviewModal({ html, isOpen, onClose }: { html: string; isOpen: boolean; onClose: () => void }) {
    const [sanitizedHtml, setSanitizedHtml] = useState('');
    useEffect(() => {
        if (html && isOpen) {
            const clean = DOMPurify.sanitize(html, {
                ALLOWED_TAGS: [
                    'a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio',
                    'b', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas',
                    'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist',
                    'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em',
                    'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form',
                    'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
                    'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label',
                    'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter',
                    'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output',
                    'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp',
                    'section', 'select', 'small', 'source', 'span', 'strike', 'strong',
                    'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'textarea',
                    'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul',
                    'var', 'video', 'wbr'
                ],
                ALLOWED_ATTR: [
                    'accept', 'action', 'align', 'alt', 'autocomplete', 'autofocus', 'autoplay',
                    'background', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'checked',
                    'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'coords',
                    'data', 'datetime', 'default', 'dir', 'disabled', 'download', 'enctype',
                    'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang',
                    'id', 'ismap', 'label', 'lang', 'list', 'loop', 'low', 'max', 'maxlength',
                    'media', 'method', 'min', 'multiple', 'name', 'noshade', 'novalidate',
                    'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload',
                    'readonly', 'rel', 'required', 'rev', 'reversed', 'rows', 'rowspan',
                    'sandbox', 'scope', 'selected', 'shape', 'size', 'sizes', 'span',
                    'srclang', 'start', 'step', 'style', 'summary', 'tabindex', 'target',
                    'title', 'type', 'usemap', 'valign', 'value', 'width', 'wrap'
                ],
                ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
            });
            setSanitizedHtml(clean);
        }
    }, [html, isOpen]);
    if (!isOpen || !html) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black/50 rounded-full p-2">
                <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                        <span className="text-sm text-gray-500 ml-2">Aperçu HTML</span>
                    </div>
                    <span className="text-xs text-gray-400">Code sécurisé</span>
                </div>
                <div className="flex-1 overflow-auto p-6 bg-white">
                    {/* ✅ FIX: Use iframe with srcdoc for proper CSS rendering */}
                    <iframe
                        srcDoc={sanitizedHtml}
                        sandbox="allow-scripts allow-modals allow-same-origin"
                        className="w-full h-full border-0"
                        title="HTML Preview"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
}

// ✅ Fullscreen Code Viewer
function FullscreenCodeViewer({ code, language, isOpen, onClose }: { code: string; language: string; isOpen: boolean; onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (!isOpen || !code) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black/50 rounded-full p-2">
                <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-4xl max-h-[85vh] bg-gray-900 rounded-xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
                    <span className="text-sm text-gray-300 font-mono">{language || 'code'}</span>
                    <button onClick={handleCopy} className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm">
                        {copied ? <span className="text-green-400">✓ Copié</span> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copier</>}
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap break-words"><code>{code}</code></pre>
                </div>
            </div>
        </div>
    );
}

// ✅ Code Block
function CodeBlock({ code, language }: { code: string; language: string }) {
    const [copied, setCopied] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const isHtml = language === 'html' || language === 'HTML' || language === 'htm';
    const MAX_LINES = 20, MAX_CHARS = 2000, FULLSCREEN_LINES = 50, FULLSCREEN_CHARS = 5000;
    const lines = code.split('\n');
    const totalLines = lines.length;
    const totalChars = code.length;
    const isTooLong = totalLines > MAX_LINES || totalChars > MAX_CHARS;
    const needsFullscreen = totalLines > FULLSCREEN_LINES || totalChars > FULLSCREEN_CHARS;
    const truncatedLines = lines.slice(0, MAX_LINES);
    const truncatedCode = truncatedLines.join('\n');
    const handleCopy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (!code) return null;
    return (
        <>
            <div className="relative my-2 rounded-lg overflow-hidden border border-gray-200">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 text-xs">
                    <div className="flex items-center gap-3">
                        <span className="font-mono">{language || 'code'}</span>
                        {isTooLong && <span className="text-yellow-400 text-[10px] bg-yellow-400/20 px-2 py-0.5 rounded">{totalLines} lignes</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        {isHtml && <button onClick={() => setShowPreview(true)} className="flex items-center gap-1 hover:text-white transition px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>Aperçu</button>}
                        <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white transition">{copied ? <span className="text-green-400">✓ Copié</span> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copier</>}</button>
                        {needsFullscreen && <button onClick={() => setShowFullscreen(true)} className="flex items-center gap-1 hover:text-white transition px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>Plein écran</button>}
                    </div>
                </div>
                <div className="relative">
                    <div className={`p-4 bg-gray-900 overflow-x-auto ${isTooLong ? 'max-h-64' : ''}`}>
                        <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap break-words"><code>{isTooLong ? truncatedCode : code}</code></pre>
                    </div>
                    {isTooLong && (
                        <>
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pointer-events-none"></div>
                            <button onClick={() => setShowFullscreen(true)} className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition shadow-lg">Voir tout le code ({totalLines} lignes)</button>
                        </>
                    )}
                </div>
            </div>
            {isHtml && <HtmlPreviewModal html={code} isOpen={showPreview} onClose={() => setShowPreview(false)} />}
            {needsFullscreen && <FullscreenCodeViewer code={code} language={language} isOpen={showFullscreen} onClose={() => setShowFullscreen(false)} />}
        </>
    );
}

// ✅ Image Viewer
function ImageViewer({ imageUrl, isOpen, onClose }: { imageUrl: string | null; isOpen: boolean; onClose: () => void }) {
    if (!isOpen || !imageUrl) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10">
                <X className="w-8 h-8" />
            </button>
            <img src={imageUrl} alt="Full screen" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
    );
}

// ✅ Pagination Controls
function PaginationControls({ currentPage, totalPages, onPageChange, isLoading }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void; isLoading: boolean }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-2 py-4">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1 || isLoading} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Précédent
            </button>
            <span className="text-sm text-gray-600">Page {currentPage} sur {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages || isLoading} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Suivant
            </button>
        </div>
    );
}

// ✅ Menu Drawer
function MenuDrawer({ isOpen, onClose, session, onLogout }: { isOpen: boolean; onClose: () => void; session: any; onLogout: () => void }) {
    const router = useRouter();
    if (!isOpen) return null;
    const menuItems = [
        { icon: User, label: 'Profil', href: '/profile' },
        { icon: Code, label: 'Code Playground', href: '/playground' },
        { icon: Briefcase, label: 'Projets', href: '/projects' },
        { icon: CheckSquare, label: 'Todos', href: '/todos' },
        { icon: Trophy, label: 'Classement', href: '/ranking' },
        { icon: Settings, label: 'Paramètres', href: '/settings' },
    ];
    return (
        <>
            <div className={`fixed inset-0 z-[200] bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
            <div className={`fixed top-0 right-0 z-[201] h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={session?.user?.avatar_url || '/default-avatar.png'} alt={session?.user?.name} className="w-12 h-12 rounded-full border-2 border-orange-500/30 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }} />
                            <div>
                                <p className="font-semibold text-gray-900">{session?.user?.name}</p>
                                <p className="text-xs text-gray-500">{session?.user?.email}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-orange-500 font-medium">★ Niv. {session?.user?.level || 1}</span>
                                    <span className="text-xs text-gray-300">•</span>
                                    <span className="text-xs text-gray-400">{formatNumber(session?.user?.xp_points || 0)} XP</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5 text-gray-500" /></button>
                    </div>
                </div>
                <div className="p-3 space-y-1">
                    {menuItems.map((item) => (
                        <button key={item.label} onClick={() => { onClose(); router.push(item.href); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition group">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-500 transition">
                                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
                        </button>
                    ))}
                    <div className="border-t border-gray-100 my-2"></div>
                    {session && (
                        <button onClick={() => { onClose(); onLogout(); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 transition group">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition">
                                <LogOut className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="text-sm font-medium text-red-600 group-hover:text-red-700">Déconnexion</span>
                        </button>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">bacplus v1.0 • {new Date().getFullYear()}</p>
                </div>
            </div>
        </>
    );
}

export default function HomePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ✅ Sidebar states
    const [topUsers, setTopUsers] = useState<UserRank[]>([]);
    const [loadingTopUsers, setLoadingTopUsers] = useState(true);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loadingTodos, setLoadingTodos] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    // ✅ Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const limit = 10;

    // ✅ Search
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // ✅ Image viewer
    const [viewerImage, setViewerImage] = useState<string | null>(null);

    // ✅ Sidebar projects
    const sidebarProjects: SidebarProject[] = [
        { id: '1', title: 'Emploi du Temps - HTML', description: 'Créez un planning interactif', xp_reward: 30, category: 'html' },
        { id: '2', title: 'Restaurant App - HTML/CSS', description: 'Complétez le code CSS', xp_reward: 25, category: 'css' },
        { id: '3', title: 'JS Functions - 3 Exercices', description: 'Implémentez des fonctions', xp_reward: 40, category: 'javascript' },
    ];

    // ✅ Coming events
    const comingEvents = [
        { id: '1', title: 'Réunion globale bacplus', date: '07/10/2026 à 20:00', description: 'Explication de tout !' },
    ];

    // ✅ Fetch unread notifications count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!session) return;
            try {
                const res = await fetch('/api/notifications?unread=true&limit=1');
                const data = await res.json();
                if (data.success) {
                    setUnreadCount(data.unreadCount || 0);
                }
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };
        fetchUnreadCount();
    }, [session]);

    // ✅ Fetch todos from API
    useEffect(() => {
        const fetchTodos = async () => {
            if (!session) {
                setLoadingTodos(false);
                return;
            }
            
            try {
                const res = await fetch('/api/todos?limit=5&filter=active');
                const data = await res.json();
                if (data.success) {
                    setTodos(data.todos || []);
                } else {
                    setTodos([]);
                }
            } catch (error) {
                console.error('Error fetching todos:', error);
                setTodos([]);
            } finally {
                setLoadingTodos(false);
            }
        };
        
        fetchTodos();
    }, [session]);

    // ✅ Fetch top users from API
    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const res = await fetch('/api/ranking?limit=3');
                const data = await res.json();
                if (data.success) {
                    setTopUsers(data.users || []);
                }
            } catch (error) {
                console.error('Error fetching top users:', error);
            } finally {
                setLoadingTopUsers(false);
            }
        };
        fetchTopUsers();
    }, []);

    // ✅ Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // ✅ Fetch questions
    const fetchQuestions = async (page: number = 1, search: string = '') => {
        setLoading(true);
        setIsSearching(true);
        try {
            const offset = (page - 1) * limit;
            const url = `/api/questions?limit=${limit}&offset=${offset}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setQuestions(data.questions || []);
                if (data.questions?.length < limit) setTotalPages(page);
                else setTotalPages(page + 1);
                setCurrentPage(page);
            } else {
                setQuestions([]);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            setQuestions([]);
        } finally {
            setLoading(false);
            setIsSearching(false);
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions(1, debouncedSearch);
    }, [debouncedSearch]);

    useEffect(() => {
        fetchQuestions(1, '');
    }, []);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && !isPageLoading) {
            setIsPageLoading(true);
            fetchQuestions(page, debouncedSearch);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">
                            <span className="text-gray-900">bac</span>
                            <span className="text-orange-500">plus</span>
                        </h1>
                    </div>

                    <div className="flex-1 max-w-xs mx-3 relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher une question..." className="w-full pl-9 pr-9 py-1.5 text-sm bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition" />
                            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
                            {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="w-4 h-4 animate-spin text-orange-500" /></div>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/notifications')} className="relative p-2 hover:bg-gray-100 rounded-full transition">
                            <Bell className="w-5 h-5 text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                        {session ? (
                            <div className="flex items-center gap-2">
                                <div className="relative hidden sm:block">
                                    <img src={session.user.avatar_url || '/default-avatar.png'} alt={session.user.name} className="w-9 h-9 rounded-full border-2 border-orange-500/30 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }} />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => signIn('google', { callbackUrl: '/' })} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
                                <span>Connexion</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content - Full Width with Sidebar */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex gap-6">
                    {/* ✅ LEFT SIDEBAR - 28% */}
                    <aside className="hidden lg:block w-[28%] flex-shrink-0 space-y-4">
                        {/* Guest Banner or XP Bar (small version) */}
                        {!session && (
                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                                <p className="text-xs text-gray-600">👋 Connectez-vous pour interagir</p>
                            </div>
                        )}

                        {loading || loadingTopUsers || loadingTodos ? (
                            <SidebarSkeleton />
                        ) : (
                            <>

                                {/* TODOS - Top Priority with Checkbox */}
                                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <ListChecks className="w-4 h-4 text-blue-500" />
                                            <h3 className="text-sm font-bold text-gray-800">📋 Mes Todos</h3>
                                        </div>
                                        <Link href="/todos" className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                                            Voir tout →
                                        </Link>
                                    </div>

                                    {loadingTodos ? (
                                        <div className="space-y-2">
                                            <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                                            <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                                            <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                                        </div>
                                    ) : todos.length === 0 ? (
                                        <div className="text-center py-4">
                                            <p className="text-xs text-gray-400">Aucune tâche en cours</p>
                                            <Link href="/todos" className="text-xs text-blue-500 hover:text-blue-600 mt-1 inline-block">
                                                Ajouter une tâche
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {todos.slice(0, 5).map((todo) => (
                                                <div key={todo.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                                        {todo.completed && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <span className={`text-xs flex-1 truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                        {todo.text}
                                                    </span>
                                                    {todo.due_date && (
                                                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                                                            {new Date(todo.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* MEETINGS */}
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-purple-500" />
                                        <h3 className="text-sm font-semibold text-gray-800">📅 À venir</h3>
                                    </div>
                                    {comingEvents.map((event) => (
                                        <div key={event.id} className="p-2 bg-white/60 rounded-lg border border-purple-100">
                                            <p className="text-sm font-medium text-gray-800">{event.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="w-3 h-3 text-purple-400" />
                                                <span className="text-xs text-purple-600 font-medium">{event.date}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* PROJECTS */}
                                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Rocket className="w-4 h-4 text-orange-500 animate-pulse" />
                                        <h3 className="text-sm font-semibold text-gray-800">🚀 Nouveaux Projets</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {sidebarProjects.map((project, index) => (
                                            <Link
                                                key={project.id}
                                                href={`/projects`}
                                                className={`block p-3 rounded-lg border border-gray-100 hover:border-orange-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${index === 0 ? 'animate-pulse-shadow' : ''
                                                    }`}
                                                style={{ animationDelay: `${index * 0.15}s` }}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 truncate">{project.title}</p>
                                                        <p className="text-xs text-gray-500 truncate">{project.description}</p>
                                                    </div>
                                                    <span className="text-xs text-orange-500 font-medium flex-shrink-0 ml-2">+{project.xp_reward} XP</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link href="/projects" className="mt-3 text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
                                        Voir tous les projets →
                                    </Link>
                                </div>

                                {/* RANKING */}
                                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                        <h3 className="text-sm font-semibold text-gray-800">🏆 Top 3 Étudiants</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {topUsers.map((user, index) => (
                                            <div
                                                key={user.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg border ${index === 0 ? 'border-yellow-300 bg-yellow-50/50' :
                                                        index === 1 ? 'border-gray-300 bg-gray-50/50' :
                                                            'border-orange-200 bg-orange-50/50'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-400 text-white' :
                                                        index === 1 ? 'bg-gray-400 text-white' :
                                                            'bg-orange-400 text-white'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <img
                                                    src={user.avatar_url || '/default-avatar.png'}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-400">Niv. {user.level}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-orange-400" />
                                                    <span className="text-xs font-bold text-orange-500">{formatNumber(user.xp_points)} XP</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/ranking" className="mt-3 text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
                                        Voir le classement complet →
                                    </Link>
                                </div>


                            </>
                        )}
                    </aside>

                    {/* ✅ RIGHT CONTENT - 72% */}
                    <main className="flex-1 min-w-0">
                        {/* Guest Banner (mobile only) */}
                        {!loading && !session && (
                            <div className="lg:hidden bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4 text-center">
                                <p className="text-xs text-gray-600">👋 Connectez-vous pour interagir</p>
                            </div>
                        )}

                        {/* XP Bar - Full width on mobile, hidden on desktop (in sidebar) */}
                        {loading ? (
                            <div className="lg:hidden">
                                <div className="bg-white border border-gray-100 rounded-xl p-3 mb-4 shadow-sm animate-pulse">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3.5 h-3.5 bg-gray-200 rounded"></div>
                                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                        ) : session && (
                            <div className="lg:hidden">
                                <div className="bg-white border border-gray-100 rounded-xl p-3 mb-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <Award className="w-3.5 h-3.5 text-orange-500" />
                                            <span className="text-xs font-medium text-gray-700">Niv. {session.user.level || 1}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">{formatNumber(session.user.xp_points || 0)} XP</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-700" style={{ width: `${Math.min(((session.user.xp_points || 0) % 100), 100)}%` }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Questions Feed */}
                        <div className="space-y-4">
                            {loading ? (
                                <>
                                    <QuestionSkeleton />
                                    <QuestionSkeleton />
                                    <QuestionSkeleton />
                                </>
                            ) : questions.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                                    <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">
                                        {searchQuery ? 'Aucun résultat pour cette recherche' : 'Aucune question pour le moment'}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {searchQuery ? 'Essayez une autre recherche' : 'Soyez le premier à poser une question !'}
                                    </p>
                                </div>
                            ) : (
                                questions.map((q) => (
                                    <QuestionCard
                                        key={q.id}
                                        question={q}
                                        isLoggedIn={!!session}
                                        currentUserId={session?.user?.id}
                                        onRefresh={() => fetchQuestions(currentPage, debouncedSearch)}
                                        onImageClick={(url) => setViewerImage(url)}
                                    />
                                ))
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {!loading && questions.length > 0 && (
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                isLoading={isPageLoading}
                            />
                        )}
                    </main>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-2 py-1 flex justify-around items-center shadow-lg">
                <Link href="/" className="flex flex-col items-center py-1 px-3 text-orange-500 transition">
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-0.5">Accueil</span>
                </Link>
                <Link href="/series" className="flex flex-col items-center py-1 px-3 text-gray-400 hover:text-orange-500 transition">
                    <BookOpen className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-0.5">Séries</span>
                </Link>
                <button onClick={() => setIsQuestionModalOpen(true)} className="relative -mt-4 flex flex-col items-center transition-transform hover:scale-110">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300">
                        <Plus className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[10px] font-medium text-orange-500 mt-0.5">Nouveau</span>
                </button>
                <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center py-1 px-3 text-gray-400 hover:text-orange-500 transition">
                    <Menu className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-0.5">Menu</span>
                </button>
            </nav>

            {/* Modals */}
            <QuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} onQuestionCreated={() => fetchQuestions(1, debouncedSearch)} />
            <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} session={session} onLogout={handleLogout} />
            <ImageViewer imageUrl={viewerImage} isOpen={!!viewerImage} onClose={() => setViewerImage(null)} />
        </div>
    );
}

// ============================================
// Question Card Component
// ============================================
function QuestionCard({ question, isLoggedIn, currentUserId, onRefresh, onImageClick }: { question: Question; isLoggedIn: boolean; currentUserId?: string; onRefresh: () => void; onImageClick: (url: string) => void }) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(question.like_count || 0);
    const [isLiking, setIsLiking] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

    useEffect(() => {
        const fetchLikeData = async () => {
            try {
                const res = await fetch(`/api/likes?questionId=${question.id}`);
                const data = await res.json();
                setLikesCount(data.count || 0);
                setLiked(data.liked || false);
            } catch {
                setLikesCount(0);
                setLiked(false);
            }
        };
        fetchLikeData();
    }, [question.id]);

    useEffect(() => {
        if (showComments) fetchComments();
    }, [showComments]);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const res = await fetch(`/api/comments?questionId=${question.id}`);
            const data = await res.json();
            setComments(data.comments || []);
        } catch {
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleLike = async () => {
        if (!isLoggedIn || isLiking) return;
        setIsLiking(true);
        try {
            const res = await fetch('/api/likes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId: question.id }) });
            const data = await res.json();
            setLiked(data.liked);
            setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
        } catch { }
        setIsLiking(false);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !isLoggedIn) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId: question.id, content: newComment.trim() }) });
            const data = await res.json();
            if (data.success) {
                setNewComment('');
                fetchComments();
                onRefresh();
            }
        } catch { }
        setSubmitting(false);
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Supprimer ce commentaire ?')) return;
        setDeletingCommentId(commentId);
        try {
            const res = await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) { fetchComments(); onRefresh(); }
            else alert(data.error || 'Erreur');
        } catch { alert('Erreur'); }
        finally { setDeletingCommentId(null); }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="flex items-center gap-3 p-4 pb-2">
                <img src={question.author_avatar || '/default-avatar.png'} alt={question.author_name} className="w-10 h-10 rounded-full border-2 border-orange-500/20 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }} />
                <div>
                    <p className="font-medium text-gray-900 text-sm flex items-center gap-1.5">
                        {question.author_name || 'Anonyme'}
                        <VerifiedBadge role={question.author_role || 'student'} size="sm" />
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{question.subject_name || 'Sans matière'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(question.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-3">
                <h3 className="font-semibold text-gray-900 text-base mb-1.5 line-clamp-2">{question.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{question.content}</p>
            </div>

            {question.code_content && (
                <div className="px-4 pb-2">
                    <CodeBlock code={question.code_content} language={question.code_language || 'javascript'} />
                </div>
            )}

            {question.image && (
                <div className="px-4 pb-2 cursor-pointer" onClick={() => onImageClick(question.image!.image_url)}>
                    <img src={question.image.image_url} alt="Image" className="rounded-xl w-full h-48 object-cover hover:opacity-90 transition" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
            )}

            <div className="px-4 pb-3">
                <Link href={`/questions/${question.id}`} className="inline-block text-sm font-medium text-orange-500 hover:text-orange-600 transition group">
                    <span className="flex items-center gap-1">Voir plus → <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
                </Link>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-50">
                <button onClick={handleLike} disabled={isLiking} className={`flex items-center gap-1 text-sm transition ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} ${isLiking ? 'opacity-50' : ''}`}>
                    {isLiking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />}
                    <span>{formatNumber(likesCount)}</span>
                </button>
                <button onClick={() => { if (!isLoggedIn) return; setShowComments(!showComments); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition">
                    <MessageCircle className="w-4 h-4" /><span>{formatNumber(question.comments_count || 0)}</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition"><Share2 className="w-4 h-4" /></button>
                {!isLoggedIn && <button onClick={() => signIn('google', { callbackUrl: '/' })} className="text-xs text-orange-500 hover:text-orange-600 font-medium ml-auto">Connectez-vous</button>}
            </div>

            {showComments && isLoggedIn && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
                        {loadingComments ? (
                            <div className="text-center py-2"><Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-500" /></div>
                        ) : comments.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-2">Aucun commentaire</p>
                        ) : (
                            comments.map((c) => (
                                <div key={c.id} className="flex gap-2 group">
                                    <img src={c.author_avatar || '/default-avatar.png'} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                                    <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 relative">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-medium text-gray-800">{c.author_name}</p>
                                            {currentUserId === c.user_id && (
                                                <button onClick={() => handleDeleteComment(c.id)} disabled={deletingCommentId === c.id} className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 disabled:opacity-50 flex items-center gap-1" title="Supprimer">
                                                    {deletingCommentId === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{c.content}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Écrire un commentaire..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        <button type="submit" disabled={submitting || !newComment.trim()} className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center min-w-[40px]">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            )}

            {showComments && !isLoggedIn && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500 mb-2">Connectez-vous pour voir les commentaires</p>
                        <button onClick={() => signIn('google', { callbackUrl: '/' })} className="px-4 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition">Se connecter</button>
                    </div>
                </div>
            )}
        </div>
    );
}