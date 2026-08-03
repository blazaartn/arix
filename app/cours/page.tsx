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
            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
              {block.title}
            </h3>
          )}
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-[16px]">
            {block.text}
          </p>
          {block.visualSuggestion && (
            <div className="mt-3 text-sm text-gray-400 flex items-center gap-2 border-l-2 border-blue-400 pl-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              {block.visualSuggestion}
            </div>
          )}
        </div>
      );

    case "code-block":
      return (
        <div key={index} className="mb-10">
          {block.title && (
            <h4 className="text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase">
              {block.title}
            </h4>
          )}
          <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0f] border border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            {/* Neon glow line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
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
          className="mb-10 overflow-x-auto rounded-2xl border border-gray-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
        >
          {block.caption && (
            <h4 className="text-sm font-semibold text-gray-600 px-6 py-3.5 bg-gray-50/80 border-b border-gray-200/60 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-blue-500" />
              {block.caption}
            </h4>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {block.rows.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-6 py-4 text-sm text-gray-700 whitespace-pre-wrap">
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
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        tip: <Lightbulb className="w-5 h-5 text-emerald-500" />,
      };
      const bgMap = {
        info: "bg-blue-50/70 border-blue-200/60",
        warning: "bg-amber-50/70 border-amber-200/60",
        tip: "bg-emerald-50/70 border-emerald-200/60",
      };
      return (
        <div
          key={index}
          className={`mb-8 p-5 rounded-2xl border ${bgMap[block.style || "info"]} flex items-start gap-4 shadow-sm`}
        >
          <div className="flex-shrink-0 mt-0.5">{iconMap[block.style || "info"]}</div>
          <div className="text-gray-700 text-sm leading-relaxed">{block.text}</div>
        </div>
      );

    case "example-box":
      return (
        <div
          key={index}
          className="mb-10 border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
        >
          <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200/60 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" /> {block.title}
              </h4>
              <p className="text-xs text-gray-500">{block.description}</p>
            </div>
          </div>
          <div className="p-6 bg-white">
            <pre className="text-sm bg-gray-900/5 p-4 rounded-xl overflow-x-auto font-mono text-gray-800 border border-gray-200/60">
              <code>{block.code}</code>
            </pre>
            {block.result && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200/60 rounded-xl">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Résultat :
                </span>
                <div className="mt-1 text-gray-800 font-mono">{block.result}</div>
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
// Rendu d'un exercice (Neon Vercel / Grafspee CSS)
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
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 mb-6 transition-all hover:shadow-[0_8px_30px_rgba(59,130,246,0.06)] hover:border-blue-200/60">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {exercise.type === "multiple-choice" && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)]">
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]">
              <Code className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-semibold mb-5 text-[16px] leading-relaxed">
            {exercise.question}
          </p>

          {exercise.type === "multiple-choice" && exercise.options && (
            <div className="space-y-3 mb-5">
              {exercise.options.map((opt, idx) => {
                const isSelected = selected === opt;
                const isCorrectAnswer = opt === exercise.correctAnswer;
                let className =
                  "block p-4 rounded-2xl border-2 cursor-pointer transition-all bg-white hover:border-blue-300";
                if (submitted) {
                  if (isCorrectAnswer)
                    className +=
                      " border-emerald-500 bg-emerald-50/80 shadow-[0_0_25px_rgba(16,185,129,0.15)]";
                  else if (isSelected && !isCorrectAnswer)
                    className +=
                      " border-red-400 bg-red-50/80 shadow-[0_0_25px_rgba(239,68,68,0.1)]";
                  else className += " border-gray-200 opacity-60";
                } else {
                  className += isSelected
                    ? " border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.15)]"
                    : " border-gray-200";
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
                    <span className="text-gray-800">{opt}</span>
                    {submitted && isCorrectAnswer && (
                      <CheckCheck className="inline ml-2 w-5 h-5 text-emerald-600" />
                    )}
                    {submitted && isSelected && !isCorrectAnswer && (
                      <X className="inline ml-2 w-5 h-5 text-red-600" />
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
                  "px-6 py-3 rounded-2xl border-2 font-semibold transition-all bg-white hover:border-blue-300";
                if (submitted) {
                  if (isCorrectAnswer)
                    className +=
                      " border-emerald-500 bg-emerald-50/80 shadow-[0_0_25px_rgba(16,185,129,0.15)]";
                  else if (isSelected && !isCorrectAnswer)
                    className +=
                      " border-red-400 bg-red-50/80 shadow-[0_0_25px_rgba(239,68,68,0.1)]";
                  else className += " border-gray-200 opacity-60";
                } else {
                  className += isSelected
                    ? " border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.15)]"
                    : " border-gray-200";
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
                className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all outline-none"
                placeholder="Tapez votre réponse..."
                value={selected as string || ""}
                onChange={(e) => !submitted && setSelected(e.target.value)}
                disabled={submitted}
              />
            </div>
          )}

          {exercise.type === "code-practice" && exercise.codeSnippet && (
            <div className="mb-5">
              <pre className="bg-gray-900/5 p-4 rounded-2xl text-sm text-gray-800 font-mono overflow-x-auto border border-gray-200/60">
                <code>{exercise.codeSnippet}</code>
              </pre>
              <textarea
                className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 font-mono text-sm placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all outline-none mt-3"
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
                className="text-sm text-blue-600 hover:text-blue-800 transition flex items-center gap-1.5 font-medium"
                onClick={() => setShowHint(!showHint)}
              >
                <HelpCircle className="w-4 h-4" />
                {showHint ? "Masquer l'indice" : "Afficher l'indice"}
              </button>
              {showHint && (
                <p className="mt-1.5 text-sm text-gray-500 italic bg-gray-50/80 p-3 rounded-2xl border border-gray-200/60">
                  {exercise.hint}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {!submitted && isAnswered && (
              <button
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-2xl transition shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)]"
                onClick={handleSubmit}
              >
                Soumettre la réponse
              </button>
            )}
            {submitted && (
              <div className="flex items-center gap-4 flex-wrap">
                {isCorrect() ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-2 text-lg">
                    <CheckCheck className="w-6 h-6" /> Correct !
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold flex items-center gap-2 text-lg">
                    <X className="w-6 h-6" /> Incorrect. Réessayer ?
                  </span>
                )}
                <button
                  className="px-5 py-2 text-sm border-2 border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition font-medium text-gray-600"
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
            <div className="mt-5 p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-200/60 rounded-2xl shadow-[inset_0_2px_10px_rgba(59,130,246,0.05)]">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-blue-800">Explication :</span>{" "}
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
// Composant principal : LessonViewer (Grafspee CSS Style)
// -------------------------------
export const LessonViewer: React.FC = () => {
  const [currentLessonId, setCurrentLessonId] = useState<string>(allLessonIds[0] || "");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const lesson = getLessonById(currentLessonId);
  const currentIndex = allLessonIds.indexOf(currentLessonId);
  const prevId = currentIndex > 0 ? allLessonIds[currentIndex - 1] : null;
  const nextId = currentIndex < allLessonIds.length - 1 ? allLessonIds[currentIndex + 1] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  if (!lesson) {
    return <div className="p-8 text-center text-gray-500">Leçon introuvable.</div>;
  }

  const totalLessons = allLessonIds.length;
  const progress = ((currentIndex + 1) / totalLessons) * 100;

  const difficultyMap = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 flex flex-col font-sans antialiased">
      {/* -------------------------------
          HEADER — Glassmorphism + Neon (Grafspee CSS)
      ------------------------------- */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-2xl hover:bg-gray-100 transition lg:hidden"
              aria-label="Basculer la navigation"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.4)]">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                  {fullHtmlCourse.structure.title}
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">{lesson.title}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-gray-400 font-mono">
              {currentIndex + 1} / {totalLessons}
            </span>
            <div className="w-32 h-1.5 bg-gray-200/80 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-400 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full relative">
        {/* -------------------------------
            SIDEBAR — White with subtle glow (Grafspee CSS)
        ------------------------------- */}
        <aside
          className={`
            fixed inset-0 z-40 lg:relative lg:inset-auto lg:z-0
            w-[280px] lg:w-72 bg-white border-r border-gray-200/80
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            flex flex-col overflow-y-auto shadow-2xl lg:shadow-none
          `}
        >
          <div className="p-5 border-b border-gray-200/80 flex items-center justify-between lg:justify-start">
            <h2 className="font-bold text-gray-700 flex items-center gap-2.5 text-sm tracking-wide uppercase">
              <List className="w-4 h-4 text-blue-500" />
              Chapitres
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-2xl hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-4">
            {courseStructure.chapters.map((chapter) => (
              <div key={chapter.id} className="space-y-1">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 pt-1">
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
                            ? "bg-gradient-to-r from-blue-50/80 to-purple-50/80 text-blue-700 font-semibold shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] border border-blue-200/40"
                            : "hover:bg-gray-50 text-gray-600"
                        }
                      `}
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="truncate">{l.title}</span>
                      {l.exercises.length > 0 && (
                        <span
                          className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-blue-200/80 text-blue-700 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                              : "bg-gray-100 text-gray-500"
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

          <div className="p-4 border-t border-gray-200/80 text-xs text-gray-400 flex items-center justify-between">
            <span>Total {totalLessons} leçons</span>
            <GraduationCap className="w-4 h-4 text-blue-400" />
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* -------------------------------
            MAIN CONTENT
        ------------------------------- */}
        <main className="flex-1 w-full min-w-0 px-6 py-10 sm:px-10 lg:px-14">
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
              <span>Leçon {currentIndex + 1}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  lesson.difficulty === "beginner"
                    ? "bg-emerald-100 text-emerald-700"
                    : lesson.difficulty === "intermediate"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {difficultyMap[lesson.difficulty]}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {lesson.estimatedMinutes} min
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {lesson.title}
            </h2>
            <p className="text-gray-500 mt-2 text-lg leading-relaxed max-w-3xl">
              {lesson.description}
            </p>
            {lesson.dependencies && lesson.dependencies.length > 0 && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
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
            <div className="mt-12 p-6 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-200/60 rounded-3xl shadow-[0_8px_30px_rgba(59,130,246,0.06)]">
              <h3 className="font-extrabold text-blue-900 flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-blue-500" /> Points clés à retenir
              </h3>
              <ul className="mt-4 space-y-2.5 list-disc list-inside text-gray-700">
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
              <h3 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
                Exercices pratiques
              </h3>
              {lesson.exercises.map((ex) => (
                <ExerciseRenderer key={ex.id} exercise={ex} />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200/80 pt-8">
            <div>
              {prevId && (
                <button
                  onClick={() => setCurrentLessonId(prevId)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border-2 border-gray-200 bg-white rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>
              )}
            </div>
            <div>
              {nextId ? (
                <button
                  onClick={() => setCurrentLessonId(nextId)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-2xl transition shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)]"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-sm text-gray-400 font-medium flex items-center gap-2">
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