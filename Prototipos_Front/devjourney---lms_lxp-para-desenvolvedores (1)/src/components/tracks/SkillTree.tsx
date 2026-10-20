import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  PlayCircle,
  Trophy,
  GitBranch,
  Terminal,
  Layout,
  Code2,
  Boxes,
  Server,
  Database,
  Rocket,
  Info,
  ChevronRight
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { Module, ModuleStatus } from '../../types/lms';
import { ModuleDetailModal } from './ModuleDetailModal';
import { ProgressBar } from '../common/ProgressBar';

export const SkillTree: React.FC = () => {
  const {
    activeTrack,
    getModuleStatus,
    completedLessonIds,
    quizResults,
    openQuizModal,
    startOrContinueModule,
    getTrackProgressPercent
  } = useLMS();

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return Terminal;
      case 'GitBranch':
        return GitBranch;
      case 'Layout':
        return Layout;
      case 'Code2':
        return Code2;
      case 'Boxes':
        return Boxes;
      case 'Server':
        return Server;
      case 'Database':
        return Database;
      case 'Rocket':
        return Rocket;
      default:
        return Code2;
    }
  };

  const modules = activeTrack.modules || [];
  const basicModules = modules.filter((m) => m.tier === 'basic');
  const intermediateModules = modules.filter((m) => m.tier === 'intermediate');
  const advancedModules = modules.filter((m) => m.tier === 'advanced');

  const overallProgress = getTrackProgressPercent(activeTrack.id);

  const renderModuleCard = (module: Module) => {
    const status: ModuleStatus = getModuleStatus(module);
    const IconComponent = getIcon(module.iconName);
    const quizResult = quizResults[module.id];
    const isQuizPassed = quizResult?.passed === true;

    const completedLessons = module.lessons.filter((l) =>
      completedLessonIds.includes(l.id)
    ).length;
    const progress = module.lessons.length > 0
      ? Math.round((completedLessons / module.lessons.length) * 100)
      : 0;

    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';
    const isInProgress = status === 'in_progress';

    return (
      <div
        key={module.id}
        className={`relative rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between ${
          isLocked
            ? 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75'
            : isCompleted
            ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
            : isInProgress
            ? 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm'
        }`}
      >
        {/* Top Node Indicator & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isLocked
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  : isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  : isInProgress
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {isLocked ? (
                <Lock className="w-5 h-5 text-slate-400" />
              ) : (
                <IconComponent className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Módulo {module.order}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{module.tier}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {module.title}
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                Bloqueado
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Concluído
              </span>
            )}
            {isInProgress && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                Em Progresso
              </span>
            )}
            {status === 'unlocked' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Disponível
              </span>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {module.description}
        </p>

        {/* Skills pill list */}
        <div className="flex flex-wrap gap-1 mb-4">
          {module.skillsAcquired.slice(0, 3).map((skill, sIdx) => (
            <span
              key={sIdx}
              className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Locked Prerequisite warning */}
        {isLocked && (
          <div className="mb-4 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Requer aprovação mínima de 70% no módulo anterior</span>
          </div>
        )}

        {/* Progress bar inside card */}
        {!isLocked && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span>{completedLessons} de {module.lessons.length} aulas</span>
              <span className="font-mono tabular-nums">{progress}%</span>
            </div>
            <ProgressBar value={progress} showPercentage={false} size="sm" color={isCompleted ? 'emerald' : 'primary'} />
          </div>
        )}

        {/* Card Actions */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setSelectedModule(module)}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Ementa</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            {!isLocked && (
              <>
                <button
                  onClick={() => openQuizModal(module)}
                  className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                    isQuizPassed
                      ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-100'
                  }`}
                  title={isQuizPassed ? `Quiz aprovado com ${quizResult.scorePercent}%` : 'Realizar Quiz de Desbloqueio'}
                >
                  <Trophy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => startOrContinueModule(module)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Revisar' : isInProgress ? 'Continuar' : 'Iniciar'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Árvore de Habilidades & Progressão Adaptativa</span>
              <span aria-hidden="true">·</span>
              <span>Estrutura Pedagógica com Desbloqueio por Desempenho</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Skill Tree: {activeTrack.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Cada módulo desenvolve competências práticas comprovadas por meio de quizzes e exercícios com código. Módulos avançados requerem nota mínima de 70% nas avaliações anteriores para garantir seu domínio gradual (Mastery Learning).
            </p>
          </div>

          {/* Quick Stats Pillar */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 min-w-[200px] shrink-0 text-center sm:text-left">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Progresso da Trilha</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 my-1">
              {overallProgress}%
            </div>
            <ProgressBar value={overallProgress} showPercentage={false} size="sm" color="primary" />
          </div>
        </div>
      </div>

      {/* Tier 1: Fundamentos & Ferramental (Básico) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
              01
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Fase 1: Fundamentos da Computação & Versionamento
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lógica pura, pensamento computacional, terminal e Git em equipe
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">3 módulos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {basicModules.map(renderModuleCard)}
        </div>
      </section>

      {/* Connector Divider */}
      <div className="flex items-center justify-center my-2">
        <div className="flex flex-col items-center gap-1 text-slate-300 dark:text-slate-700">
          <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Requer Quizzes Aprovados
          </span>
          <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>

      {/* Tier 2: Linguagens & Frameworks (Intermediário) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
              02
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Fase 2: Desenvolvimento de Aplicações & Frameworks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                JavaScript ES6+, TypeScript, React moderno e APIs RESTful com Express
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">3 módulos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {intermediateModules.map(renderModuleCard)}
        </div>
      </section>

      {/* Connector Divider */}
      <div className="flex items-center justify-center my-2">
        <div className="flex flex-col items-center gap-1 text-slate-300 dark:text-slate-700">
          <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Fase de Consolidação
          </span>
          <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>

      {/* Tier 3: Bancos de Dados & Projeto Integrador (Avançado) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-xs">
              03
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Fase 3: Bancos de Dados & Projeto Final Integrador
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Modelagem SQL avançada, testes automatizados, CI/CD e Portfólio de Júnior
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">2 módulos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advancedModules.map(renderModuleCard)}
        </div>
      </section>

      {/* Module Detail Modal */}
      <ModuleDetailModal
        module={selectedModule}
        isOpen={!!selectedModule}
        onClose={() => setSelectedModule(null)}
      />
    </div>
  );
};
