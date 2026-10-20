import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface EstadoErroProps {
  titulo?: string;
  mensagem?: string;
  onTentarNovamente?: () => void;
  isConexao?: boolean;
}

export const EstadoErro: React.FC<EstadoErroProps> = ({
  titulo = 'Erro ao carregar dados operacionais',
  mensagem = 'Houve uma falha momentânea de comunicação com a API do NestJS da SEMOB.',
  onTentarNovamente,
  isConexao = false
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-10 text-center space-y-4 max-w-md mx-auto">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900 mx-auto">
        {isConexao ? <WifiOff className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">
          {titulo}
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          {mensagem}
        </p>
      </div>

      {onTentarNovamente && (
        <div className="pt-2">
          <button
            onClick={onTentarNovamente}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      )}
    </div>
  );
};
