import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Trilha, Etapa } from '../types';
import { ProgressoEtapas } from '../components/ProgressoEtapas';
import { SkeletonCard } from '../components/SkeletonLoader';
import { EstadoErro } from '../components/EstadoErro';
import { Link } from 'react-router-dom';
import {
  Flame,
  Zap,
  Calendar,
  ArrowRight,
  Clock,
  AlertCircle,
  FileCode,
  Database,
  CheckCircle2,
  BookOpen,
  MessageSquare
} from 'lucide-react';

export const DashboardAluno: React.FC = () => {
  const { currentUser, brandConfig, networkError, setNetworkError } = useApp();
  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarTrilha();
  }, []);

  const carregarTrilha = async () => {
    setCarregando(true);
    try {
      const t = await api.trilhas.obterPorId('trilha-dev-semob-2026');
      setTrilha(t);
    } catch (e) {
      console.error(e);
      setNetworkError(true);
    } finally {
      setCarregando(false);
    }
  };

  if (networkError) {
    return (
      <EstadoErro
        onTentarNovamente={() => {
          setNetworkError(false);
          carregarTrilha();
        }}
      />
    );
  }

  if (carregando || !trilha) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Find next step in progress or first available non-completed step
  const proximaEtapa =
    trilha.etapas.find(e => e.status === 'em_andamento') ||
    trilha.etapas.find(e => e.status === 'disponivel') ||
    trilha.etapas[0];

  const etapasConcluidas = trilha.etapas.filter(e => e.status === 'concluida').length;
  const totalEtapas = trilha.etapas.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner with clear intern context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{brandConfig.nomeCompleto}</span>
            <span aria-hidden="true">·</span>
            <span>Programa de Formação Técnica</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Olá, {currentUser.nome.split(' ')[0]}!
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
            Você está cursando a <strong className="text-slate-900 dark:text-slate-200">{trilha.titulo}</strong>. Cada etapa concluída aproxima você da homologação e do certificado oficial com processo SEI.
          </p>
        </div>

        {/* Engagement stats (Streak & Points - no badges as requested) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
            <Flame className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
            <div className="text-left">
              <span className="font-mono font-bold text-sm leading-none block">
                {currentUser.diasSeguidos} dias
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400">Sequência ativa</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200">
            <Zap className="w-5 h-5 text-blue-600 shrink-0" aria-hidden="true" />
            <div className="text-left">
              <span className="font-mono font-bold text-sm leading-none block">
                {currentUser.pontos} pts
              </span>
              <span className="text-[10px] text-blue-700 dark:text-blue-400">Por constância</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Highlighted Card: Next Action Required (Onde estou e próximo passo) */}
      <section aria-labelledby="proxima-etapa-titulo" className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <Clock className="w-4 h-4" />
              <span>Sua Próxima Etapa em Destaque</span>
              <span aria-hidden="true">·</span>
              <span className="text-white/80 font-normal">Ordem Recomendada</span>
            </div>

            <h2 id="proxima-etapa-titulo" className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {proximaEtapa.ordem}. {proximaEtapa.titulo}
            </h2>

            <p className="text-xs md:text-sm text-blue-100 leading-relaxed font-normal">
              {proximaEtapa.descricaoCurta}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200 font-mono pt-1">
              <span>Tipo: {proximaEtapa.tipo.toUpperCase()}</span>
              <span>·</span>
              <span>Tempo estimado: {proximaEtapa.tempoEstimadoMinutos} min</span>
              <span>·</span>
              <span>Versão: {proximaEtapa.versao}</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              to={`/trilhas/${trilha.id}/etapas/${proximaEtapa.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs md:text-sm shadow-md transition-all focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Continuar Esta Etapa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={`/trilhas/${trilha.id}`}
              className="inline-flex items-center justify-center px-4 py-2 text-xs text-blue-200 hover:text-white transition-colors"
            >
              Ver mapa completo da trilha
            </Link>
          </div>
        </div>
      </section>

      {/* Grid: Honest Progress & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Track Progress details */}
        <div className="lg:col-span-2 space-y-6">
          <ProgressoEtapas
            etapas={trilha.etapas}
            etapaAtualId={proximaEtapa.id}
          />

          {/* Schedule and Deadlines */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                Cronograma e Prazos do Estágio
              </span>
              <span className="text-slate-500 font-mono text-[11px]">SIT-SEMOB 2026</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[11px] text-slate-400 block font-medium">Início das Atividades:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{trilha.dataInicio}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[11px] text-slate-400 block font-medium">Previsão para Certificação:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{trilha.dataConclusaoEstimada}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Supervisor Notice & Quick Knowledge base */}
        <div className="space-y-6">
          {/* Orientation Notice */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Avisos do Orientador Técnico</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-blue-950 dark:text-blue-200 space-y-1">
                <span className="font-semibold block text-blue-900 dark:text-blue-300">
                  Carlos Silveira · Orientador SEMOB
                </span>
                <p className="leading-relaxed text-[11px]">
                  "Pessoal, na etapa 4 (Desafio SQL) lembrem-se de rodar o teste com a cláusula HAVING após o GROUP BY se desejarem filtrar agregados. Bons estudos!"
                </p>
                <span className="text-[10px] text-slate-400 block pt-1">Hoje às 09:15</span>
              </div>
            </div>
          </div>

          {/* Quick Technical Library shortcut */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-500" />
                Biblioteca de Consulta Rápida
              </span>
              <Link to="/biblioteca" className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]">
                Ver tudo
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              <Link
                to="/biblioteca/bib-01"
                className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200"
              >
                <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                  Convenção Git SEMOB
                </span>
                <span className="text-[11px] text-slate-400">15 min de leitura · Atualizado em 10/10</span>
              </Link>
              <Link
                to="/biblioteca/bib-02"
                className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200"
              >
                <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                  POP-TI-014: Deploy em Homologação
                </span>
                <span className="text-[11px] text-slate-400">20 min de leitura · v4.0</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
