import React, { useState } from 'react';
import { Search, Compass, BookOpen, Clock, Layers, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { Track } from '../../types/lms';

export const TrackCatalog: React.FC = () => {
  const { tracks, activeTrack, selectTrack, enrollInTrack, setCurrentTab, getTrackProgressPercent } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'enrolled' | 'Fullstack' | 'Frontend' | 'Backend' | 'DevOps'>('all');

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'all') return true;
    if (filterCategory === 'enrolled') return track.enrolled;
    return track.category === filterCategory;
  });

  const handleOpenTrack = (track: Track) => {
    selectTrack(track.id);
    setCurrentTab('skill-tree');
  };

  const handleEnroll = (track: Track) => {
    enrollInTrack(track.id);
    setCurrentTab('skill-tree');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Catálogo Multi-Trilhas</span>
            <span aria-hidden="true">·</span>
            <span>Arquitetura de Aprendizagem Escalável</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Catálogo de Formações & Trilhas
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore trilhas completas projetadas para preparar você para os desafios reais da engenharia de software moderna. Escolha sua especialidade ou continue sua jornada do zero ao júnior.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou tecnologia..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Filter Tabs (Interactive Segmented buttons, compliant with skill) */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterCategory('enrolled')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === 'enrolled'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Minhas Matrículas
            </button>
            <button
              onClick={() => setFilterCategory('Fullstack')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === 'Fullstack'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Fullstack
            </button>
            <button
              onClick={() => setFilterCategory('Frontend')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === 'Frontend'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Frontend
            </button>
            <button
              onClick={() => setFilterCategory('Backend')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === 'Backend'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Backend
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTracks.map((track) => {
          const isActive = track.id === activeTrack.id;
          const progress = getTrackProgressPercent(track.id);

          return (
            <div
              key={track.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                isActive
                  ? 'border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div>
                {/* Track Header & Meta */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {track.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Nível {track.level}</span>
                  </div>

                  {track.featured && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      Destaque MVP
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {track.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {track.description}
                </p>

                {/* Quantitative pillars */}
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 font-mono tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {track.totalHours} horas
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5 font-mono tabular-nums">
                    <Layers className="w-3.5 h-3.5" />
                    {track.totalModules} módulos
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                {track.enrolled ? (
                  <>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Matriculado {progress > 0 ? `(${progress}%)` : ''}</span>
                    </div>

                    <button
                      onClick={() => handleOpenTrack(track)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <span>Acessar Formação</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Disponível gratuitamente
                    </span>

                    <button
                      onClick={() => handleEnroll(track)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Matricular-se</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
