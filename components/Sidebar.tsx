'use client';

import Link from 'next/link';
import { 
  ListChecks, CheckCircle, Calendar, Clock, Rocket, 
  Trophy, Star, Award, Loader2 
} from 'lucide-react';

interface UserRank {
  id: string;
  name: string;
  avatar_url: string;
  xp_points: number;
  level: number;
  role: string;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  due_date?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  category: string;
}

interface SidebarProps {
  session: any;
  loading: boolean;
  loadingTopUsers: boolean;
  loadingTodos: boolean;
  topUsers: UserRank[];
  todos: Todo[];
  sidebarProjects: Project[];
  comingEvents: { id: string; title: string; date: string; description: string }[];
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

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
    </div>
  );
}

export function Sidebar({ 
  session, 
  loading, 
  loadingTopUsers, 
  loadingTodos, 
  topUsers, 
  todos, 
  sidebarProjects,
  comingEvents 
}: SidebarProps) {
  if (loading || loadingTopUsers || loadingTodos) {
    return <SidebarSkeleton />;
  }

  return (
    <>
      {/* Guest Banner */}
      {!session && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-600">👋 Connectez-vous pour interagir</p>
        </div>
      )}

      {/* TODOS */}
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
              className={`block p-3 rounded-lg border border-gray-100 hover:border-orange-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
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
              className={`flex items-center gap-3 p-2 rounded-lg border ${
                index === 0 ? 'border-yellow-300 bg-yellow-50/50' :
                index === 1 ? 'border-gray-300 bg-gray-50/50' :
                'border-orange-200 bg-orange-50/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-yellow-400 text-white' :
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
  );
}