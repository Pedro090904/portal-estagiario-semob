import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Trilha } from '../types';
import { SkeletonCard } from '../components/SkeletonLoader';
import { Link } from 'react-router-dom';
import { Layers, Clock, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TrilhasLista: React.FC = () => {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const { setIsWireframesOpen } = useApp();

  useEffect(() => {
    carregarTrilhas();
  }, []);

  const carregarTrilhas = async () => {
    setCarregando(true);
    try {
      const lista = await api.trilhas.listar();
      setTrilhas(lista);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Catálogo Institucional de Formação
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Trilhas de Aprendizagem
        </h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Sequências ordenadas de conteúdos teóricos, exercícios práticos e avaliações que culminam na certificação técnica homologada com processo SEI.
        </p>
      </div>

      <div className="space-y-6">
        {trilhas.map((t) => {
          const isFaseFutura = t.fase !== 'MVP';

          return (
            <div
              key={t.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 md:p-8 transition-all ${
                isFaseFutura
                  ? 'border-dashed border-slate-300 dark:border-slate-700 opacity-90'
                  : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                      {t.sigla}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="text-slate-500">{t.area === 'desenvolvimento' ? 'Área de TI / Engenharia' : 'Área Administrativa'}</span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className={`font-semibold ${t.obrigatoria ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500'}`}>
                      {t.obrigatoria ? 'Obrigatória para Ingresso' : 'Livre Escolha'}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="font-mono text-slate-500">[{t.fase}]</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {t.titulo}
                  </h2>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.descricao}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {t.cargaHorariaHoras}h de carga horária
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Público: {t.publicoAlvo}
                    </span>
                    {!isFaseFutura && (
                      <>
                        <span>·</span>
                        <span>{t.etapas.length} etapas estruturadas</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  {!isFaseFutura ? (
                    <Link
                      to={`/trilhas/${t.id}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span>Acessar Mapa da Trilha</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setIsWireframesOpen(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium text-xs hover:bg-amber-100 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Ver Wireframe [FASE 2]</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
