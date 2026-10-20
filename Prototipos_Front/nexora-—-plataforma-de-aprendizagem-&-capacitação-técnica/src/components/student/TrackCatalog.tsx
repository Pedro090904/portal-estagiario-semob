/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Layers,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Track } from '../../types';
import { ApiService } from '../../services/api';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { EmptyState } from '../ui/EmptyState';

interface TrackCatalogProps {
  onNavigate: (section: string, payload?: any) => void;
}

export const TrackCatalog: React.FC<TrackCatalogProps> = ({ onNavigate }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await ApiService.getTracks();
        setTracks(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const areaTabs = [
    { id: 'all', label: 'Todas as Áreas' },
    { id: 'Engenharia de Software', label: 'Engenharia de Software' },
    { id: 'Banco de Dados', label: 'Banco de Dados' },
    { id: 'DevOps & Qualidade', label: 'DevOps & Qualidade' },
  ];

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === 'all' || track.area === selectedArea;
    const matchesLevel = selectedLevel === 'all' || track.level === selectedLevel;
    return matchesSearch && matchesArea && matchesLevel;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Layers className="w-4 h-4" />
          <span>PROGRAMAS DE CAPACITAÇÃO</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Catálogo de Aprendizagem</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Explore trilhas técnicas estruturadas, desenhadas para desenvolver competências práticas do nível básico ao profissional com validação e mentoria.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <Input
              placeholder="Buscar por nome da trilha, tecnologia ou competência..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              options={[
                { value: 'all', label: 'Todos os Níveis' },
                { value: 'Iniciante', label: 'Iniciante (Nivelamento)' },
                { value: 'Intermediário', label: 'Intermediário' },
                { value: 'Avançado', label: 'Avançado' },
              ]}
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              options={[
                { value: 'popular', label: 'Mais Matriculados' },
                { value: 'duration_asc', label: 'Menor Duração' },
                { value: 'duration_desc', label: 'Maior Duração' },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        </div>

        {/* Area filter segmented control */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Tabs
            items={areaTabs}
            activeId={selectedArea}
            onChange={setSelectedArea}
            variant="segmented"
          />
          <span className="text-xs text-slate-400 hidden sm:inline">
            {filteredTracks.length} {filteredTracks.length === 1 ? 'trilha encontrada' : 'trilhas encontradas'}
          </span>
        </div>
      </div>

      {/* Tracks Grid */}
      {filteredTracks.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-slate-400" />}
          title="Nenhuma trilha encontrada"
          description="Tente ajustar os filtros de busca ou selecionar outra área de especialidade."
          actionLabel="Limpar Filtros"
          onAction={() => {
            setSearchQuery('');
            setSelectedArea('all');
            setSelectedLevel('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => {
            const isEnrolled = track.id === 'track-interns-dev';
            return (
              <Card
                key={track.id}
                padding="none"
                variant="interactive"
                onClick={() => onNavigate('track_detail', { trackId: track.id })}
                className="flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                    <span className="font-medium text-indigo-700">{track.area}</span>
                    <span aria-hidden="true">·</span>
                    <span>{track.level}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {track.estimatedHours}h
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-2">
                    {track.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {track.shortDescription}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Módulos:</span>
                      <span className="font-semibold text-slate-800">
                        {track.modules.length > 0 ? `${track.modules.length} módulos estruturados` : 'Em formulação'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Certificado:</span>
                      <span className="font-semibold text-emerald-700">
                        {track.certificationAvailable ? 'Incluso com validação' : 'Não se aplica'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  {isEnrolled ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Matriculado (60%)
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {track.enrolledStudentsCount} matriculados
                    </span>
                  )}

                  <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    {isEnrolled ? 'Continuar' : 'Detalhes'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
