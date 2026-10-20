/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Code2,
  Database,
  Server,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface StudentDashboardProps {
  onNavigate: (section: string, payload?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Contextual Greeting & Priority Action Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Trilha Ativa: Formação para Estagiários de Engenharia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Olá, {currentUser?.name.split(' ')[0]}! Pronto para o próximo desafio?
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
            Você já concluiu com êxito os módulos de Git e Banco de Dados SQL. Sua próxima ação recomendada é implementar a suite de testes da API REST no Módulo 3.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => onNavigate('challenge_backend')}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 font-semibold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continuar: Desafio de API Backend
            </Button>
            <Button
              onClick={() => onNavigate('track_detail')}
              variant="outline"
              size="lg"
              className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              Ver Roteiro da Trilha
            </Button>
          </div>
        </div>

        {/* Ambient subtle decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Progresso na Trilha</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 mb-2">60%</div>
            <ProgressBar value={60} showPercent={false} size="sm" />
            <p className="text-[11px] text-slate-500 mt-2">3 de 5 módulos finalizados</p>
          </div>
        </Card>

        <Card padding="md" className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Competências Validadas</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 mb-2">2 de 5</div>
            <p className="text-xs text-slate-600">
              <span className="text-emerald-700 font-semibold">SQL</span> e{' '}
              <span className="text-emerald-700 font-semibold">Git</span> validadas
            </p>
            <p className="text-[11px] text-slate-500 mt-1">2 em desenvolvimento</p>
          </div>
        </Card>

        <Card padding="md" className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Desafios Práticos</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 mb-2">1 / 3</div>
            <p className="text-xs text-slate-600">SQL aprovado com 100/100</p>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">Backend em andamento</p>
          </div>
        </Card>

        <Card padding="md" className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Certificação</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 mb-2">40h</div>
            <p className="text-xs text-slate-600">Carga horária total do programa</p>
            <p className="text-[11px] text-slate-500 mt-1">Emissão após aprovação do projeto</p>
          </div>
        </Card>
      </div>

      {/* 3. Main Actionable Workspace: 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Active track roadmap preview & Next activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Track Roadmap */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Roteiro da Trilha de Estagiários</h2>
                <p className="text-xs text-slate-500">Acompanhe a sua evolução módulo a módulo</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('track_detail')}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Ver Grade Completa
              </Button>
            </div>

            <div className="space-y-3">
              {/* Module 1: Concluído */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">
                      Módulo 1: Fundamentos de Engenharia & Git
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>2 etapas</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">100% concluído</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Concluído</span>
              </div>

              {/* Module 2: Concluído */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">
                      Módulo 2: Banco de Dados Relacional & SQL
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>2 etapas</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">Desafio SQL Aprovado</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('challenge_sql')}
                  className="text-xs"
                >
                  Ver Solução
                </Button>
              </div>

              {/* Module 3: Em Andamento (Ativo) */}
              <div className="p-4 rounded-xl border-2 border-indigo-500/40 bg-indigo-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">
                        Módulo 3: APIs RESTful & Back-end com Node.js
                      </h3>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded">
                        EM ANDAMENTO
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                      <span>Etapa 2 de 2: Laboratório de API REST</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-indigo-600 font-medium">Ação prioritária</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onNavigate('challenge_backend')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Continuar
                </Button>
              </div>

              {/* Module 4: Disponível */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between opacity-85">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-800">
                      Módulo 4: Interfaces Modernas & Front-end com React
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>2 etapas</span>
                      <span aria-hidden="true">·</span>
                      <span>Disponível após o módulo 3</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('challenge_frontend')}
                  className="text-xs"
                >
                  Abrir Desafio
                </Button>
              </div>

              {/* Module 5: Projeto Final */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between opacity-85">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-800">
                      Módulo 5: Projeto Integrador Final & Certificação
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>1 entregável aprovado</span>
                      <span aria-hidden="true">·</span>
                      <span>1 entregável em revisão</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('projects')}
                  className="text-xs"
                >
                  Ver Entregas
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Access to the 3 Technical Labs */}
          <Card padding="lg">
            <h2 className="text-base font-bold text-slate-900 mb-1">Laboratórios Técnicos da Trilha</h2>
            <p className="text-xs text-slate-500 mb-4">
              Cada laboratório conta com ambiente dedicado, enunciados detalhados e avaliação automatizada
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => onNavigate('challenge_sql')}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer bg-slate-50/40"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 w-fit mb-3">
                  <Database className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">1. Laboratório SQL</div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Esquemas de clientes e pedidos, executor de consultas analíticas e agregações.
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold">Nota 100/100</span>
                  <span className="text-indigo-600 font-medium">Revisar →</span>
                </div>
              </div>

              <div
                onClick={() => onNavigate('challenge_backend')}
                className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/20 shadow-xs cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-indigo-600 text-white w-fit mb-3">
                  <Server className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">2. Laboratório Backend</div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  API REST de Ordens de Serviço, contratos HTTP, idempotência e runner de testes.
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-amber-700 font-semibold">Em Andamento</span>
                  <span className="text-indigo-600 font-bold">Executar →</span>
                </div>
              </div>

              <div
                onClick={() => onNavigate('challenge_frontend')}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer bg-slate-50/40"
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 w-fit mb-3">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">3. Laboratório Frontend</div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Componente de ordens responsivo, foco por teclado e conformidade WCAG 2.2 AA.
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Próximo</span>
                  <span className="text-indigo-600 font-medium">Iniciar →</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Supervisor feedback, Technical Library quick references */}
        <div className="space-y-6">
          {/* Supervisor Card */}
          <Card padding="md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Supervisão Técnica
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256"
                alt="Mariana Ramos"
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Mariana Ramos</h4>
                <p className="text-[11px] text-slate-500">Tech Lead & Mentora</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed mb-3">
              <span className="font-semibold text-slate-900 block mb-1">Último Feedback (17/10):</span>
              "Excelente modelagem de banco na Etapa 1 do projeto! A normalização até a 3FN e os índices compostos ficaram impecáveis."
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('projects')}
              className="w-full text-xs"
            >
              Consultar Entregas do Projeto
            </Button>
          </Card>

          {/* Quick Technical References */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Biblioteca Técnica
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('library')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Ver tudo
              </button>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => onNavigate('library')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                    Manual de Boas Práticas para Git
                  </h4>
                  <span className="text-[10px] text-slate-400">12 min</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  Convenções de commits, branchs e code review.
                </p>
              </div>

              <div
                onClick={() => onNavigate('library')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                    Guia Rápido de SQL & Índices
                  </h4>
                  <span className="text-[10px] text-slate-400">8 min</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  INNER JOIN, LEFT JOIN, cláusula HAVING e otimização.
                </p>
              </div>

              <div
                onClick={() => onNavigate('library')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                    Diretrizes WCAG 2.2 AA para Devs
                  </h4>
                  <span className="text-[10px] text-slate-400">15 min</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  Contraste, foco visível e atributos WAI-ARIA.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
