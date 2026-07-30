'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ListChecks, CheckCircle, 
  Briefcase, Rocket, ChevronRight, Loader2,
  Trophy, Star, Award
} from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  due_date?: string;
}

interface UserRank {
  id: string;
  name: string;
  avatar_url: string;
  xp_points: number;
  level: number;
  role: string;
  rank_position: number;
}

interface SidebarProps {
  session: any;
  topUsers?: UserRank[];
  todos?: Todo[];
}

export function Sidebar({ 
  session,
  topUsers = [],
  todos = []
}: SidebarProps) {
  const [localTodos, setLocalTodos] = useState<Todo[]>(todos);
  const [localTopUsers, setLocalTopUsers] = useState<UserRank[]>(topUsers);
  const [loadingTodos, setLoadingTodos] = useState(todos.length === 0);
  const [loadingTopUsers, setLoadingTopUsers] = useState(topUsers.length === 0);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!session || todos.length > 0) {
        setLoadingTodos(false);
        return;
      }
      
      try {
        const res = await fetch('/api/todos?limit=5&filter=active');
        const data = await res.json();
        if (data.success) {
          setLocalTodos(data.todos || []);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setLoadingTodos(false);
      }
    };

    fetchTodos();
  }, [session, todos]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      if (topUsers.length > 0) {
        setLoadingTopUsers(false);
        return;
      }
      
      try {
        const res = await fetch('/api/ranking?limit=3');
        const data = await res.json();
        if (data.success) {
          setLocalTopUsers(data.users || []);
        }
      } catch (error) {
        console.error('Error fetching top users:', error);
      } finally {
        setLoadingTopUsers(false);
      }
    };

    fetchTopUsers();
  }, [topUsers]);

  const displayTodos = todos.length > 0 ? todos : localTodos;
  const displayTopUsers = topUsers.length > 0 ? topUsers : localTopUsers;
  const isLoading = loadingTodos || loadingTopUsers;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-3"></div>
          <div className="space-y-2">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-3"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Users Section - ALWAYS SHOWS */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">Top Contributeurs</h3>
          </div>
          <Link href="/ranking" className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium flex items-center gap-1">
            Voir plus
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {loadingTopUsers ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : displayTopUsers.length === 0 ? (
          <div className="text-center py-6">
            <Star className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Aucun utilisateur</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayTopUsers.map((user, idx) => {
              const rankPosition = idx + 1;
              const isTopThree = rankPosition <= 3;
              
              return (
                <Link 
                  key={user.id} 
                  href={`/profile/${user.id}`} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    rankPosition === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    rankPosition === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    rankPosition === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    {isTopThree ? (
                      <span className="text-white font-bold text-sm">
                        {rankPosition === 1 ? '🥇' : rankPosition === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-400 font-bold text-sm">
                        {rankPosition}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate group-hover:text-orange-600">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {user.role === 'admin' && (
                          <span className="text-xs">👑</span>
                        )}
                        {user.role === 'professor' && (
                          <span className="text-xs">👨‍🏫</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.xp_points} XP • Level {user.level}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* TODOS Section - Only shows when logged in */}
      {session && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Mes Tâches</h3>
            </div>
            <Link href="/todos" className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium flex items-center gap-1">
              Voir tout
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loadingTodos ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              ))}
            </div>
          ) : displayTodos.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Aucune tâche</p>
              <Link href="/todos" className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium inline-block">
                Créer une tâche
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {displayTodos.slice(0, 4).map((todo) => (
                <div key={todo.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition ${todo.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`} />
                  <span className={`text-sm flex-1 truncate ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {todo.text}
                  </span>
                  {todo.due_date && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                      {new Date(todo.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}