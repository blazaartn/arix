'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  ArrowLeft, Play, RefreshCw, Code, Eye, 
  Layout, FileCode, Maximize2, Minimize2,
  Copy, Check, Terminal, AlertCircle,
  Moon, Sun, X, ChevronDown, Save, Trash2,
  Plus, File, FolderOpen, Download, FolderPlus,
  Edit2, MoreVertical, Loader2, Maximize
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { ToastProvider } from '@/contexts/ToastContext';

type FileType = 'html' | 'css' | 'javascript';

interface File {
  id: string;
  name: string;
  type: FileType;
  content: string;
  language: string;
}

interface Project {
  id: string;
  name: string;
  files: File[];
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_FILES: File[] = [
  {
    id: 'html',
    name: 'index.html',
    type: 'html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon Projet</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello World!</h1>
  <script src="script.js"></script>
</body>
</html>`
  },
  {
    id: 'css',
    name: 'style.css',
    type: 'css',
    language: 'css',
    content: `/* Your CSS here */`
  },
  {
    id: 'js',
    name: 'script.js',
    type: 'javascript',
    language: 'javascript',
    content: `// Your JavaScript here`
  }
];

const FILE_ICONS: Record<FileType, any> = {
  html: <FileCode className="w-4 h-4 text-orange-500" />,
  css: <FileCode className="w-4 h-4 text-blue-500" />,
  javascript: <FileCode className="w-4 h-4 text-yellow-500" />
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

function getProjectsFromStorage(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('playground_projects');
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    return [];
  }
  return [];
}

function saveProjectsToStorage(projects: Project[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('playground_projects', JSON.stringify(projects));
  } catch {
    // Ignore
  }
}

function PlaygroundContent() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showDeleteProject, setShowDeleteProject] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = getProjectsFromStorage();
    if (savedProjects.length > 0) {
      setProjects(savedProjects);
      setCurrentProjectId(savedProjects[0].id);
      setActiveTabId(savedProjects[0].files[0]?.id || '');
    } else {
      const defaultProject: Project = {
        id: generateId(),
        name: 'Mon Projet',
        files: DEFAULT_FILES.map(f => ({ ...f, id: f.id })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProjects([defaultProject]);
      setCurrentProjectId(defaultProject.id);
      setActiveTabId(defaultProject.files[0].id);
      saveProjectsToStorage([defaultProject]);
    }
  }, []);

  // Save projects when they change
  useEffect(() => {
    if (projects.length > 0) {
      saveProjectsToStorage(projects);
    }
  }, [projects]);

  // Get current project
  const currentProject = projects.find(p => p.id === currentProjectId);
  const activeFile = currentProject?.files.find(f => f.id === activeTabId) || currentProject?.files[0];

  // Update file content
  const updateFileContent = useCallback((content: string) => {
    if (!currentProject || !activeFile) return;
    
    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        return {
          ...p,
          files: p.files.map(f => 
            f.id === activeFile.id ? { ...f, content } : f
          ),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  }, [currentProject, activeFile, currentProjectId]);

  // SECURE CODE EXECUTION - sanitize before running
  const sanitizeCode = (code: string): string => {
    let sanitized = code;
    // Remove <script> tags with src or content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // Remove event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '');
    // Remove javascript: URLs
    sanitized = sanitized.replace(/javascript:/gi, '');
    // Remove data:text/html
    sanitized = sanitized.replace(/data:text\/html/gi, '');
    // Remove external resource tags
    sanitized = sanitized.replace(/<link\b[^>]*>/gi, '');
    sanitized = sanitized.replace(/<iframe\b[^>]*>/gi, '');
    sanitized = sanitized.replace(/<object\b[^>]*>/gi, '');
    sanitized = sanitized.replace(/<embed\b[^>]*>/gi, '');
    return sanitized;
  };

  // Run code
  const runCode = useCallback(() => {
    if (!currentProject) return;
    
    setIsRunning(true);
    
    const htmlFile = currentProject.files.find(f => f.id === 'html');
    const cssFile = currentProject.files.find(f => f.id === 'css');
    const jsFile = currentProject.files.find(f => f.id === 'javascript');
    
    let htmlContent = htmlFile?.content || '';
    
    // Inject CSS into <style> tag
    if (cssFile && cssFile.content) {
      const styleTag = `<style>/* ${cssFile.name} */\n${cssFile.content}\n</style>`;
      htmlContent = htmlContent.replace(
        /<link[^>]*rel="stylesheet"[^>]*>/gi,
        styleTag
      );
    }
    
    // Wrap JavaScript with console capture and sandboxing
    if (jsFile && jsFile.content) {
      const wrappedJS = `
        (function() {
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          const logs = [];
          
          console.log = function(...args) {
            logs.push({ type: 'log', message: args.map(a => String(a)).join(' ') });
            originalLog.apply(console, args);
          };
          
          console.error = function(...args) {
            logs.push({ type: 'error', message: args.map(a => String(a)).join(' ') });
            originalError.apply(console, args);
          };
          
          console.warn = function(...args) {
            logs.push({ type: 'warn', message: args.map(a => String(a)).join(' ') });
            originalWarn.apply(console, args);
          };
          
          try {
            ${jsFile.content}
          } catch (e) {
            logs.push({ type: 'error', message: e.message });
          }
          
          window.parent.postMessage({ type: 'console', logs }, '*');
        })();
      `;
      
      const scriptTag = `<script>\n${wrappedJS}\n</script>`;
      htmlContent = htmlContent.replace(
        /<script[^>]*src="[^"]*"[^>]*><\/script>/gi,
        ''
      );
      htmlContent = htmlContent.replace('</body>', scriptTag + '</body>');
    }
    
    // Sanitize final HTML
    const sanitizedHtml = sanitizeCode(htmlContent);
    setOutput(sanitizedHtml);
    setIframeKey(prev => prev + 1);  // Force iframe re-render
    setConsoleLogs([]);
    
    setIsRunning(false);
  }, [currentProject]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        const logs = event.data.logs || [];
        setConsoleLogs(prev => [...prev, ...logs.map((l: any) => {
          const emoji = l.type === 'error' ? '❌' : l.type === 'warn' ? '⚠️' : '📝';
          return `${emoji} ${l.message}`;
        })]);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Auto-run on change
  useEffect(() => {
    const timer = setTimeout(() => runCode(), 500);
    return () => clearTimeout(timer);
  }, [currentProject, runCode]);

  // Initial run
  useEffect(() => {
    if (currentProject) {
      runCode();
    }
  }, [currentProject]);

  // Create new project
  const createProject = useCallback(() => {
    if (!newProjectName.trim()) {
      showToast('Entrez un nom de projet', 'warning');
      return;
    }
    
    const newProject: Project = {
      id: generateId(),
      name: newProjectName.trim(),
      files: DEFAULT_FILES.map(f => ({ 
        ...f, 
        id: f.id,
        content: f.id === 'html' ? DEFAULT_FILES[0].content : 
                 f.id === 'css' ? '/* Your CSS here */' : 
                 '// Your JavaScript here'
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    setActiveTabId(newProject.files[0].id);
    setNewProjectName('');
    setShowNewProjectModal(false);
    showToast(`✅ Projet "${newProjectName}" créé`, 'success');
  }, [newProjectName, showToast]);

  // Delete project
  const deleteProject = useCallback((projectId: string) => {
    if (projects.length <= 1) {
      showToast('❌ Impossible de supprimer le dernier projet', 'error');
      setShowDeleteProject(null);
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    if (currentProjectId === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      if (remaining.length > 0) {
        setCurrentProjectId(remaining[0].id);
        setActiveTabId(remaining[0].files[0]?.id || '');
      }
    }
    
    setShowDeleteProject(null);
    showToast(`🗑️ Projet "${project?.name}" supprimé`, 'info');
  }, [projects, currentProjectId, showToast]);

  // Add file to project
  const addFile = useCallback((type: FileType) => {
    if (!currentProject) return;
    
    const nameMap: Record<FileType, string> = {
      html: 'index.html',
      css: 'style.css',
      javascript: 'script.js'
    };
    
    const contentMap: Record<FileType, string> = {
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello!</h1>\n</body>\n</html>',
      css: '/* Your styles here */',
      javascript: '// Your JavaScript here'
    };
    
    const existing = currentProject.files.find(f => f.type === type);
    if (existing) {
      showToast(`❌ ${nameMap[type]} existe déjà`, 'warning');
      return;
    }
    
    const newFile: File = {
      id: `${type}_${generateId()}`,
      name: nameMap[type],
      type,
      language: type,
      content: contentMap[type]
    };
    
    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        return {
          ...p,
          files: [...p.files, newFile],
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
    
    setActiveTabId(newFile.id);
    showToast(`✅ ${newFile.name} ajouté`, 'success');
  }, [currentProject, currentProjectId, showToast]);

  // Delete file
  const deleteFile = useCallback((fileId: string) => {
    if (!currentProject || currentProject.files.length <= 1) {
      showToast('❌ Impossible de supprimer le dernier fichier', 'error');
      return;
    }
    
    const file = currentProject.files.find(f => f.id === fileId);
    
    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        return {
          ...p,
          files: p.files.filter(f => f.id !== fileId),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
    
    if (activeTabId === fileId) {
      const remaining = currentProject.files.filter(f => f.id !== fileId);
      setActiveTabId(remaining[0]?.id || '');
    }
    
    showToast(`🗑️ ${file?.name} supprimé`, 'info');
  }, [currentProject, currentProjectId, activeTabId, showToast]);

  // Copy code
  const copyCode = useCallback(async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      showToast('📋 Code copié!', 'success');
    } catch {
      showToast('❌ Erreur', 'error');
    }
  }, [activeFile, showToast]);

  // Download file
  const downloadFile = useCallback(() => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`📥 ${activeFile.name} téléchargé`, 'success');
  }, [activeFile, showToast]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Toggle preview fullscreen (mobile)
  const togglePreviewFullscreen = useCallback(() => {
    setIsPreviewFullscreen(!isPreviewFullscreen);
  }, [isPreviewFullscreen]);

  // ✅ Manual toggle for preview mode (called by button)
  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        downloadFile();
      }
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
      if (e.key === 'Escape' && isPreviewFullscreen) {
        setIsPreviewFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [runCode, downloadFile, isFullscreen, isPreviewFullscreen, toggleFullscreen]);

  // Tab key support
  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      updateFileContent(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // If not logged in
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <Code className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connectez-vous</h2>
          <p className="text-gray-400 mb-6">Connectez-vous pour accéder au playground</p>
          <Link 
            href="/auth/signin" 
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  // Mobile Preview Fullscreen
  if (isPreviewFullscreen) {
    return (
      <div className="fixed inset-0 z-[400] bg-white flex flex-col">
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
          <span className="text-white font-medium text-sm">Aperçu</span>
          <button
            onClick={() => setIsPreviewFullscreen(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <iframe
          key={`preview-full-${iframeKey}`}
          srcDoc={output}
          sandbox="allow-scripts allow-modals allow-downloads"
          className="flex-1 w-full bg-white border-none"
          title="Fullscreen Preview"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" className="p-1.5 hover:bg-gray-700 rounded-lg transition flex-shrink-0">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </Link>
          <h1 className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
            <Code className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="hidden xs:inline">Playground</span>
          </h1>
          
          <div className="relative ml-1 sm:ml-2">
            <select
              value={currentProjectId || ''}
              onChange={(e) => {
                const id = e.target.value;
                const project = projects.find(p => p.id === id);
                if (project) {
                  setCurrentProjectId(id);
                  setActiveTabId(project.files[0]?.id || '');
                }
              }}
              className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs sm:text-sm text-white max-w-[100px] sm:max-w-[150px] truncate focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="p-1 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white flex-shrink-0"
            title="Nouveau projet"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <button 
            onClick={() => {
              const types: FileType[] = ['html', 'css', 'javascript'];
              const existing = currentProject.files.map(f => f.type);
              const available = types.filter(t => !existing.includes(t));
              if (available.length > 0) {
                addFile(available[0]);
              } else {
                showToast('❌ Tous les types existent déjà', 'warning');
              }
            }}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
            title="Ajouter un fichier"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button 
            onClick={copyCode}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
            title="Copier le code"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button 
            onClick={downloadFile}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
            title="Télécharger"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setShowDeleteProject(currentProjectId)}
            className="p-1.5 hover:bg-red-500/20 rounded-lg transition text-gray-400 hover:text-red-400"
            title="Supprimer le projet"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
            title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition text-xs sm:text-sm font-medium"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Run</span>
          </button>
        </div>
      </header>
      
      {/* Main layout: always flex on desktop, stacked on mobile */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Editor section: visible on desktop always; on mobile only when not in preview mode */}
        <div className={`flex-1 flex flex-col min-h-0 ${isPreviewMode ? 'hidden lg:flex' : ''}`}>
          {/* Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto scrollbar-hide">
            {currentProject.files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 border-b-2 transition cursor-pointer whitespace-nowrap text-xs sm:text-sm ${
                  activeTabId === file.id
                    ? 'border-orange-500 text-white bg-gray-700/50'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
                onClick={() => setActiveTabId(file.id)}
              >
                {FILE_ICONS[file.type]}
                <span className="truncate max-w-[60px] sm:max-w-[100px]">{file.name}</span>
                {currentProject.files.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                    className="text-gray-500 hover:text-red-400 transition p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Editor area */}
          <div className="flex-1 relative min-h-[300px] sm:min-h-[400px] lg:min-h-0">
            <textarea
              ref={textareaRef}
              value={activeFile?.content || ''}
              onChange={(e) => updateFileContent(e.target.value)}
              onKeyDown={handleTabKey}
              className={`w-full h-full p-3 sm:p-4 font-mono text-xs sm:text-sm resize-none outline-none ${
                isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'
              }`}
              style={{ fontSize: `${fontSize}px`, tabSize: 2, minHeight: '300px' }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <div className="absolute bottom-2 right-3 text-[10px] text-gray-500 bg-gray-800/80 px-2 py-1 rounded">
              {activeFile?.name || ''} • {activeFile?.content?.split('\n').length || 0} lignes
            </div>
          </div>
          
          {/* Console toggle */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs border-t border-gray-700 transition ${
              showConsole ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Console {consoleLogs.length > 0 && `(${consoleLogs.length})`}
            <ChevronDown className={`w-3 h-3 transition-transform ${showConsole ? 'rotate-180' : ''}`} />
          </button>
          
          {showConsole && (
            <div className="bg-gray-900 border-t border-gray-700 max-h-[120px] sm:max-h-[150px] overflow-y-auto p-2 sm:p-3 font-mono text-xs">
              {consoleLogs.length === 0 ? (
                <span className="text-gray-500">// Console prête</span>
              ) : (
                consoleLogs.map((log, i) => (
                  <div key={i} className={`py-0.5 ${
                    log.includes('❌') || log.includes('error') ? 'text-red-400' :
                    log.includes('⚠️') ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {log}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* Preview section: visible on desktop always; on mobile only when in preview mode */}
        <div className={`flex-1 lg:flex-1 bg-white min-h-[250px] sm:min-h-[300px] lg:min-h-0 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-700 ${
          isPreviewMode ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="bg-gray-800 border-b border-gray-700 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Aperçu</span>
            </div>
            <div className="flex items-center gap-2">
              {/* ✅ Manual toggle button – always visible on mobile */}
              <button
                onClick={togglePreviewMode}
                className="lg:hidden text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded bg-gray-700"
              >
                {isPreviewMode ? '📝 Éditeur' : '👁️ Aperçu'}
              </button>
              <button
                onClick={togglePreviewFullscreen}
                className="p-1 hover:bg-gray-700 rounded transition text-gray-400 hover:text-white"
                title="Plein écran"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (iframeRef.current) {
                    iframeRef.current.src = iframeRef.current.src;
                  }
                }}
                className="p-1 hover:bg-gray-700 rounded transition text-gray-400 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <iframe
            key={`preview-${iframeKey}`}
            ref={iframeRef}
            srcDoc={output}
            sandbox="allow-scripts allow-modals allow-downloads"
            className="flex-1 w-full bg-white border-none"
            title="Code Preview"
            loading="lazy"
          />
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 px-3 py-1.5 text-[10px] text-gray-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span>⌘+Enter</span>
          <span>Run</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">⌘+S</span>
          <span className="hidden sm:inline">Download</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFontSize(Math.max(10, fontSize - 2))}
            className="hover:text-white transition"
          >
            A-
          </button>
          <span className="text-xs">{fontSize}px</span>
          <button 
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            className="hover:text-white transition"
          >
            A+
          </button>
        </div>
      </div>
      
      {/* Modals */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowNewProjectModal(false)}>
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Nouveau Projet</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nom du projet..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') createProject(); }}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={createProject}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Créer
              </button>
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  setNewProjectName('');
                }}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteProject && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowDeleteProject(null)}>
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Supprimer le projet</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => deleteProject(showDeleteProject)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteProject(null)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CodePlaygroundPage() {
  return (
    <ToastProvider>
      <PlaygroundContent />
    </ToastProvider>
  );
}