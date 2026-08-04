import Link from 'next/link';
import { Code2, Palette, Zap, Database, Server, ArrowLeft, Home } from 'lucide-react';

const courses = [
  { id: 'html', title: 'HTML5', icon: Code2, color: 'from-orange-500 to-orange-600', href: '/cours/html' },
  { id: 'css', title: 'CSS', icon: Palette, color: 'from-blue-500 to-blue-600', href: '/cours/css' },
  { id: 'javascript', title: 'JavaScript', icon: Zap, color: 'from-yellow-500 to-yellow-600', href: '/cours/javascript' },
  { id: 'php', title: 'PHP', icon: Server, color: 'from-purple-500 to-purple-600', href: '/cours/php' },
  { id: 'sql', title: 'SQL & BD', icon: Database, color: 'from-emerald-500 to-emerald-600', href: '/cours/sql' },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Retour à l'accueil</span>
            <Home className="w-4 h-4" />
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">📚 Tous les cours</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <Link
                key={course.id}
                href={course.href}
                className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all hover:-translate-y-1 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-orange-500 transition">
                  {course.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}