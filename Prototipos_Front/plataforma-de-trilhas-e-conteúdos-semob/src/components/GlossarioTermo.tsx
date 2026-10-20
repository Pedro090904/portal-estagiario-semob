import React, { useState, useRef, useEffect } from 'react';
import { GLOSSARIO_TERMOS } from '../services/mockData';
import { Info, X } from 'lucide-react';

interface GlossarioTermoProps {
  termo: string;
  children?: React.ReactNode;
}

export const GlossarioTermo: React.FC<GlossarioTermoProps> = ({ termo, children }) => {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const dadosTermo = GLOSSARIO_TERMOS.find(
    g => g.termo.toLowerCase() === termo.toLowerCase()
  ) || {
    termo,
    significado: `Conceito técnico institucional utilizado na gestão de transportes e sistemas da SEMOB.`,
    categoria: 'Institucional' as const
  };

  // Close on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false);
    };

    if (aberto) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [aberto]);

  return (
    <span ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setAberto(prev => !prev)}
        onMouseEnter={() => setAberto(true)}
        aria-expanded={aberto}
        aria-label={`Explicação do termo: ${termo}`}
        className="inline-flex items-center gap-0.5 font-medium underline decoration-dotted decoration-blue-500 underline-offset-4 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded cursor-help"
      >
        <span>{children || termo}</span>
        <span className="sr-only">(toque para ver o significado)</span>
      </button>

      {aberto && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 dark:bg-slate-800 text-white rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-700 animate-in fade-in zoom-in-95 pointer-events-auto"
        >
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
            <span className="font-semibold text-blue-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
              {dadosTermo.termo}
            </span>
            <span className="text-[10px] text-slate-400">{dadosTermo.categoria}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAberto(false);
              }}
              className="text-slate-400 hover:text-white p-0.5 rounded"
              aria-label="Fechar explicação"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-slate-200 leading-relaxed font-normal text-[11px]">
            {dadosTermo.significado}
          </p>
          <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700 absolute -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45" />
        </span>
      )}
    </span>
  );
};
