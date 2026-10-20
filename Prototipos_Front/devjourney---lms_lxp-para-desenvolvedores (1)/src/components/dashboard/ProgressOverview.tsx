import React from 'react';
import { ArrowRight, CheckCircle2, Clock, GitFork, PlayCircle, Trophy, BookOpen } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { ProgressBar } from '../common/ProgressBar';

export const ProgressOverview: React.FC = () => {
  const {
    activeTrack,
    getTrackProgressPercent,
    getModuleStatus,
    completedLessonIds,
    quizResults,
    setCurrentTab,
    getNextRecommendedLesson,
    setActiveLesson
  } = useLMS();

  const progressPercent = getTrackProgressPercent(activeTrack.id);
  const nextLessonData = getNextRecommendedLesson();

  // Metrics calculation
  const totalModules = activeTrack.modules?.length || 0;
  const completedModulesCount = activeTrack.modules?.filter(
    (m) => getModuleStatus(m) === 'completed'
  ).length || 0;

  const passedQuizzesCount = Object.values(quizResults).filter((q) => q.passed).length;
  const totalCompletedLessons = completedLessonIds.length;

  const handleContinueStudy = () => {
    if (nextLessonData) {
      setActiveLesson(nextLessonData.module.id, nextLessonData.lesson.id);
      setCurrentTab('player');
    } else {
      setCurrentTab('skill-tree');
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Hero Track Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Clean unboxed metadata with dot separators */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Trilha Principal Ativa</span>
              <span aria-hidden="true">·</span>
              <span>{activeTrack.category}</span>
              <span aria-hidden="true">·</span>
              <span>Nível {activeTrack.level}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{activeTrack.totalHours} horas estimadas</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
              {activeTrack.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
              {activeTrack.description}
            </p>

            {/* Progress Bar with quantitative metrics */}
            <div className="mt-6 max-w-xl">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                <span>Progresso Total da Formação</span>
                <span className="font-mono tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                  {progressPercent}%
                </span>
              </div>
              <ProgressBar value={progressPercent} showPercentage={false} size="md" color="primary" />
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono tabular-nums">
                <span>{completedModulesCount} de {totalModules} módulos concluídos</span>
                <span aria-hidden="true">·</span>
                <span>{totalCompletedLessons} aulas finalizadas</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleContinueStudy}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              <PlayCircle className="w-4.5 h-4.5" />
              <span>Continuar Aprendizado</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentTab('skill-tree')}
              className="px-6 py-3 text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <GitFork className="w-4 h-4 text-indigo-500" />
              <span>Ver Árvore de Habilidades</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quantitative Metric Cards (Single elevation depth, tabular numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Módulos Concluídos</span>
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {completedModulesCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {totalModules}</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            {totalModules - completedModulesCount} módulos restantes
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Aulas Finalizadas</span>
            <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalCompletedLessons}
            </span>
            <span className="text-xs text-slate-400">aulas</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Práticas e teóricas
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Avaliações Superadas</span>
            <Trophy className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {passedQuizzesCount}
            </span>
            <span className="text-xs text-slate-400">quizzes</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
            Média de 92% de acertos
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Tempo de Estudo</span>
            <Clock className="w-4.5 h-4.5 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              28h
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {activeTrack.totalHours}h</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Ritmo recomendado: 8h/semana
          </span>
        </div>
      </div>
    </div>
  );
};
