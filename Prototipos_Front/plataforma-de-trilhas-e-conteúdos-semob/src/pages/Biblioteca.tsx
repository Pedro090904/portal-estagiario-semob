import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ConteudoBiblioteca, CategoriaBiblioteca } from '../types';
import { SkeletonCard } from '../components/SkeletonLoader';
import { BlocoConteudo } from '../components/BlocoConteudo';
import {
  Search,
  BookOpen,
  Filter,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  X,
  FileText,
  Shield,
  Lightbulb
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export const Biblioteca: React.FC = () => {
  const { conteudoId } = useParams<{ conteudoId?: string }>();
  const [conteudos, setConteudos] = useState<ConteudoBiblioteca[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');
  const [escopoAtivo, setEscopoAtivo] = useState<string>('todos');
  const [itemSelecionado, setItemSelecionado] = useState<ConteudoBiblioteca | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, [busca, categoriaAtiva, escopoAtivo]);

  useEffect(() => {
    if (conteudoId && conteudos.length > 0) {
      const item = conteudos.find(c => c.id === conteudoId);
      if (item) setItemSelecionado(item);
    }
  }, [conteudoId, conteudos]);

  const carregar = async () => {
    setCarregando(true);
    try {
      const res = await api.biblioteca.listar(busca, categoriaAtiva, escopoAtivo);
      setConteudos(res);
      if (conteudoId) {
        const item = res.find(c => c.id === conteudoId);
        if (item) setItemSelecionado(item);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  const getCategoriaLabel = (cat: CategoriaBiblioteca) => {
    switch (cat) {
      case 'manual': return 'Manual Técnico';
      case 'pop': return 'POP Operacional';
      case 'modelo': return 'Modelo de Dados';
      case 'curiosidade': return 'História & Curiosidade';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Repositório de Conhecimento Técnico Permanente
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Biblioteca Técnica da SEMOB
        </h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Consulte manuais, padrões de código, procedimentos operacionais (POPs) e dicionários de dados do SIT. Acesso aberto para desenvolvedores e estagiários.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por títulos, tópicos (Git, Docker, PostgreSQL, Bilhetagem) ou tags..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs md:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group (Zero-Pill discipline: interactive buttons with clear active states) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            {[
              { id: 'todos', label: 'Todos os Tipos' },
              { id: 'manual', label: 'Manuais' },
              { id: 'pop', label: 'POPs' },
              { id: 'modelo', label: 'Modelos de Dados' },
              { id: 'curiosidade', label: 'Curiosidades' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  categoriaAtiva === cat.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Scope */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Escopo:</span>
            <select
              value={escopoAtivo}
              onChange={(e) => setEscopoAtivo(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="todos">Todos os Escopos</option>
              <option value="institucional">Institucional SEMOB</option>
              <option value="geral">Geral / Conceitual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Library Cards */}
      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : conteudos.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
            Nenhum conteúdo encontrado
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Não encontramos resultados para os filtros selecionados. Tente limpar os termos de busca.
          </p>
          <button
            onClick={() => {
              setBusca('');
              setCategoriaAtiva('todos');
              setEscopoAtivo('todos');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {conteudos.map(item => (
            <div
              key={item.id}
              onClick={() => setItemSelecionado(item)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Zero-Pill Unboxed Metadata with · separator */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-blue-700 dark:text-blue-400">
                    {getCategoriaLabel(item.categoria)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.area}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{item.escopo}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {item.titulo}
                </h3>

                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.resumo}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.tempoLeituraMinutos} min
                  </span>
                  <span>·</span>
                  <span>{item.versao}</span>
                </div>
                <span className="text-blue-600 dark:text-blue-400 font-sans font-semibold flex items-center gap-1">
                  Ler manual <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal for Selected Item */}
      {itemSelecionado && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-manual-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in"
          onClick={() => setItemSelecionado(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>{getCategoriaLabel(itemSelecionado.categoria)}</span>
                  <span>·</span>
                  <span>{itemSelecionado.versao}</span>
                  <span>·</span>
                  <span>Revisado em {itemSelecionado.dataRevisao}</span>
                </div>
                <h2 id="titulo-manual-modal" className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {itemSelecionado.titulo}
                </h2>
              </div>
              <button
                onClick={() => setItemSelecionado(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg"
                aria-label="Fechar manual"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 md:p-8 space-y-6 flex-1 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4">
                {itemSelecionado.resumo}
              </p>

              {itemSelecionado.conteudoBlocos.map(bloco => (
                <BlocoConteudo key={bloco.id} bloco={bloco} />
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Tempo de leitura: {itemSelecionado.tempoLeituraMinutos} minutos</span>
              <button
                onClick={() => setItemSelecionado(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:bg-slate-800"
              >
                Fechar Leitura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
