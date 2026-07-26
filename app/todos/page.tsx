'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, Plus, X, CheckCircle, Circle, 
    Trash2, Edit2, Calendar, Clock, AlertCircle,
    CheckSquare, Search, Loader2
} from 'lucide-react';

// ✅ Todo Type Definition
interface Todo {
    id: string;
    user_id: string;
    text: string;
    completed: boolean;
    due_date?: string;
    created_at: string;
    updated_at: string;
}

export default function TodosPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [newTodoText, setNewTodoText] = useState('');
    const [newTodoDueDate, setNewTodoDueDate] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [editingDueDate, setEditingDueDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // ✅ Redirect if not logged in
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    // ✅ Fetch todos from API
    const fetchTodos = async () => {
        if (!session) return;
        
        setIsLoading(true);
        try {
            const url = `/api/todos?filter=${filter}&search=${encodeURIComponent(searchQuery)}`;
            const res = await fetch(url);
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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchTodos();
        }
    }, [session, filter, searchQuery]);

    // ✅ Stats
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const activeTodos = totalTodos - completedTodos;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    // ✅ Add todo
    const addTodo = async () => {
        if (!newTodoText.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: newTodoText.trim(),
                    dueDate: newTodoDueDate || null
                })
            });

            const data = await res.json();
            
            if (data.success) {
                setTodos([data.todo, ...todos]);
                setNewTodoText('');
                setNewTodoDueDate('');
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ Toggle todo completion
    const toggleTodo = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const res = await fetch('/api/todos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    completed: !todo.completed
                })
            });

            const data = await res.json();
            
            if (data.success) {
                setTodos(todos.map(t => 
                    t.id === id ? { ...t, completed: !t.completed } : t
                ));
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    };

    // ✅ Delete todo
    const deleteTodo = async (id: string) => {
        if (!confirm('Supprimer cette tâche ?')) return;

        try {
            const res = await fetch(`/api/todos?id=${id}`, {
                method: 'DELETE'
            });

            const data = await res.json();
            
            if (data.success) {
                setTodos(todos.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    // ✅ Save editing
    const saveEditing = async (id: string) => {
        if (!editingText.trim()) return;

        try {
            const res = await fetch('/api/todos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    text: editingText.trim(),
                    dueDate: editingDueDate || null
                })
            });

            const data = await res.json();
            
            if (data.success) {
                setTodos(todos.map(t => 
                    t.id === id ? { ...t, text: editingText.trim(), due_date: editingDueDate || undefined } : t
                ));
                setEditingId(null);
                setEditingText('');
                setEditingDueDate('');
            }
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };

    // ✅ Cancel editing
    const cancelEditing = () => {
        setEditingId(null);
        setEditingText('');
        setEditingDueDate('');
    };

    // ✅ Clear completed todos
    const clearCompleted = async () => {
        if (!confirm('Supprimer toutes les tâches terminées ?')) return;

        const completedIds = todos.filter(t => t.completed).map(t => t.id);
        
        for (const id of completedIds) {
            try {
                await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
            } catch (error) {
                console.error('Error clearing todo:', error);
            }
        }

        setTodos(todos.filter(t => !t.completed));
    };

    // ✅ Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    // ✅ Check if date is today or tomorrow
    const getDateLabel = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) return 'Aujourd\'hui';
        if (date.toDateString() === tomorrow.toDateString()) return 'Demain';
        return formatDate(dateString);
    };

    // ✅ Check if date is overdue
    const isOverdue = (dateString?: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/" 
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <CheckSquare className="w-6 h-6 text-blue-500" />
                            Todos
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Nouvelle
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-gray-900">{totalTodos}</div>
                        <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-orange-500">{activeTodos}</div>
                        <div className="text-xs text-gray-500">En cours</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-green-500">{completedTodos}</div>
                        <div className="text-xs text-gray-500">Terminées</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-blue-500">{completionRate}%</div>
                        <div className="text-xs text-gray-500">Progression</div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher une tâche..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                                    filter === 'all' 
                                        ? 'bg-blue-500 text-white border-blue-500' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                Toutes
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                                    filter === 'active' 
                                        ? 'bg-orange-500 text-white border-orange-500' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                En cours
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                                    filter === 'completed' 
                                        ? 'bg-green-500 text-white border-green-500' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                Terminées
                            </button>
                            {completedTodos > 0 && (
                                <button
                                    onClick={clearCompleted}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Todo List */}
                {todos.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">
                            {searchQuery ? 'Aucun résultat' : 'Aucune tâche pour le moment'}
                        </p>
                        <p className="text-sm text-gray-400">
                            {searchQuery ? 'Essayez une autre recherche' : 'Ajoutez votre première tâche !'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Ajouter une tâche
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {todos.map((todo) => (
                            <div 
                                key={todo.id}
                                className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                                    todo.completed ? 'border-green-200' : 'border-gray-100'
                                }`}
                            >
                                {editingId === todo.id ? (
                                    <div className="p-4">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="text"
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Modifier la tâche..."
                                                autoFocus
                                            />
                                            <input
                                                type="date"
                                                value={editingDueDate}
                                                onChange={(e) => setEditingDueDate(e.target.value)}
                                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveEditing(todo.id)}
                                                    className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition"
                                                >
                                                    Sauvegarder
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4">
                                        <button
                                            onClick={() => toggleTodo(todo.id)}
                                            className="flex-shrink-0"
                                        >
                                            {todo.completed ? (
                                                <CheckCircle className="w-6 h-6 text-green-500 fill-green-500 text-white" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-gray-300 hover:text-gray-400 transition" />
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${
                                                todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                                            }`}>
                                                {todo.text}
                                            </p>
                                            {todo.due_date && (
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    <span className={`text-xs ${
                                                        !todo.completed && isOverdue(todo.due_date) 
                                                            ? 'text-red-500 font-medium' 
                                                            : 'text-gray-400'
                                                    }`}>
                                                        {getDateLabel(todo.due_date)}
                                                        {!todo.completed && isOverdue(todo.due_date) && ' ⚠️ En retard'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                                onClick={() => {
                                                    setEditingId(todo.id);
                                                    setEditingText(todo.text);
                                                    setEditingDueDate(todo.due_date || '');
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Todo Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Nouvelle tâche</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tâche <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newTodoText}
                                    onChange={(e) => setNewTodoText(e.target.value)}
                                    placeholder="Écrire une tâche..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') addTodo();
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date limite (optionnel)
                                </label>
                                <input
                                    type="date"
                                    value={newTodoDueDate}
                                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={addTodo}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Ajouter'}
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}