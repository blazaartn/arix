'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ListChecks, CheckCircle, 
  Briefcase, Rocket, ChevronRight, Loader2
} from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  due_date?: string;
}

interface SidebarProps {
  session: any;
}

export function Sidebar({ session }: SidebarProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch todos - exactly like the todos page does
  useEffect(() => {
    const fetchTodos = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch('/api/todos?limit=5&filter=active');
        const data = await res.json();
        
        console.log('📊 Sidebar todos response:', data); // Debug log
        
        if (data.success) {
          setTodos(data.todos || []);
        } else {
          setTodos([]);
        }
      } catch (error) {
        console.error('Error fetching todos for sidebar:', error);
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [session]);

  // ✅ Debug: log todos state
  console.log('📊 Sidebar todos state:', todos);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Guest Banner */}
      {!session && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-600">👋 Connectez-vous</p>
        </div>
      )}

      {/* ✅ TODOS - Fixed to show properly */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ListChecks className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold text-gray-800">Todos</h3>
          </div>
          <Link href="/todos" className="text-[10px] text-blue-500 hover:text-blue-600 font-medium flex items-center gap-0.5">
            Voir tout
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {!session ? (
          <div className="text-center py-2">
            <p className="text-[10px] text-gray-400">Connectez-vous</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-2">
            <p className="text-[10px] text-gray-400">Aucune tâche</p>
            <Link href="/todos" className="text-[10px] text-blue-500 hover:text-blue-600 inline-block mt-0.5">
              Ajouter
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            {todos.slice(0, 4).map((todo) => (
              <div key={todo.id} className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {todo.completed && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-[11px] flex-1 truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {todo.text}
                </span>
                {todo.due_date && (
                  <span className="text-[9px] text-gray-400 flex-shrink-0">
                    {new Date(todo.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PROJECTS - Quick Link */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs font-bold text-gray-800">Projets</h3>
          </div>
          <Link 
            href="/projects" 
            className="text-[10px] text-orange-500 hover:text-orange-600 font-medium flex items-center gap-0.5"
          >
            Voir tout
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          {session ? 'Accédez à vos projets' : 'Connectez-vous pour accéder aux projets'}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
          <Rocket className="w-3 h-3 text-orange-400" />
          <span>3 projets disponibles</span>
        </div>
      </div>
    </div>
  );
}