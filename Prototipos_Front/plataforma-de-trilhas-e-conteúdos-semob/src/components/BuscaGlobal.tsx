import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, BookOpen, Layers, HelpCircle, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TRILHA_DESENVOLVEDOR_SEMOB, BIBLIOTECA_CONTEUDOS, GLOSSARIO_TERMOS } from '../services/mockData';

export const BuscaGlobal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [termo, setTermo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTermo('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = termo.toLowerCase().trim();

  // Search results
  const trilhasResult = q
    ? [TRILHA_DESENVOLVEDOR_SEMOB].filter(t => t.titulo.toLowerCase().includes(q) || t.descricao.toLowerCase().includes(q))
    : [];

  const etapasResult = q
    ? TRILHA_DESENVOLVEDOR_SEMOB.etapas.filter(e => e.titulo.toLowerCase().includes(q) || e.descricaoCurta.toLowerCase().includes(q))
    : [];

  const bibliotecaResult = q
    ? BIBLIOTECA_CONTEUDOS.filter(b => b.titulo.toLowerCase().includes(q) || b.resumo.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q)))
    : [];

  const glossarioResult = q
    ? GLOSSARIO_TERMOS.filter(g => g.termo.toLowerCase().includes(q) || g.significado.toLowerCase().includes(q))
    : [];

  const totalResultados = trilhasResult.length + etapasResult.length + bibliotecaResult.length + glossarioResult.length;

  const handleIrPara = (caminho: string) => {
    setIsSearchOpen(false);
    navigate(caminho);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Busca global da plataforma"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 md:pt-24 animate-in fade-in"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar por aulas, manuais, POPs, consultas SQL ou termos do glossário..."
            className="w-full bg-transparent text-sm md:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {termo && (
            <button
              onClick={() => setTermo('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              aria-label="Limpar texto da busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-5 text-xs flex-1">
          {!q ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>Digite um termo para pesquisar em toda a plataforma técnica.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px]">
                <span className="text-slate-500">Sugestões rápidas:</span>
                {['GitLab', 'PostgreSQL', 'SIT', 'Atrasos de ônibus', 'NestJS', 'POP-TI'].map(s => (
                  <button
                    key={s}
                    onClick={() => setTermo(s)}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResultados === 0 ? (
            <div className="py-8 text-center text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Nenhum resultado encontrado para "{termo}".</p>
              <p className="text-[11px]">Tente verificar a ortografia ou buscar por termos mais genéricos.</p>
            </div>
          ) : (
            <>
              {/* Etapas de Trilhas */}
              {etapasResult.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Aulas e Etapas da Trilha ({etapasResult.length})</span>
                  </div>
                  <div className="space-y-1">
                    {etapasResult.map(etapa => (
                      <button
                        key={etapa.id}
                        onClick={() => handleIrPara(`/trilhas/${etapa.trilhaId}/etapas/${etapa.id}`)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span>{etapa.ordem}. {etapa.titulo}</span>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded font-mono">
                              {etapa.tipo}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-md">{etapa.descricaoCurta}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Biblioteca de Manuais e POPs */}
              {bibliotecaResult.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Biblioteca Técnica & POPs ({bibliotecaResult.length})</span>
                  </div>
                  <div className="space-y-1">
                    {bibliotecaResult.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleIrPara(`/biblioteca/${item.id}`)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {item.titulo}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-md">{item.resumo}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossário */}
              {glossarioResult.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Termos Técnicos do Glossário ({glossarioResult.length})</span>
                  </div>
                  <div className="space-y-1">
                    {glossarioResult.map(g => (
                      <div
                        key={g.termo}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                      >
                        <span className="font-semibold text-blue-700 dark:text-blue-400">{g.termo}: </span>
                        <span className="text-slate-600 dark:text-slate-400">{g.significado}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>{totalResultados} resultados disponíveis</span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Use as setas para navegar</span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> para abrir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
