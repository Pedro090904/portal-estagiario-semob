/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Send,
  MessageSquare,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { ProjectDeliverable } from '../../types';
import { ApiService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';

export const ProjectsView: React.FC = () => {
  const [deliverables, setDeliverables] = useState<ProjectDeliverable[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [stageName, setStageName] = useState('Etapa 3: Interface Web e Acessibilidade');
  const [title, setTitle] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showSuccess, showError } = useNotification();

  const loadDeliverables = async () => {
    const data = await ApiService.getDeliverables();
    setDeliverables(data);
  };

  useEffect(() => {
    loadDeliverables();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !repoUrl.trim()) {
      showError('Preencha os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      await ApiService.submitDeliverable({
        projectId: 'stage-project',
        studentId: 'user-pedro',
        stageName,
        title,
        repositoryUrl: repoUrl,
        liveDemoUrl,
        technicalNotes,
      });
      showSuccess(
        'Entregável submetido!',
        'Sua submissão foi enviada para avaliação da supervisora Mariana Ramos.'
      );
      setIsSubmitModalOpen(false);
      setTitle('');
      setRepoUrl('');
      setLiveDemoUrl('');
      setTechnicalNotes('');
      await loadDeliverables();
    } catch (err) {
      showError('Erro ao submeter entregável');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>PROJETO INTEGRADOR DE CAPSTONE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sistema de Gestão de Ordens de Serviço
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Projeto prático unificando Modelagem de Banco Relacional, API REST com Node.js e Interface Responsiva com React.
          </p>
        </div>

        <Button
          onClick={() => setIsSubmitModalOpen(true)}
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nova Entrega de Etapa
        </Button>
      </div>

      {/* Project Overview Card */}
      <Card padding="lg" className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Visão Geral do Projeto & Critérios de Avaliação</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Cada estagiário deve entregar as 3 etapas consecutivas do sistema em repositórios versionados com Git, acompanhados de testes automatizados e notas técnicas de arquitetura.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Etapa 1: Banco de Dados</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Aprovada pela Mentora
            </span>
          </div>
          <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-200">
            <span className="font-bold text-slate-900 block mb-1">Etapa 2: Endpoints REST</span>
            <span className="text-indigo-700 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Em Revisão Técnica
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Etapa 3: Interface Web</span>
            <span className="text-slate-500">Pronta para Submissão</span>
          </div>
        </div>
      </Card>

      {/* Deliverables List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Histórico de Entregas & Pareceres do Supervisor</h2>

        {deliverables.map((item) => {
          const isApproved = item.status === 'approved';
          const isUnderReview = item.status === 'under_review';

          return (
            <Card key={item.id} padding="lg" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
                    <span>{item.stageName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400 font-normal">Submetido em {item.submittedAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                </div>

                <Badge
                  variant={isApproved ? 'success' : isUnderReview ? 'info' : 'warning'}
                  icon={
                    isApproved ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {isApproved
                    ? 'Aprovado'
                    : isUnderReview
                    ? 'Em Revisão'
                    : 'Revisão Solicitada'}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
                  {item.technicalNotes}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <a
                    href={item.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Ver Repositório</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {item.liveDemoUrl && (
                    <a
                      href={item.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Demonstração Online</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Supervisor Feedback Callout */}
              {item.supervisorFeedback && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Parecer da Supervisora (Mariana Ramos)
                    </span>
                    {item.reviewedAt && (
                      <span className="text-[11px] text-emerald-700 font-normal">
                        {item.reviewedAt}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed text-emerald-900">{item.supervisorFeedback}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Submission Modal */}
      <Dialog
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submeter Entregável do Projeto Integrador"
        description="Envie o repositório Git com os códigos e a documentação técnica para avaliação"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Etapa do Projeto"
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
            required
          />

          <Input
            label="Título da Entrega"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: Interface Responsiva de Ordens com React e Tailwind"
            required
          />

          <Input
            label="URL do Repositório Git (GitHub / GitLab)"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/usuario/projeto"
            required
          />

          <Input
            label="URL da Demonstração Online (Opcional)"
            value={liveDemoUrl}
            onChange={(e) => setLiveDemoUrl(e.target.value)}
            placeholder="https://meu-app.nexora.dev"
          />

          <Textarea
            label="Notas Técnicas & Decisões de Arquitetura"
            value={technicalNotes}
            onChange={(e) => setTechnicalNotes(e.target.value)}
            placeholder="Descreva as decisões arquiteturais tomadas, bibliotecas adotadas, padrões de projeto e comandos para executar localmente..."
            rows={4}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting} leftIcon={<Send className="w-3.5 h-3.5" />}>
              Submeter para Supervisão
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
