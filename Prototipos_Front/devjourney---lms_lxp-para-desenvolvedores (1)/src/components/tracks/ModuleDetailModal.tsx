import React from 'react';
import { CheckCircle2, Circle, Clock, Lock, PlayCircle, Trophy, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { Module } from '../../types/lms';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';

interface ModuleDetailModalProps {
  module: Module | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  module,
  isOpen,
  onClose
}) => {
  const {
    getModuleStatus,
    completedLessonIds,
    toggleLessonCompleted,
    quizResults,
    openQuizModal,
    setActiveLesson,
    setCurrentTab
  } = useLMS();

  if (!module) return null;

  const status = getModuleStatus(module);
  const isLocked = status === 'locked';
  const quizResult = quizResults[module.id];
  const isQuizPassed = quizResult?.passed === true;

  const completedLessons = module.lessons.filter(l => completedLessonIds.includes(l.id)).length;
  const progressPercent = module.lessons.length > 0
    ? Math.round((completedLessons / module.lessons.length) * 100)
    : 0;

  const handleStartLesson = (lessonId: string) => {
    setActiveLesson(module.id, lessonId);
    onClose();
    setCurrentTab('player');
  };

  const handleTakeQuiz = () => {
    onClose();
    openQuizModal(module);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={module.title}
      subtitle={`Nível ${module.tier.toUpperCase()} · ${module.estimatedHours}h estimadas · ${module.lessons.length} aulas`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Module Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {module.description}
        </p>

        {/* Skills Acquired List */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Competências Desenvolvidas
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {module.skillsAcquired.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Locked Alert if locked */}
        {isLocked && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Módulo Bloqueado</strong>
              Para desbloquear este módulo, você deve atingir a nota mínima de 70% na avaliação dos módulos pré-requisitos anteriores.
            </div>
          </div>
        )}

        {/* Progress in this module */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
            <span>Progresso das Aulas</span>
            <span className="font-mono tabular-nums">{completedLessons} de {module.lessons.length} ({progressPercent}%)</span>
          </div>
          <ProgressBar value={progressPercent} showPercentage={false} size="sm" color="primary" />
        </div>

        {/* Lessons List */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Índice de Aulas
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {module.lessons.map((lesson, idx) => {
              const isDone = completedLessonIds.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className="p-3.5 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => !isLocked && toggleLessonCompleted(lesson.id)}
                      disabled={isLocked}
                      className="text-slate-400 hover:text-emerald-600 disabled:opacity-40 transition-colors"
                      title={isDone ? 'Marcar como não concluída' : 'Marcar como concluída'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                        Aula {idx + 1}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {lesson.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono tabular-nums flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.durationMinutes}m
                    </span>

                    <button
                      onClick={() => handleStartLesson(lesson.id)}
                      disabled={isLocked}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Abrir</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Quiz Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-4.5 h-4.5 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {module.quiz.title}
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nota de corte: {module.quiz.passingScorePercent}% · Recompensa: +{module.quiz.rewardXP} XP
            </p>
            {isQuizPassed && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aprovado ({quizResult.scorePercent}%)
              </span>
            )}
          </div>

          <button
            onClick={handleTakeQuiz}
            disabled={isLocked}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 ${
              isQuizPassed
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isQuizPassed ? 'Refazer Quiz' : 'Iniciar Avaliação'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
