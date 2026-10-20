import React from 'react';
import { Etapa } from '../types';
import { CheckCircle2, Circle, Clock, Lock, AlertCircle } from 'lucide-react';

interface ProgressoEtapasProps {
  etapas: Etapa[];
  etapaAtualId?: string;
  onSelecionarEtapa?: (etapaId: string) => void;
  modoCompacto?: boolean;
}

export const ProgressoEtapas: React.FC<ProgressoEtapasProps> = ({
  etapas,
  etapaAtualId,
  onSelecionarEtapa,
  modoCompacto = false
}) => {
  const etapasObrigatorias = etapas.filter(e => e.obrigatoria);
  const concluidas = etapasObrigatorias.filter(e => e.status === 'concluida').length;
  const total = etapasObrigatorias.length;
  const porcentagemHonesta = Math.round((concluidas / total) * 100);

  const getStatusIcon = (status: Etapa['status'], isCurrent: boolean) => {
    if (status === 'concluida') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />;
    }
    if (status === 'em_andamento' || isCurrent) {
      return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 animate-pulse" aria-hidden="true" />;
    }
    if (status === 'disponivel') {
      return <Circle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" aria-hidden="true" />;
    }
    if (status === 'reprovada') {
      return <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />;
    }
    return <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />;
  };

  const getTipoRotulo = (tipo: Etapa['tipo']) => {
    switch (tipo) {
      case 'manual': return 'Leitura';
      case 'quiz': return 'Quiz';
      case 'desafio_sql': return 'Desafio SQL';
      case 'entrega_codigo': return 'Código';
      case 'projeto': return 'Projeto';
      default: return 'Etapa';
    }
  };

  if (modoCompacto) {
    return (
      <div className="space-y-2" aria-label="Progresso da trilha">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {concluidas} de {total} etapas obrigatórias concluídas
          </span>
          <span className="font-mono tabular-nums text-slate-500">{porcentagemHonesta}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={concluidas} aria-valuemin={0} aria-valuemax={total} aria-valuetext={`${concluidas} de ${total} etapas`}>
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 rounded-full"
            style={{ width: `${(concluidas / total) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Progresso Oficial da Trilha
          </h3>
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
            {concluidas} de {total} etapas
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Critério de conclusão: 100% das etapas obrigatórias concluídas e aprovadas pelo orientador.
        </p>
      </div>

      {/* Honest Progress Indicator */}
      <div className="space-y-1.5">
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
            style={{ width: `${(concluidas / total) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>Início (0 etapas)</span>
          <span>{concluidas}/{total} concluídas</span>
          <span>Conclusão e Certificado</span>
        </div>
      </div>

      {/* List of steps */}
      <nav aria-label="Etapas da trilha" className="space-y-1 pt-1">
        {etapas.map((etapa) => {
          const isCurrent = etapa.id === etapaAtualId;
          const isBlocked = etapa.status === 'bloqueada';

          return (
            <button
              key={etapa.id}
              onClick={() => !isBlocked && onSelecionarEtapa && onSelecionarEtapa(etapa.id)}
              disabled={isBlocked}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-between gap-3 border ${
                isCurrent
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-medium ring-1 ring-blue-500/30'
                  : isBlocked
                  ? 'bg-slate-50/50 dark:bg-slate-900/50 border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-transparent border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getStatusIcon(etapa.status, isCurrent)}
                <span className="truncate">
                  {etapa.ordem}. {etapa.titulo}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-500">
                <span className="text-slate-400 dark:text-slate-500">{getTipoRotulo(etapa.tipo)}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{etapa.tempoEstimadoMinutos}m</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
