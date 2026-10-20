import React from 'react';
import { PlayCircle, Clock, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';

export const RecommendedNext: React.FC = () => {
  const {
    getNextRecommendedLesson,
    setActiveLesson,
    setCurrentTab,
    openQuizModal,
    activeTrack,
    getModuleStatus,
    quizResults
  } = useLMS();

  const next = getNextRecommendedLesson();

  // If there's an unlocked module whose lessons are done but quiz is pending, prompt the quiz!
  const pendingQuizModule = activeTrack.modules?.find(m => {
    const status = getModuleStatus(m);
    const hasPassed = quizResults[m.id]?.passed;
    return status !== 'locked' && !hasPassed;
  });

  if (!next && !pendingQuizModule) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-6">
        <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Parabéns! Todas as aulas disponíveis foram finalizadas
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
          Você concluiu com sucesso todo o conteúdo liberado nesta trilha. Acesse a Árvore de Habilidades ou faça a avaliação final!
        </p>
      </div>
    );
  }

  const handleStartLesson = () => {
    if (next) {
      setActiveLesson(next.module.id, next.lesson.id);
      setCurrentTab('player');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Próximo Passo Recomendado
        </h2>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          Retomar Estudo
        </span>
      </div>

      {next ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{next.module.title}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{next.lesson.type}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {next.lesson.durationMinutes} min
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {next.lesson.title}
            </h3>
          </div>

          <button
            onClick={handleStartLesson}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer shadow-sm"
          >
            <span>Assistir Agora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

      {/* If there is a pending module quiz to unlock further progress */}
      {pendingQuizModule && (
        <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-950 dark:text-amber-200">
                Avaliação de Desbloqueio: {pendingQuizModule.quiz.title}
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                Acerte 70% ou mais para liberar o próximo módulo na Árvore de Habilidades!
              </p>
            </div>
          </div>

          <button
            onClick={() => openQuizModal(pendingQuizModule)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-lg transition-colors shrink-0 whitespace-nowrap cursor-pointer"
          >
            Fazer Avaliação
          </button>
        </div>
      )}
    </div>
  );
};
