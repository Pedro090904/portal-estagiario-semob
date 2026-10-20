/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users2,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Award,
  Sparkles,
} from 'lucide-react';
import { ProjectDeliverable, User } from '../../types';
import { ApiService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Textarea } from '../ui/Textarea';
import { ProgressBar } from '../ui/ProgressBar';

interface SupervisorDashboardProps {
  onNavigate: (section: string, payload?: any) => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ onNavigate }) => {
  const [deliverables, setDeliverables] = useState<ProjectDeliverable[]>([]);
  const [selectedDeliverable, setSelectedDeliverable] = useState<ProjectDeliverable | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'revision_requested'>('approved');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');

  const { showSuccess, showError } = useNotification();

  const loadData = async () => {
    const data = await ApiService.getDeliverables();
    setDeliverables(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const supervisedStudents = [
    {
      id: 'user-pedro',
      name: 'Pedro Sousa',
      title: 'Estagiário de Engenharia de Software',
      track: 'Formação para Estagiários Dev',
      progress: 60,
      validatedCompetencies: 2,
      totalCompetencies: 5,
      lastActivity: 'Hoje às 15:30',
      status: 'Em dia',
    },
    {
      id: 'user-beatriz',
      name: 'Beatriz Lima',
      title: 'Estagiária de Engenharia de Software',
      track: 'Formação para Estagiários Dev',
      progress: 40,
      validatedCompetencies: 2,
      totalCompetencies: 5,
      lastActivity: 'Ontem às 18:10',
      status: 'Em dia',
    },
    {
      id: 'user-lucas',
      name: 'Lucas Martins',
      title: 'Estagiário de Banco de Dados',
      track: 'Fundamentos de Engenharia de Dados',
      progress: 25,
      validatedCompetencies: 1,
      totalCompetencies: 4,
      lastActivity: 'Há 3 dias',
      status: 'Atenção (Parado no SQL)',
    },
  ];

  const filteredStudents = supervisedStudents.filter((s) =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.track.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const pendingDeliverables = deliverables.filter((d) => d.status === 'under_review' || d.status === 'submitted');

  const handleOpenReview = (item: ProjectDeliverable) => {
    setSelectedDeliverable(item);
    setReviewDecision('approved');
    setFeedbackText(
      item.supervisorFeedback ||
        'Implementação muito bem estruturada. A separação entre controller e serviço garantiu excelente manutenibilidade e todos os contratos REST foram respeitados com rigor.'
    );
  };

  const handleSaveReview = async () => {
    if (!selectedDeliverable) return;
    if (!feedbackText.trim()) {
      showError('Forneça um parecer detalhado para o aluno');
      return;
    }

    setIsSavingReview(true);
    try {
      await ApiService.reviewDeliverable(selectedDeliverable.id, reviewDecision, feedbackText);
      showSuccess(
        reviewDecision === 'approved' ? 'Entregável Aprovado!' : 'Revisão Solicitada!',
        `O parecer foi salvo e registrado na ficha de acompanhamento do aluno.`
      );
      setSelectedDeliverable(null);
      await loadData();
    } catch (e) {
      showError('Erro ao registrar avaliação');
    } finally {
      setIsSavingReview(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
          <Users2 className="w-4 h-4" />
          <span>PAINEL DA SUPERVISÃO TÉCNICA & MENTORIA</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Acompanhamento de Alunos & Revisão de Entregáveis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Supervisione a evolução técnica dos estagiários sob sua mentoria, valide competências práticas e avalie submissões de código.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Alunos Supervisionados</span>
            <Users2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">3 Estagiários</div>
          <p className="text-[11px] text-slate-500">Turma Onboarding 2026.2</p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Pendências de Revisão</span>
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-900 mb-1">
            {pendingDeliverables.length} Entregável
          </div>
          <p className="text-[11px] text-indigo-600 font-medium">Aguardando parecer técnico</p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Progresso Médio</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">48.3%</div>
          <p className="text-[11px] text-slate-500">Ritmo previsto para a semana 4</p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Certificados Emitidos</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">1 Concluído</div>
          <p className="text-[11px] text-slate-500">Credencial verificada ativa</p>
        </Card>
      </div>

      {/* Pending Reviews Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            Fila de Revisão de Entregáveis Técnicos ({pendingDeliverables.length})
          </h2>
          <span className="text-xs text-slate-500">Ação requerida da mentora</span>
        </div>

        {pendingDeliverables.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            Nenhuma entrega pendente de revisão no momento. Todos os alunos estão em dia!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingDeliverables.map((item) => (
              <Card
                key={item.id}
                padding="md"
                className="border-2 border-indigo-200/80 bg-indigo-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900">{item.stageName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 font-mono text-[11px]">Submetido em {item.submittedAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-indigo-950">{item.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{item.technicalNotes}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    onClick={() => handleOpenReview(item)}
                    size="sm"
                    className="font-semibold"
                  >
                    Avaliar & Dar Parecer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Supervised Students Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">Alunos sob Acompanhamento</h2>
          <div className="w-full sm:w-72">
            <Input
              placeholder="Buscar por nome do aluno ou trilha..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Estagiário</th>
                  <th className="py-3 px-4">Trilha Vinculada</th>
                  <th className="py-3 px-4">Progresso Geral</th>
                  <th className="py-3 px-4">Competências</th>
                  <th className="py-3 px-4">Última Atividade</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>
                        <span>{st.name}</span>
                        <p className="text-[11px] text-slate-500 font-normal">{st.title}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{st.track}</td>
                    <td className="py-3.5 px-4 w-40">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span>{st.progress}%</span>
                        </div>
                        <ProgressBar value={st.progress} showPercent={false} size="sm" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-emerald-700 font-bold">
                        {st.validatedCompetencies}/{st.totalCompetencies}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{st.lastActivity}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate('competencies')}
                        className="text-xs"
                      >
                        Ver Ficha
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grading / Review Modal */}
      {selectedDeliverable && (
        <Dialog
          isOpen={Boolean(selectedDeliverable)}
          onClose={() => setSelectedDeliverable(null)}
          title={`Avaliação Técnica: ${selectedDeliverable.stageName}`}
          description={`Aluno: Pedro Sousa · Submetido em ${selectedDeliverable.submittedAt}`}
          size="lg"
          footer={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDeliverable(null)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSaveReview}
                isLoading={isSavingReview}
                className={reviewDecision === 'approved' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'}
              >
                Salvar Parecer Oficial
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{selectedDeliverable.title}</span>
                <a
                  href={selectedDeliverable.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspecionar Repositório</span>
                </a>
              </div>
              <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                {selectedDeliverable.technicalNotes}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Decisão da Supervisão:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReviewDecision('approved')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    reviewDecision === 'approved'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/30'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Aprovar Entregável & Homologar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewDecision('revision_requested')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    reviewDecision === 'revision_requested'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-600/30'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Solicitar Revisão / Ajustes</span>
                </button>
              </div>
            </div>

            <Textarea
              label="Parecer Técnico & Feedback Construtivo"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Explique os pontos fortes do código e o que pode ser melhorado antes do próximo módulo..."
              rows={5}
              required
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};
