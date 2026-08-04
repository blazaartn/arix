'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu, X, ChevronLeft, ChevronRight, List, BookOpen,
  Code, Lightbulb, CheckCircle, Info, HelpCircle, FileText,
  Clock, Check, Circle, AlertTriangle, Bookmark, Copy,
  CheckCheck, GraduationCap, Sparkles, Zap, Server
} from 'lucide-react';

import {
  fullPhpCourse,
  getLessonById,
  lessonContent,
  courseStructure
} from './data';

// ============================================================
// UTILITIES
// ============================================================

const getAllLessonIds = (): string[] => {
  const ids: string[] = [];
  courseStructure.chapters.forEach((ch) => {
    ids.push(...ch.lessonIds);
  });
  return ids;
};

const allLessonIds = getAllLessonIds();

// ============================================================
// CONTENT BLOCK RENDERER
// ============================================================

const renderContentBlock = (block: any, index: number) => {
  switch (block.type) {
    case 'theory':
      return (
        <div key={index} className="mb-8">
          {block.title && <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{block.title}</h3>}
          <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
            {block.text.split('\n').map((line: string, i: number) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}
          </div>
          {block.visualSuggestion && (
            <div className="mt-3 text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2 border-l-2 border-purple-400 pl-3">
              <Sparkles className="w-4 h-4 text-purple-400" /> {block.visualSuggestion}
            </div>
          )}
        </div>
      );

    case 'code-block':
      const languageMap: any = { php: 'PHP', html: 'HTML', sql: 'SQL' };
      return (
        <div key={index} className="mb-8">
          <div className="relative rounded-xl overflow-hidden bg-[#0a0a0f] border border-gray-800">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-purple-400 to-pink-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
              <span className="text-xs font-mono text-gray-400">{languageMap[block.language] || block.language}</span>
              <button className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1.5 bg-gray-700/30 hover:bg-gray-700 px-2 md:px-3 py-1 rounded-xl border border-gray-700/50 hover:border-gray-500" onClick={() => navigator.clipboard.writeText(block.code)}>
                <Copy className="w-3 h-3 md:w-3.5 md:h-3.5" /> <span className="hidden xs:inline">Copier</span>
              </button>
            </div>
            <pre className="p-4 md:p-6 overflow-x-auto text-xs md:text-sm text-gray-200 font-mono leading-relaxed"><code>{block.code}</code></pre>
          </div>
        </div>
      );

    case 'table-comparison':
      return (
        <div key={index} className="mb-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {block.caption && <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"><Code className="w-4 h-4 inline mr-2 text-purple-500" />{block.caption}</h4>}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50/50 dark:bg-gray-800/30">
                <tr>{block.headers.map((h: string, i: number) => <th key={i} className="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
                {block.rows.map((row: any[], i: number) => (
                  <tr key={i} className="hover:bg-purple-50/20 dark:hover:bg-purple-900/10 transition-colors">
                    {row.map((cell, j) => <td key={j} className="px-3 md:px-6 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'note':
      const bgMap: any = { info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', tip: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' };
      return (
        <div key={index} className={`mb-6 p-4 rounded-xl border ${bgMap[block.style || 'info']} flex items-start gap-3`}>
          {block.style === 'info' && <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />}
          {block.style === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
          {block.style === 'tip' && <Lightbulb className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />}
          <div className="text-gray-700 dark:text-gray-300 text-sm">{block.text}</div>
        </div>
      );

    case 'example-box':
      return (
        <div key={index} className="mb-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Zap className="w-4 h-4 text-purple-500" /> {block.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{block.description}</p>
          </div>
          <div className="p-4">
            <pre className="text-sm bg-gray-900/5 dark:bg-gray-800/50 p-3 rounded-xl overflow-x-auto font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"><code>{block.code}</code></pre>
            {block.result && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Résultat :</span>
                <div className="mt-1 text-gray-800 dark:text-gray-200 font-mono">{block.result}</div>
              </div>
            )}
          </div>
        </div>
      );

    default: return null;
  }
};

// ============================================================
// EXERCISE RENDERER
// ============================================================

const ExerciseRenderer = ({ exercise }: { exercise: any }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [codeValue, setCodeValue] = useState('');

  const handleSubmit = () => setSubmitted(true);

  const normalizeCode = (code: string): string => code.replace(/\s/g, '').replace(/;/g, '').toLowerCase();

  const isCorrect = (): boolean => {
    if (exercise.type === 'multiple-choice' || exercise.type === 'true-false') return selected === exercise.correctAnswer;
    if (exercise.type === 'fill-blank') return selected?.toLowerCase().trim() === (exercise.correctAnswer as string).toLowerCase().trim();
    if (exercise.type === 'code-practice') {
      const userCode = normalizeCode(codeValue);
      const expectedCode = normalizeCode(exercise.correctAnswer as string);
      return userCode === expectedCode;
    }
    return false;
  };

  const isAnswered = (): boolean => {
    if (exercise.type === 'code-practice') return codeValue.trim().length > 0;
    return selected !== null && selected !== '';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(168,85,247,0.06)] hover:border-purple-200/60">
      <div className="flex items-start gap-3 md:gap-4">
        <div className="flex-shrink-0 mt-1">
          {exercise.type === 'multiple-choice' && <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)]"><Circle className="w-4 h-4 md:w-5 md:h-5" /></div>}
          {exercise.type === 'true-false' && <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)]"><CheckCircle className="w-4 h-4 md:w-5 md:h-5" /></div>}
          {exercise.type === 'fill-blank' && <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]"><FileText className="w-4 h-4 md:w-5 md:h-5" /></div>}
          {exercise.type === 'code-practice' && <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)]"><Code className="w-4 h-4 md:w-5 md:h-5" /></div>}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-gray-900 dark:text-gray-100 font-semibold mb-4 text-sm md:text-base">{exercise.question}</p>

          {exercise.type === 'multiple-choice' && exercise.options && (
            <div className="space-y-2 mb-4">
              {exercise.options.map((opt: string, idx: number) => {
                const isSelected = selected === opt;
                const isCorrectAnswer = opt === exercise.correctAnswer;
                let className = 'block p-3 rounded-xl border-2 cursor-pointer transition-all bg-white dark:bg-gray-800 text-sm hover:border-purple-300 dark:hover:border-purple-700';
                if (submitted) {
                  if (isCorrectAnswer) className += ' border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]';
                  else if (isSelected && !isCorrectAnswer) className += ' border-red-400 bg-red-50 dark:bg-red-900/20 shadow-[0_0_25px_rgba(239,68,68,0.1)]';
                  else className += ' border-gray-200 dark:border-gray-700 opacity-60';
                } else {
                  className += isSelected ? ' border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.15)]' : ' border-gray-200 dark:border-gray-700';
                }
                return (
                  <label key={idx} className={className} onClick={() => !submitted && setSelected(opt)}>
                    <input type="radio" name={`ex-${exercise.id}`} value={opt} checked={isSelected} onChange={() => !submitted && setSelected(opt)} className="sr-only" />
                    <span>{opt}</span>
                    {submitted && isCorrectAnswer && <CheckCheck className="inline ml-2 w-4 h-4 text-emerald-600" />}
                    {submitted && isSelected && !isCorrectAnswer && <X className="inline ml-2 w-4 h-4 text-red-600" />}
                  </label>
                );
              })}
            </div>
          )}

          {exercise.type === 'true-false' && (
            <div className="flex gap-2 md:gap-3 mb-4">
              {['Vrai', 'Faux'].map((val) => {
                const isSelected = selected === val;
                const isCorrectAnswer = val === exercise.correctAnswer;
                let className = 'flex-1 px-4 py-2 rounded-xl border-2 font-semibold transition-all bg-white dark:bg-gray-800 text-sm text-center hover:border-purple-300 dark:hover:border-purple-700';
                if (submitted) {
                  if (isCorrectAnswer) className += ' border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]';
                  else if (isSelected && !isCorrectAnswer) className += ' border-red-400 bg-red-50 dark:bg-red-900/20 shadow-[0_0_25px_rgba(239,68,68,0.1)]';
                  else className += ' border-gray-200 dark:border-gray-700 opacity-60';
                } else {
                  className += isSelected ? ' border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.15)]' : ' border-gray-200 dark:border-gray-700';
                }
                return (
                  <button key={val} className={className} onClick={() => !submitted && setSelected(val)} disabled={submitted}>
                    {val}
                  </button>
                );
              })}
            </div>
          )}

          {exercise.type === 'fill-blank' && (
            <div className="mb-4">
              <input type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:border-purple-500 focus:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition outline-none" placeholder="Tapez votre réponse..." value={selected || ''} onChange={(e) => !submitted && setSelected(e.target.value)} disabled={submitted} />
            </div>
          )}

          {exercise.type === 'code-practice' && (
            <div className="mb-4">
              {exercise.codeSnippet && <pre className="bg-gray-900/5 dark:bg-gray-800/50 p-3 rounded-xl text-sm text-gray-800 dark:text-gray-200 font-mono overflow-x-auto border border-gray-200 dark:border-gray-700 mb-3"><code>{exercise.codeSnippet}</code></pre>}
              <textarea className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm placeholder-gray-400 focus:border-purple-500 focus:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition outline-none resize-none" rows={4} placeholder="Écrivez votre code PHP ici..." value={codeValue} onChange={(e) => !submitted && setCodeValue(e.target.value)} disabled={submitted} />
            </div>
          )}

          {exercise.hint && (
            <div className="mb-4">
              <button className="text-sm text-purple-600 hover:text-purple-800 transition flex items-center gap-1.5 font-medium" onClick={() => setShowHint(!showHint)}>
                <HelpCircle className="w-4 h-4" /> {showHint ? 'Masquer' : 'Afficher'} l'indice
              </button>
              {showHint && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700">{exercise.hint}</p>}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {!submitted && isAnswered() && (
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.4)]" onClick={handleSubmit}>
                Soumettre
              </button>
            )}
            {submitted && (
              <div className="flex items-center gap-3 flex-wrap">
                {isCorrect() ? <span className="text-emerald-600 font-semibold flex items-center gap-2"><CheckCheck className="w-5 h-5" /> Correct !</span> : <span className="text-red-500 font-semibold flex items-center gap-2"><X className="w-5 h-5" /> Incorrect</span>}
                <button className="px-4 py-1.5 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium" onClick={() => { setSubmitted(false); setSelected(null); setCodeValue(''); }}>Réinitialiser</button>
              </div>
            )}
          </div>

          {submitted && exercise.explanation && (
            <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-xl">
              <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-bold text-purple-800 dark:text-purple-400">Explication :</span> {exercise.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function PhpLessonViewer() {
  const [currentLessonId, setCurrentLessonId] = useState<string>(allLessonIds[0] || '');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const lesson = getLessonById(currentLessonId);
  const currentIndex = allLessonIds.indexOf(currentLessonId);
  const prevId = currentIndex > 0 ? allLessonIds[currentIndex - 1] : null;
  const nextId = currentIndex < allLessonIds.length - 1 ? allLessonIds[currentIndex + 1] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLessonId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Leçon introuvable.</p>
      </div>
    );
  }

  const totalLessons = allLessonIds.length;
  const progress = ((currentIndex + 1) / totalLessons) * 100;

  const difficultyMap: any = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 flex flex-col">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <Link href="/cours" className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30 transition flex-shrink-0">
              <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden xs:inline">Cours</span>
            </Link>

            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition lg:hidden flex-shrink-0">
              {sidebarOpen ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Menu className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-[0_4px_20px_rgba(168,85,247,0.4)] flex-shrink-0">
                <Server className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm md:text-base font-extrabold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent tracking-tight truncate">PHP</h1>
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 hidden xs:block truncate">{lesson.title}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm flex-shrink-0">
            <span className="text-gray-400 dark:text-gray-500 font-mono hidden xs:inline">{currentIndex + 1} / {totalLessons}</span>
            <div className="w-16 sm:w-20 md:w-32 h-1.5 bg-gray-200/80 dark:bg-gray-700/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full relative">

        {/* SIDEBAR */}
        <aside className={`fixed inset-0 z-40 lg:relative lg:inset-auto lg:z-0 w-[280px] sm:w-[320px] lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-800/50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col overflow-y-auto shadow-2xl lg:shadow-none`}>
          <div className="p-4 md:p-5 border-b border-gray-200/80 dark:border-gray-800/50 flex items-center justify-between lg:justify-start">
            <h2 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2.5 text-xs md:text-sm tracking-wide uppercase">
              <List className="w-4 h-4 text-purple-500" /> Chapitres
            </h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          <nav className="flex-1 p-2 md:p-3 space-y-3 md:space-y-4 overflow-y-auto">
            {courseStructure.chapters.map((chapter) => (
              <div key={chapter.id} className="space-y-1">
                <h3 className="text-[10px] md:text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 pt-1">{chapter.title}</h3>
                {chapter.lessonIds.map((id) => {
                  const l = getLessonById(id);
                  if (!l) return null;
                  const isActive = id === currentLessonId;
                  return (
                    <button
                      key={id}
                      onClick={() => { setCurrentLessonId(id); setSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-xs md:text-sm transition-all flex items-center gap-3 ${isActive ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 font-semibold border border-purple-200/40 dark:border-purple-800/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'}`}
                    >
                      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <span className="truncate text-xs md:text-sm">{l.title}</span>
                      {l.exercises.length > 0 && <span className={`ml-auto text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full ${isActive ? 'bg-purple-200/80 text-purple-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>{l.exercises.length}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-3 md:p-4 border-t border-gray-200/80 dark:border-gray-800/50 text-[10px] md:text-xs text-gray-400 dark:text-gray-500 flex items-center justify-between">
            <span>Total {totalLessons} leçons</span>
            <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0 px-3 sm:px-6 md:px-10 lg:px-14 py-4 md:py-10">
          <div className="mb-6 md:mb-12">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-400 dark:text-gray-500 mb-2 md:mb-3">
              <span>Leçon {currentIndex + 1}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold ${lesson.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' : lesson.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {difficultyMap[lesson.difficulty]}
              </span>
              <span className="flex items-center gap-1 md:gap-1.5">
                <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" /> {lesson.estimatedMinutes} min
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
              {lesson.title}
            </h2>
            <p className="text-sm md:text-lg text-gray-500 dark:text-gray-400 mt-2 leading-relaxed max-w-3xl">{lesson.description}</p>
          </div>

          {/* Content */}
          <div>{lesson.content.map((block, idx) => renderContentBlock(block, idx))}</div>

          {/* Key takeaways */}
          {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
            <div className="mt-8 md:mt-12 p-4 md:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl">
              <h3 className="font-extrabold text-purple-800 dark:text-purple-400 flex items-center gap-2 md:gap-3 text-base md:text-lg">
                <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-purple-500" /> Points clés
              </h3>
              <ul className="mt-3 md:mt-4 space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300 text-sm md:text-base">
                {lesson.keyTakeaways.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
              </ul>
            </div>
          )}

          {/* Exercises */}
          {lesson.exercises && lesson.exercises.length > 0 && (
            <div className="mt-10 md:mt-14">
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
                <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" /> Exercices
              </h3>
              {lesson.exercises.map((ex) => <ExerciseRenderer key={ex.id} exercise={ex} />)}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-between gap-3 md:gap-4 border-t border-gray-200/80 dark:border-gray-800/50 pt-6 md:pt-8">
            <div>
              {prevId && (
                <button onClick={() => setCurrentLessonId(prevId)} className="inline-flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden xs:inline">Précédent</span>
                </button>
              )}
            </div>
            <div>
              {nextId ? (
                <button onClick={() => setCurrentLessonId(nextId)} className="inline-flex items-center gap-1.5 md:gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs md:text-sm font-semibold rounded-xl md:rounded-2xl transition shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.4)]">
                  <span className="hidden xs:inline">Suivant</span> <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              ) : (
                <span className="text-xs md:text-sm text-gray-400 font-medium">🎉 Terminé !</span>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}