/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Database,
  Server,
  Code2,
  FolderGit2,
} from 'lucide-react';
import { Competency } from '../../types';
import { ApiService } from '../../services/api';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { Badge } from '../ui/Badge';

export const CompetenciesMatrix: React.FC = () => {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const data = await ApiService.getCompetencies();
      setCompetencies(data);
    }
    load();
  }, []);

  const domainTabs = [
    { id: 'all', label: 'Todas as Competências' },
    { id: 'database', label: 'Banco de Dados & SQL' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'frontend', label: 'Frontend & A11y' },
    { id: 'engineering', label: 'Engenharia & Git' },
  ];

  const domainIcons = {
    database: <Database className="w-4 h-4 text-emerald-600" />,
    backend: <Server className="w-4 h-4 text-indigo-600" />,
    frontend: <Code2 className="w-4 h-4 text-violet-600" />,
    engineering: <FolderGit2 className="w-4 h-4 text-blue-600" />,
    soft_skills: <Sparkles className="w-4 h-4 text-amber-600" />,
  };

  const filtered = competencies.filter(
    (c) => selectedDomain === 'all' || c.domain === selectedDomain
  );

  const validatedCount = competencies.filter((c) => c.status === 'validated').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>AVALIAÇÃO BASEADA EM COMPETÊNCIAS</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Matriz de Competências</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Acompanhe cada competência técnica comprovada na prática através de desafios aprovados, exercícios práticos e code reviews da supervisão.
        </p>
      </div>

      {/* Progress banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Status da Certificação Técnica
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {validatedCount} de {competencies.length}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Competências Validadas</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 max-w-sm">
          A conclusão da trilha de estagiários requer a validação de todas as 5 competências essenciais pelo supervisor.
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs
        items={domainTabs}
        activeId={selectedDomain}
        onChange={setSelectedDomain}
        variant="segmented"
      />

      {/* Competencies List */}
      <div className="space-y-4">
        {filtered.map((comp) => {
          const isValidated = comp.status === 'validated';
          const isInProgress = comp.status === 'in_progress';

          return (
            <Card
              key={comp.id}
              padding="lg"
              className={`border transition-all ${
                isValidated
                  ? 'border-emerald-200 bg-white hover:border-emerald-300'
                  : isInProgress
                  ? 'border-indigo-200 bg-white hover:border-indigo-300'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                      {domainIcons[comp.domain]}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {comp.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pl-8">
                    {comp.description}
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <Badge
                    variant={isValidated ? 'success' : isInProgress ? 'info' : 'neutral'}
                    icon={isValidated ? <CheckCircle2 className="w-3.5 h-3.5" /> : undefined}
                  >
                    {isValidated
                      ? 'Validada'
                      : isInProgress
                      ? 'Em Desenvolvimento'
                      : 'Não Avaliada'}
                  </Badge>

                  {isValidated && comp.lastValidatedAt && (
                    <p className="text-[11px] text-slate-500 mt-2">
                      Validado em {comp.lastValidatedAt} por <br />
                      <span className="font-semibold text-slate-700">{comp.validatedBy}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{comp.evidenceCount} evidências registradas no sistema</span>
                <span className="font-mono text-indigo-600 font-semibold">Trilha Estagiários Dev</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
