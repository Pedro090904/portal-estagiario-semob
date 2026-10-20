import React, { useState } from 'react';
import { BlocoConteudoItem } from '../types';
import { Copy, Check, Info, AlertTriangle, Lightbulb, Terminal, ArrowRight } from 'lucide-react';
import { GlossarioTermo } from './GlossarioTermo';

interface BlocoConteudoProps {
  bloco: BlocoConteudoItem;
}

export const BlocoConteudo: React.FC<BlocoConteudoProps> = ({ bloco }) => {
  const [copiado, setCopiado] = useState(false);

  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  switch (bloco.tipo) {
    case 'texto':
      return (
        <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
          {bloco.titulo && (
            <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 pt-2">
              {bloco.titulo}
            </h3>
          )}
          <p>
            {bloco.conteudo}
          </p>
        </div>
      );

    case 'destaque': {
      const config = {
        info: {
          icon: Info,
          title: bloco.titulo || 'Informação Institucional',
          border: 'border-blue-200 dark:border-blue-900',
          bg: 'bg-blue-50/70 dark:bg-blue-950/40',
          text: 'text-blue-900 dark:text-blue-200',
          badgeText: 'Diretriz Oficial'
        },
        atencao: {
          icon: AlertTriangle,
          title: bloco.titulo || 'Atenção Operacional',
          border: 'border-amber-200 dark:border-amber-900',
          bg: 'bg-amber-50/70 dark:bg-amber-950/40',
          text: 'text-amber-900 dark:text-amber-200',
          badgeText: 'Ponto Crítico'
        },
        dica: {
          icon: Lightbulb,
          title: bloco.titulo || 'Recomendação Técnica',
          border: 'border-emerald-200 dark:border-emerald-900',
          bg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
          text: 'text-emerald-900 dark:text-emerald-200',
          badgeText: 'Boas Práticas'
        }
      }[bloco.tipoDestaque || 'info'];

      const Icon = config.icon;

      return (
        <div className={`p-4 md:p-5 rounded-xl border ${config.border} ${config.bg} space-y-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" aria-hidden="true" />
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                {config.title}
              </h4>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {config.badgeText}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {bloco.conteudo}
          </p>
        </div>
      );
    }

    case 'cartao_comando':
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
              <span>{bloco.titulo || 'Comando de Terminal'}</span>
            </div>
            <button
              onClick={() => copiarTexto(bloco.comando || '')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors focus-visible:ring-1 focus-visible:ring-blue-400"
              aria-label="Copiar comando para a área de transferência"
            >
              {copiado ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <div className="font-mono text-xs md:text-sm bg-black/40 p-3 rounded-lg overflow-x-auto text-emerald-400 border border-slate-800">
            <code>$ {bloco.comando}</code>
          </div>
          {bloco.explicacao && (
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Explicação:</span> {bloco.explicacao}
            </p>
          )}
        </div>
      );

    case 'codigo':
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
            <span className="font-medium text-slate-300">{bloco.titulo || 'Código Fonte'}</span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{bloco.linguagem || 'texto'}</span>
              <button
                onClick={() => copiarTexto(bloco.codigo || '')}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                aria-label="Copiar bloco de código"
              >
                {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copiado ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>
          <pre className="p-4 text-xs md:text-sm font-mono overflow-x-auto text-slate-200 leading-relaxed">
            <code>{bloco.codigo}</code>
          </pre>
        </div>
      );

    case 'cenario':
      return (
        <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-4 md:p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            <span>Cenário Real do Transporte Público</span>
          </div>
          {bloco.titulo && (
            <h4 className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">
              {bloco.titulo}
            </h4>
          )}
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {bloco.conteudo}
          </p>
        </div>
      );

    case 'tabela':
      if (!bloco.dadosTabela) return null;
      return (
        <div className="space-y-2">
          {bloco.titulo && (
            <h4 className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">
              {bloco.titulo}
            </h4>
          )}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {bloco.dadosTabela.cabecalhos.map((h, i) => (
                      <th key={i} className="px-4 py-3 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                  {bloco.dadosTabela.linhas.map((linha, lIdx) => (
                    <tr key={lIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      {linha.map((celula, cIdx) => (
                        <td key={cIdx} className="px-4 py-2.5">
                          {celula}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-500 border-t border-slate-200/60 dark:border-slate-800 flex justify-between">
              <span>Arraste horizontalmente para ver todas as colunas no celular</span>
              <span>{bloco.dadosTabela.linhas.length} registros</span>
            </div>
          </div>
        </div>
      );

    case 'diagrama':
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {bloco.titulo || 'Diagrama de Arquitetura de Comunicação'}
            </span>
            <span className="text-[11px] text-slate-500">Fluxo Orientado a Eventos</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-lg text-xs font-mono">
            <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-center">
              <div className="font-semibold text-blue-600 dark:text-blue-400">Validador Catraca</div>
              <div className="text-[10px] text-slate-500">Protocolo SIT-Bus</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 md:rotate-0" />
            <div className="p-3 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg shadow-sm text-center">
              <div className="font-semibold text-slate-900 dark:text-slate-100">API NestJS Gateway</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Autenticação JWT</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 md:rotate-0" />
            <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-center">
              <div className="font-semibold text-indigo-600 dark:text-indigo-400">PostgreSQL SIT</div>
              <div className="text-[10px] text-slate-500">Escrita Transacional</div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
