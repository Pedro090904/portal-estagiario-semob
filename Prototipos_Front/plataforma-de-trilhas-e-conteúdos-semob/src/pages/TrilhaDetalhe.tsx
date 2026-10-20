import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Trilha, Etapa } from '../types';
import { SkeletonCard } from '../components/SkeletonLoader';
import { ProgressoEtapas } from '../components/ProgressoEtapas';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Lock,
  Play,
  FileText,
  AlertCircle,
  HelpCircle,
  Code,
  Award,
  Layers
} from 'lucide-react';

export const TrilhaDetalhe: React.FC = () => {
  const { trilhaId } = useParams<{ trilhaId: string }>();
  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, [trilhaId]);

  const carregar = async () => {
    setCarregando(true);
    try {
      const t = await api.trilhas.obterPorId(trilhaId || 'trilha-dev-semob-2026');
      setTrilha(t);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando || !trilha) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const etapasObrigatorias = trilha.etapas.filter(e => e.obrigatoria);
  const concluidas = etapasObrigatorias.filter(e => e.status === 'concluida').length;
  const total = etapasObrigatorias.length;
  const todasConcluidas = concluidas === total;

  const getEtapaIcon = (tipo: Etapa['tipo']) => {
    switch (tipo) {
      case 'manual': return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'quiz': return <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'desafio_sql': return <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'entrega_codigo': return <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'projeto': return <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getStatusBadge = (status: Etapa['status']) => {
    switch (status) {
      case 'concluida':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Concluída
          </span>
        );
      case 'em_andamento':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800 animate-pulse">
            <Play className="w-3 h-3" />
            Em Andamento
          </span>
        );
      case 'disponivel':
        return (
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            Disponível
          </span>
        );
      case 'bloqueada':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 px-2 py-0.5 rounded-md">
            <Lock className="w-3 h-3" />
            Bloqueada
          </span>
        );
      case 'reprovada':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
            <AlertCircle className="w-3 h-3" />
            Precisa de Ajuste
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/trilhas"
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para todas as trilhas</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-mono font-bold text-blue-600">{trilha.sigla}</span>
          <span aria-hidden="true">·</span>
          <span>{trilha.cargaHorariaHoras} Horas de Carga Horária</span>
          <span aria-hidden="true">·</span>
          <span>Processo SEI Vinculado</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {trilha.titulo}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            {trilha.descricao}
          </p>
        </div>

        {/* Honest Progress bar banner */}
        <div className="pt-2">
          <ProgressoEtapas etapas={trilha.etapas} modoCompacto />
        </div>
      </div>

      {/* Steps Journey Map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
              Mapa Sequencial de Etapas
            </h2>
            <p className="text-xs text-slate-500">
              Ordem recomendada para garantir compreensão gradual antes de cada desafio prático.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {concluidas} de {total} aprovadas
          </span>
        </div>

        <div className="space-y-3">
          {trilha.etapas.map((etapa) => {
            const isBlocked = etapa.status === 'bloqueada';

            return (
              <div
                key={etapa.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 md:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isBlocked
                    ? 'border-slate-200/60 dark:border-slate-800/60 opacity-60 bg-slate-50/40 dark:bg-slate-950/40'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getEtapaIcon(etapa.tipo)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {etapa.ordem}. {etapa.titulo}
                      </span>
                      {getStatusBadge(etapa.status)}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed truncate max-w-xl">
                      {etapa.descricaoCurta}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Tempo: {etapa.tempoEstimadoMinutos} min</span>
                      <span>·</span>
                      <span>Versão: {etapa.versao}</span>
                      <span>·</span>
                      <span>Última revisão: {etapa.dataUltimaRevisao}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  {isBlocked ? (
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Lock className="w-3.5 h-3.5" />
                      Requer etapa anterior
                    </span>
                  ) : (
                    <Link
                      to={`/trilhas/${trilha.id}/etapas/${etapa.id}`}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        etapa.status === 'concluida'
                          ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      <span>{etapa.status === 'concluida' ? 'Revisar Conteúdo' : 'Acessar Etapa'}</span>
                      <Play className="w-3 h-3 fill-current" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
