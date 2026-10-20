import React from 'react';
import { EntregaStatus } from '../types';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';

interface StatusEntregaProps {
  status: EntregaStatus;
  size?: 'sm' | 'md';
}

export const StatusEntrega: React.FC<StatusEntregaProps> = ({ status, size = 'md' }) => {
  const config = {
    rascunho: {
      label: 'Rascunho não enviado',
      icon: FileText,
      style: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    },
    enviada: {
      label: 'Enviada (Aguardando análise)',
      icon: Clock,
      style: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
    },
    em_revisao: {
      label: 'Em revisão pelo orientador',
      icon: RefreshCw,
      style: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
    },
    aprovada: {
      label: 'Aprovada com êxito',
      icon: CheckCircle2,
      style: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
    },
    aprovada_com_ajustes: {
      label: 'Aprovada com ressalvas',
      icon: CheckCircle2,
      style: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
    },
    precisa_de_correcao: {
      label: 'Precisa de correções',
      icon: AlertCircle,
      style: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
    }
  }[status];

  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md whitespace-nowrap ${config.style} ${
        isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
      role="status"
    >
      <Icon className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
