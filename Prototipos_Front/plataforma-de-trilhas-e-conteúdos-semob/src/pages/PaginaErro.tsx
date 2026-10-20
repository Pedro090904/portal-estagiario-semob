import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react';

interface PaginaErroProps {
  codigo?: 404 | 403 | 500;
  titulo?: string;
  mensagem?: string;
}

export const PaginaErro: React.FC<PaginaErroProps> = ({
  codigo = 404,
  titulo,
  mensagem
}) => {
  const configs = {
    404: {
      tituloPadrao: 'Página Não Encontrada (404)',
      mensagemPadrao: 'O endereço solicitado não existe ou foi migrado para outra área da plataforma técnica.'
    },
    403: {
      tituloPadrao: 'Acesso Não Permitido (403)',
      mensagemPadrao: 'Seu perfil de usuário atual não possui autorização para visualizar este conteúdo.'
    },
    500: {
      tituloPadrao: 'Falha Temporária nos Serviços (500)',
      mensagemPadrao: 'Ocorreu uma instabilidade na API NestJS da SEMOB. Tente novamente em alguns instantes.'
    }
  }[codigo];

  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mx-auto">
        <AlertTriangle className="w-8 h-8 text-amber-600" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold">
          Código de Erro {codigo}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {titulo || configs.tituloPadrao}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          {mensagem || configs.mensagemPadrao}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Voltar para o Início</span>
        </Link>
      </div>
    </div>
  );
};
