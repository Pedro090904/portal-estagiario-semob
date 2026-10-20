/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  Eye,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Play,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { FRONTEND_CHALLENGE_DATA } from '../../services/data/seedData';
import { ApiService } from '../../services/api';
import { SubmissionEvaluation } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';

interface FrontendChallengeLabProps {
  onNavigate: (section: string, payload?: any) => void;
}

export const FrontendChallengeLab: React.FC<FrontendChallengeLabProps> = ({ onNavigate }) => {
  const challenge = FRONTEND_CHALLENGE_DATA;
  const [activeTab, setActiveTab] = useState<'sandbox' | 'requirements'>('sandbox');
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Interactive sandbox state for the student to interact with the accessible component
  const [filter, setFilter] = useState<'all' | 'high' | 'in_progress' | 'completed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('ord-1');

  // Evaluation states
  const [evaluation, setEvaluation] = useState<SubmissionEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { showSuccess, showError } = useNotification();

  const sampleOrders = [
    {
      id: 'ord-1',
      title: 'Substituição de Switch de Rede no Rack A4',
      client: 'TechVibe Soluções',
      priority: 'alta',
      status: 'em_execucao',
      statusLabel: 'Em Execução',
      estimatedHours: 3.5,
      description: 'Switch principal com perda de pacotes intermitente. Requer substituição a frio durante janela de manutenção autorizada.',
      checklist: ['Desligar alimentação do PDU', 'Identificar cabeamento de fibra', 'Restaurar backup de configuração'],
    },
    {
      id: 'ord-2',
      title: 'Manutenção Preventiva de No-Break Hospitalar',
      client: 'BioSaúde Integrada',
      priority: 'alta',
      status: 'aberta',
      statusLabel: 'Aguardando Início',
      estimatedHours: 2.0,
      description: 'Inspeção de baterias estáticas e calibração de tensão de entrada.',
      checklist: ['Verificar integridade física das células', 'Medir tensão nos bornes'],
    },
    {
      id: 'ord-3',
      title: 'Configuração de VPN Segura para Filial',
      client: 'FinSeguros Capital',
      priority: 'media',
      status: 'concluida',
      statusLabel: 'Concluída',
      estimatedHours: 5.0,
      description: 'Túnel IPsec estabelecido e testado com tráfego simultâneo.',
      checklist: ['Definir chaves pré-compartilhadas', 'Validar regras de firewall'],
    },
  ];

  const filteredOrders = sampleOrders.filter((o) => {
    if (filter === 'high') return o.priority === 'alta';
    if (filter === 'in_progress') return o.status === 'em_execucao';
    if (filter === 'completed') return o.status === 'concluida';
    return true;
  });

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await ApiService.evaluateFrontendChallenge({
        hasAriaExpanded: true,
        hasKeyboardNav: true,
        hasWcagContrast: true,
        hasSegmentedControl: true,
        hasStatusBadgeWithIcon: true,
      });
      setEvaluation(res);
      showSuccess(
        'Inspeção Concluída!',
        'Seu componente cumpriu 100% dos requisitos de acessibilidade e responsividade.'
      );
    } catch (e) {
      showError('Erro ao executar inspeção');
    } finally {
      setIsEvaluating(false);
    }
  };

  const viewportWidths = {
    desktop: 'max-w-full',
    tablet: 'max-w-2xl mx-auto',
    mobile: 'max-w-sm mx-auto',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-700 mb-1">
            <Code2 className="w-4 h-4" />
            <span>LABORATÓRIO PRÁTICO · FRONTEND MODERNO & ACESSIBILIDADE WCAG</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{challenge.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dificuldade: {challenge.difficulty} · Duração estimada: {challenge.estimatedMinutes} min · Conformidade WCAG 2.2 Nível AA
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => onNavigate('challenge_backend')}
            variant="outline"
            size="sm"
          >
            ← Desafio Backend
          </Button>
          <Button
            onClick={() => onNavigate('projects')}
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Próximo: Projeto Integrador
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          items={[
            { id: 'sandbox', label: '1. Sandbox Interativo & Validação' },
            { id: 'requirements', label: '2. Requisitos WCAG & Especificações' },
          ]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
          variant="segmented"
        />

        {activeTab === 'sandbox' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setDeviceViewport('desktop')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                deviceViewport === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Visualização Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceViewport('tablet')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                deviceViewport === 'tablet' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Visualização Tablet (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceViewport('mobile')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                deviceViewport === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Visualização Mobile (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {activeTab === 'requirements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="lg" className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Requisitos Visuais e de Interação</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {challenge.problemStatement}
            </p>

            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 mb-2">Critérios Funcionais:</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {challenge.functionalRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-violet-600 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Critérios de Acessibilidade WCAG 2.2 AA</h2>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Critério 1.4.1 (Uso de Cor):</span>
                  A cor não é utilizada como único meio visual de transmitir informação, indicar uma ação ou distinguir um elemento.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Critério 2.1.1 (Teclado):</span>
                  Toda a funcionalidade do conteúdo pode ser operada através de uma interface de teclado sem requisitos de tempo específicos.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Critério 2.4.7 (Foco Visível):</span>
                  Qualquer interface operável por teclado possui um modo de operação onde o indicador de foco do teclado é visível.
                </div>
              </li>
            </ul>

            <Button
              onClick={() => setActiveTab('sandbox')}
              size="md"
              className="w-full mt-4"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Testar no Sandbox Interativo
            </Button>
          </Card>
        </div>
      )}

      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Sandbox de Demonstração e Verificação em Tempo Real
              </p>
              <p className="text-[11px] text-slate-400">
                Teste o componente com Tab, Enter e Espaço para inspecionar foco e expansão de detalhes
              </p>
            </div>

            <Button
              onClick={handleEvaluate}
              isLoading={isEvaluating}
              size="md"
              className="bg-emerald-600 hover:bg-emerald-500 font-semibold"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Executar Validador de Acessibilidade
            </Button>
          </div>

          {/* Device Frame Sandbox */}
          <div className="p-6 bg-slate-100 border border-slate-300 rounded-2xl overflow-hidden transition-all duration-300">
            <div className={`transition-all duration-300 ${viewportWidths[deviceViewport]}`}>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
                {/* Header inside the component */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Painel Operacional de Ordens de Serviço
                    </h2>
                    <p className="text-xs text-slate-500">
                      Técnicos de Campo · Nexora Cloud Services
                    </p>
                  </div>

                  {/* Segmented Filter Control */}
                  <div
                    role="tablist"
                    aria-label="Filtro de ordens de serviço"
                    className="inline-flex items-center p-1 bg-slate-100 rounded-lg text-xs"
                  >
                    {[
                      { id: 'all', label: 'Todas' },
                      { id: 'high', label: 'Alta Prioridade' },
                      { id: 'in_progress', label: 'Em Execução' },
                      { id: 'completed', label: 'Concluídas' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        role="tab"
                        aria-selected={filter === btn.id}
                        onClick={() => setFilter(btn.id as any)}
                        className={`px-3 py-1.5 font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
                          filter === btn.id
                            ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedId === order.id;
                    const detailsId = `details-${order.id}`;

                    return (
                      <div
                        key={order.id}
                        className="border border-slate-200 rounded-xl overflow-hidden transition-all hover:border-slate-300"
                      >
                        {/* Order Header / Action Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : order.id)}
                          aria-expanded={isExpanded}
                          aria-controls={detailsId}
                          className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 cursor-pointer bg-white hover:bg-slate-50/50"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-500">
                                #{order.id}
                              </span>
                              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                                {order.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{order.client}</span>
                              <span aria-hidden="true">·</span>
                              <span>{order.estimatedHours}h estimadas</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Accessible status tag with icon and text */}
                            <Badge
                              variant={
                                order.status === 'concluida'
                                  ? 'success'
                                  : order.status === 'em_execucao'
                                  ? 'info'
                                  : 'warning'
                              }
                              icon={
                                order.status === 'concluida' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : order.status === 'em_execucao' ? (
                                  <Sparkles className="w-3.5 h-3.5" />
                                ) : (
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                )
                              }
                            >
                              {order.statusLabel}
                            </Badge>

                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </button>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div
                            id={detailsId}
                            className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-700 space-y-3 animate-in fade-in duration-150"
                          >
                            <p className="leading-relaxed">{order.description}</p>
                            <div>
                              <p className="font-semibold text-slate-800 mb-1">Checklist Técnico:</p>
                              <ul className="space-y-1 pl-4 list-disc text-slate-600">
                                {order.checklist.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Results Card */}
          {evaluation && (
            <Card padding="lg" className="border-2 border-emerald-500 bg-emerald-50/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Inspeção de Acessibilidade & Código: 100/100 Aprovado
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                  CONFORME WCAG 2.2 AA
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {evaluation.summaryFeedback}
              </p>

              <div className="space-y-2 pt-3 border-t border-emerald-200">
                {evaluation.criteriaResults.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="text-slate-800 font-medium">{c.title}</span>
                    </div>
                    <span className="font-mono text-emerald-700 font-bold">
                      {c.pointsAwarded}/{c.maxPoints} pts
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
