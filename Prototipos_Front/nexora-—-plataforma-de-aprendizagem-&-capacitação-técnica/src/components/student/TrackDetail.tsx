/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Clock,
  Award,
  CheckCircle2,
  BookOpen,
  Code2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Database,
  Server,
  FolderGit2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Track, Module, Stage } from '../../types';
import { ApiService } from '../../services/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface TrackDetailProps {
  onNavigate: (section: string, payload?: any) => void;
  trackId?: string;
}

export const TrackDetail: React.FC<TrackDetailProps> = ({
  onNavigate,
  trackId = 'track-interns-dev',
}) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-01': true,
    'mod-02': true,
    'mod-03': true,
    'mod-04': true,
    'mod-05': true,
  });

  useEffect(() => {
    async function load() {
      const data = await ApiService.getTrackById(trackId);
      if (data) setTrack(data);
    }
    load();
  }, [trackId]);

  if (!track) return null;

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const stageIcons = {
    reading: <BookOpen className="w-4 h-4 text-blue-600" />,
    quiz: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    sql_challenge: <Database className="w-4 h-4 text-emerald-600" />,
    backend_challenge: <Server className="w-4 h-4 text-indigo-600" />,
    frontend_challenge: <Code2 className="w-4 h-4 text-violet-600" />,
    project: <FolderGit2 className="w-4 h-4 text-amber-600" />,
  };

  const handleStageClick = (stage: Stage) => {
    if (stage.type === 'reading' || stage.type === 'quiz') {
      onNavigate('reader', { stageId: stage.id, trackId: track.id });
    } else if (stage.type === 'sql_challenge') {
      onNavigate('challenge_sql');
    } else if (stage.type === 'backend_challenge') {
      onNavigate('challenge_backend');
    } else if (stage.type === 'frontend_challenge') {
      onNavigate('challenge_frontend');
    } else if (stage.type === 'project') {
      onNavigate('projects');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Track Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="font-semibold text-indigo-700">{track.area}</span>
          <span aria-hidden="true">·</span>
          <span>Nível {track.level}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {track.estimatedHours} horas estimadas
          </span>
          <span aria-hidden="true">·</span>
          <span>Versão {track.version}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
          {track.title}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-3xl">
          {track.fullDescription}
        </p>

        {/* Progress bar banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
              <span>Seu Progresso na Trilha</span>
              <span className="font-mono text-indigo-600">60% Concluído</span>
            </div>
            <ProgressBar value={60} showPercent={false} size="md" />
            <p className="text-[11px] text-slate-500 mt-1.5">
              3 módulos finalizados. Atividade atual: Desafio de API REST Backend.
            </p>
          </div>
          <Button
            onClick={() => onNavigate('challenge_backend')}
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continuar de Onde Parou
          </Button>
        </div>
      </div>

      {/* Grid: Objectives & Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Objetivos de Aprendizagem
          </h2>
          <ul className="space-y-2 text-xs text-slate-600">
            {track.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold shrink-0">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="md">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Pré-requisitos e Critérios
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 mb-4">
            {track.prerequisites.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-slate-400 font-bold shrink-0">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-xs text-indigo-900">
            <span className="font-semibold block mb-0.5">Certificação Oficial:</span>
            A certificação requer a aprovação nos 3 laboratórios práticos e a entrega do projeto integrador final validado pela mentora.
          </div>
        </Card>
      </div>

      {/* Modules Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Módulos & Etapas da Trilha</h2>
          <span className="text-xs text-slate-500">5 módulos estruturados</span>
        </div>

        <div className="space-y-3">
          {track.modules.map((mod, index) => {
            const isExpanded = expandedModules[mod.id] ?? true;
            const completedStages = mod.stages.filter((s) => s.isCompleted).length;
            const isAllCompleted = completedStages === mod.stages.length;

            return (
              <div
                key={mod.id}
                className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs"
              >
                {/* Module Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isAllCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {isAllCompleted ? '✓' : index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{mod.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">
                      {completedStages}/{mod.stages.length} concluídas
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Stages List */}
                {isExpanded && (
                  <div className="px-5 pb-4 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                    {mod.stages.map((stage) => {
                      return (
                        <div
                          key={stage.id}
                          onClick={() => handleStageClick(stage)}
                          className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-white border border-slate-200 shrink-0">
                              {stageIcons[stage.type]}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                  {stage.title}
                                </h4>
                                {stage.isCompleted && (
                                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                                    Concluída
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {stage.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-4">
                            <span className="text-[11px] text-slate-400 font-mono">
                              {stage.durationMinutes} min
                            </span>
                            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              {stage.isCompleted ? 'Revisar' : 'Acessar'}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
