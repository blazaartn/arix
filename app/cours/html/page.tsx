"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  List,
  BookOpen,
  Code,
  Table as TableIcon,
  Lightbulb,
  CheckCircle,
  Info,
  HelpCircle,
  FileText,
  Clock,
  Check,
  Circle,
  AlertTriangle,
  Bookmark,
  Copy,
  CheckCheck,
  GraduationCap,
  Sparkles,
  Zap,
  ArrowLeft,
  Home,
} from "lucide-react";

// Import des données
import {
  fullHtmlCourse,
  getLessonById,
  lessonContent,
  courseStructure,
} from "./data";
import type { ContentBlock, Exercise, Lesson } from "./data";

// -------------------------------
// Utilitaires
// -------------------------------
const getAllLessonIds = (): string[] => {
  const ids: string[] = [];
  courseStructure.chapters.forEach((ch) => {
    ids.push(...ch.lessonIds);
  });
  return ids;
};

const allLessonIds = getAllLessonIds();

// -------------------------------
// Rendu des blocs de contenu
// -------------------------------
const renderContentBlock = (block: ContentBlock, index: number) => {
  switch (block.type) {
    case "theory":
      return (
        <div key={index} className="mb-10 group">
          {block.title && (
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
              {block.title}
            </h3>
          )}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap text-[16px]">
            {block.text}
          </p>
          {block.visualSuggestion && (
            <div className="mt-3 text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2 border-l-2 border-orange-400 pl-3">
              <Sparkles className="w-4 h-4 text-orange-400" />
              {block.visualSuggestion}
            </div>
          )}
        </div>
      );

    case "code-block":
      return (
        <div key={index} className="mb-10">
          {block.title && (
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase">
              {block.title}
            </h4>
          )}
          <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0f] dark:bg-[#0a0a0f] border border-gray-800 dark:border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            {/* Neon glow line — using orange gradient to match your theme */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 shadow-[0_0_20px_rgba(251,146,60,0.5)]" />
            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-800/50 border-b border-gray-700/50">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="ml-2">{block.language}</span>
              </span>
              <button
                className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1.5 bg-gray-700/30 hover:bg-gray-700 px-3 py-1.5 rounded-xl border border-gray-700/50 hover:border-gray-500"
                onClick={() => navigator.clipboard.writeText(block.code)}
              >
                <Copy className="w-3.5 h-3.5" /> Copier
              </button>
            </div>
            <pre className="p-6 overflow-x-auto text-sm text-gray-200 font-mono leading-relaxed">
              <code>{block.code}</code>
            </pre>
          </div>
        </div>
      );

    case "table-comparison":
      return (
        <div
          key={index}
          className="mb-10 overflow-x-auto rounded-2xl border border-gray-200/80 dark:border-gray-700/50 bg-white dark:bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
        >
          {block.caption && (
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-3.5 bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200/60 dark:border-gray-700/50 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              {block.caption}
            </h4>
          )}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-800/30">
              <tr>
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
              {block.rows.map((row, i) => (
                <tr key={i} className="hover:bg-orange-50/20 dark:hover:bg-orange-900/10 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "note":
      const iconMap = {
        info: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
        tip: <Lightbulb className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
      };
      const bgMap = {
        info: "bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-800/40",
        warning: "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40",
        tip: "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40",
      };
      return (
        <div
          key={index}
          className={`mb-8 p-5 rounded-2xl border ${bgMap[block.style || "info"]} flex items-start gap-4 shadow-sm`}
        >
          <div className="flex-shrink-0 mt-0.5">{iconMap[block.style || "info"]}</div>
          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{block.text}</div>
        </div>
      );

    case "example-box":
      return (
        <div
          key={index}
          className="mb-10 border border-gray-200/80 dark:border-gray-700/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
        >
          <div className="bg-gray-50/80 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200/60 dark:border-gray-700/50 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500 dark:text-orange-400" /> {block.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{block.description}</p>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900">
            <pre className="text-sm bg-gray-900/5 dark:bg-gray-800/50 p-4 rounded-xl overflow-x-auto font-mono text-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-gray-700/50">
              <code>{block.code}</code>
            </pre>
            {block.result && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/50 rounded-xl">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Résultat :
                </span>
                <div className="mt-1 text-gray-800 dark:text-gray-200 font-mono">{block.result}</div>
              </div>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
};

// -------------------------------
// Rendu d'un exercice
// -------------------------------
const ExerciseRenderer = ({ exercise }: { exercise: Exercise }) => {
  const [selected, setSelected] = useState<string | string[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => setSubmitted(true);

  const isCorrect = () => {
    if (exercise.type === "multiple-choice" || exercise.type === "true-false") {
      return selected === exercise.correctAnswer;
    }
    if (exercise.type === "fill-blank") {
      return selected === exercise.correctAnswer;
    }
    return false;
  };

  const isAnswered = selected !== null && selected !== "";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6 mb-6 transition-all hover:shadow-[0_8px_30px_rgba(251,146,60,0.06)] dark:hover:shadow-[0_8px_30px_rgba(251,146,60,0.04)] hover:border-orange-200/60 dark:hover:border-orange-800/40">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {exercise.type === "multiple-choice" && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(251,146,60,0.3)]">
              <Circle className="w-5 h-5" />
            </div>
          )}
          {exercise.type === "true-false" && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)]">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
          {exercise.type === "fill-blank" && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]">
              <FileText className="w-5 h-5" />
            </div>
          )}
          {exercise.type === "code-practice" && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(251,146,60,0.3)]">
              <Code className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-gray-900 dark:text-gray-100 font-semibold mb-5 text-[16px] leading-relaxed">
            {exercise.question}
          </p>

          {exercise.type === "multiple-choice" && exercise.options && (
            <div className="space-y-3 mb-5">
              {exercise.options.map((opt, idx) => {
                const isSelected = selected === opt;
                const isCorrectAnswer = opt === exercise.correctAnswer;
                let className =
                  "block p-4 rounded-2xl border-2 cursor-pointer transition-all bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-700";
                if (submitted) {
                  if (isCorrectAnswer)
                    className +=
                      " border-emerald-500 bg-emerald-50/80 dark:bg-emerald-900/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]";
                  else if (isSelected && !isCorrectAnswer)
                    className +=
                      " border-red-400 bg-red-50/80 dark:bg-red-900/20 shadow-[0_0_25px_rgba(239,68,68,0.1)]";
                  else className += " border-gray-200 dark:border-gray-700 opacity-60";
                } else {
                  className += isSelected
                    ? " border-orange-500 dark:border-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.15)]"
                    : " border-gray-200 dark:border-gray-700";
                }
                return (
                  <label key={idx} className={className} onClick={() => !submitted && setSelected(opt)}>
                    <input
                      type="radio"
                      name={`exercise-${exercise.id}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => !submitted && setSelected(opt)}
                      className="sr-only"
                    />
                    <span className="text-gray-800 dark:text-gray-200">{opt}</span>
                    {submitted && isCorrectAnswer && (
                      <CheckCheck className="inline ml-2 w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {submitted && isSelected && !isCorrectAnswer && (
                      <X className="inline ml-2 w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {exercise.type === "true-false" && (
            <div className="flex gap-3 mb-5">
              {["Vrai", "Faux"].map((val) => {
                const isSelected = selected === val;
                const isCorrectAnswer = val === exercise.correctAnswer;
                let className =
                  "px-6 py-3 rounded-2xl border-2 font-semibold transition-all bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-700";
                if (submitted) {
                  if (isCorrectAnswer)
                    className +=
                      " border-emerald-500 bg-emerald-50/80 dark:bg-emerald-900/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]";
                  else if (isSelected && !isCorrectAnswer)
                    className +=
                      " border-red-400 bg-red-50/80 dark:bg-red-900/20 shadow-[0_0_25px_rgba(239,68,68,0.1)]";
                  else className += " border-gray-200 dark:border-gray-700 opacity-60";
                } else {
                  className += isSelected
                    ? " border-orange-500 dark:border-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.15)]"
                    : " border-gray-200 dark:border-gray-700";
                }
                return (
                  <button
                    key={val}
                    className={className}
                    onClick={() => !submitted && setSelected(val)}
                    disabled={submitted}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          )}

          {exercise.type === "fill-blank" && (
            <div className="mb-5">
              <input
                type="text"
                className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-orange-500 dark:focus:border-orange-400 focus:shadow-[0_0_25px_rgba(251,146,60,0.15)] transition-all outline-none"
                placeholder="Tapez votre réponse..."
                value={selected as string || ""}
                onChange={(e) => !submitted && setSelected(e.target.value)}
                disabled={submitted}
              />
            </div>
          )}

          {exercise.type === "code-practice" && exercise.codeSnippet && (
            <div className="mb-5">
              <pre className="bg-gray-900/5 dark:bg-gray-800/50 p-4 rounded-2xl text-sm text-gray-800 dark:text-gray-200 font-mono overflow-x-auto border border-gray-200/60 dark:border-gray-700/50">
                <code>{exercise.codeSnippet}</code>
              </pre>
              <textarea
                className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-orange-500 dark:focus:border-orange-400 focus:shadow-[0_0_25px_rgba(251,146,60,0.15)] transition-all outline-none mt-3"
                rows={4}
                placeholder="Écrivez votre code ici..."
                value={selected as string || ""}
                onChange={(e) => !submitted && setSelected(e.target.value)}
                disabled={submitted}
              />
            </div>
          )}

          {exercise.hint && (
            <div className="mb-5">
              <button
                className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition flex items-center gap-1.5 font-medium"
                onClick={() => setShowHint(!showHint)}
              >
                <HelpCircle className="w-4 h-4" />
                {showHint ? "Masquer l'indice" : "Afficher l'indice"}
              </button>
              {showHint && (
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/50">
                  {exercise.hint}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {!submitted && isAnswered && (
              <button
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-2xl transition shadow-[0_4px_20px_rgba(251,146,60,0.3)] hover:shadow-[0_8px_30px_rgba(251,146,60,0.4)]"
                onClick={handleSubmit}
              >
                Soumettre la réponse
              </button>
            )}
            {submitted && (
              <div className="flex items-center gap-4 flex-wrap">
                {isCorrect() ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 text-lg">
                    <CheckCheck className="w-6 h-6" /> Correct !
                  </span>
                ) : (
                  <span className="text-red-500 dark:text-red-400 font-semibold flex items-center gap-2 text-lg">
                    <X className="w-6 h-6" /> Incorrect. Réessayer ?
                  </span>
                )}
                <button
                  className="px-5 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition font-medium text-gray-600 dark:text-gray-400"
                  onClick={() => {
                    setSubmitted(false);
                    setSelected(null);
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>

          {submitted && exercise.explanation && (
            <div className="mt-5 p-5 bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/60 dark:border-orange-800/40 rounded-2xl shadow-[inset_0_2px_10px_rgba(251,146,60,0.05)]">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-bold text-orange-800 dark:text-orange-400">Explication :</span>{" "}
                {exercise.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------
// Composant principal : LessonViewer
// -------------------------------
export const LessonViewer: React.FC = () => {
  const [currentLessonId, setCurrentLessonId] = useState<string>(allLessonIds[0] || "");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const lesson = getLessonById(currentLessonId);
  const currentIndex = allLessonIds.indexOf(currentLessonId);
  const prevId = currentIndex > 0 ? allLessonIds[currentIndex - 1] : null;
  const nextId = currentIndex < allLessonIds.length - 1 ? allLessonIds[currentIndex + 1] : null;

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentLessonId]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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

  const difficultyMap = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 flex flex-col font-sans antialiased">

      {/* -------------------------------
          HEADER — Matching your app's theme
      ------------------------------- */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Back to App Button — matches your app's style */}
            <a
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Retour</span>
              <Home className="w-4 h-4" />
            </a>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition lg:hidden"
              aria-label="Basculer la navigation"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-[0_4px_20px_rgba(251,146,60,0.4)]">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent tracking-tight">
                  {fullHtmlCourse.structure.title}
                </h1>
                <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">{lesson.title}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-gray-400 dark:text-gray-500 font-mono">
              {currentIndex + 1} / {totalLessons}
            </span>
            <div className="w-32 h-1.5 bg-gray-200/80 dark:bg-gray-700/80 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(251,146,60,0.4)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full relative">

        {/* -------------------------------
            SIDEBAR — Matching your app's sidebar
        ------------------------------- */}
        <aside
          className={`
            fixed inset-0 z-40 lg:relative lg:inset-auto lg:z-0
            w-[280px] lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-800/50
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            flex flex-col overflow-y-auto shadow-2xl lg:shadow-none
          `}
        >
          <div className="p-5 border-b border-gray-200/80 dark:border-gray-800/50 flex items-center justify-between lg:justify-start">
            <h2 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2.5 text-sm tracking-wide uppercase">
              <List className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              Chapitres
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-4">
            {courseStructure.chapters.map((chapter) => (
              <div key={chapter.id} className="space-y-1">
                <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 pt-1">
                  {chapter.title}
                </h3>
                {chapter.lessonIds.map((id) => {
                  const l = getLessonById(id);
                  if (!l) return null;
                  const isActive = id === currentLessonId;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setCurrentLessonId(id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full text-left px-3 py-2.5 rounded-2xl text-sm transition-all
                        flex items-center gap-3 group
                        ${
                          isActive
                            ? "bg-gradient-to-r from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 text-orange-700 dark:text-orange-400 font-semibold shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] border border-orange-200/40 dark:border-orange-800/30"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400"
                        }
                      `}
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_0_15px_rgba(251,146,60,0.6)] animate-pulse"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                      <span className="truncate">{l.title}</span>
                      {l.exercises.length > 0 && (
                        <span
                          className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-orange-200/80 dark:bg-orange-800/50 text-orange-700 dark:text-orange-300 shadow-[0_0_10px_rgba(251,146,60,0.2)]"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {l.exercises.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200/80 dark:border-gray-800/50 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-between">
            <span>Total {totalLessons} leçons</span>
            <GraduationCap className="w-4 h-4 text-orange-400 dark:text-orange-500" />
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/10 dark:bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* -------------------------------
            MAIN CONTENT
        ------------------------------- */}
        <main className="flex-1 w-full min-w-0 px-6 py-10 sm:px-10 lg:px-14">
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500 mb-3">
              <span>Leçon {currentIndex + 1}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  lesson.difficulty === "beginner"
                    ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                    : lesson.difficulty === "intermediate"
                    ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                    : "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400"
                }`}
              >
                {difficultyMap[lesson.difficulty]}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {lesson.estimatedMinutes} min
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              {lesson.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg leading-relaxed max-w-3xl">
              {lesson.description}
            </p>
            {lesson.dependencies && lesson.dependencies.length > 0 && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-400 dark:text-gray-500">
                <Bookmark className="w-4 h-4" />
                Prérequis : {lesson.dependencies.join(", ")}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            {lesson.content.map((block, idx) => renderContentBlock(block, idx))}
          </div>

          {/* Key takeaways */}
          {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
            <div className="mt-12 p-6 bg-gradient-to-br from-orange-50/70 to-amber-50/70 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/60 dark:border-orange-800/30 rounded-3xl shadow-[0_8px_30px_rgba(251,146,60,0.06)] dark:shadow-[0_8px_30px_rgba(251,146,60,0.03)]">
              <h3 className="font-extrabold text-orange-800 dark:text-orange-400 flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-orange-500 dark:text-orange-400" /> Points clés à retenir
              </h3>
              <ul className="mt-4 space-y-2.5 list-disc list-inside text-gray-700 dark:text-gray-300">
                {lesson.keyTakeaways.map((item, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exercises */}
          {lesson.exercises && lesson.exercises.length > 0 && (
            <div className="mt-14">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                <CheckCircle className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />
                Exercices pratiques
              </h3>
              {lesson.exercises.map((ex) => (
                <ExerciseRenderer key={ex.id} exercise={ex} />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200/80 dark:border-gray-800/50 pt-8">
            <div>
              {prevId && (
                <button
                  onClick={() => setCurrentLessonId(prevId)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>
              )}
            </div>
            <div>
              {nextId ? (
                <button
                  onClick={() => setCurrentLessonId(nextId)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-2xl transition shadow-[0_4px_20px_rgba(251,146,60,0.3)] hover:shadow-[0_8px_30px_rgba(251,146,60,0.4)]"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500 font-medium flex items-center gap-2">
                  🎉 Vous avez terminé toutes les leçons !
                </span>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonViewer;