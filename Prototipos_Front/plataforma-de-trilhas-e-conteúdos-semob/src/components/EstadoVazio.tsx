import React from 'react';
import { LucideIcon, Inbox, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EstadoVazioProps {
  titulo: string;
  descricao: string;
  icone?: LucideIcon;
  acaoTexto?: string;
  acaoLink?: string;
  onAcao?: () => void;
}

export const EstadoVazio: React.FC<EstadoVazioProps> = ({
  titulo,
  descricao,
  icone: Icone = Inbox,
  acaoTexto,
  acaoLink,
  onAcao
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 text-center space-y-4 max-w-lg mx-auto">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 mx-auto">
        <Icone className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">
          {titulo}
        </h4>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          {descricao}
        </p>
      </div>

      {(acaoTexto && (acaoLink || onAcao)) && (
        <div className="pt-2">
          {acaoLink ? (
            <Link
              to={acaoLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>{acaoTexto}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={onAcao}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>{acaoTexto}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
