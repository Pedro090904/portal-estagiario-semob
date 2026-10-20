/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Plus,
  Layers,
  Edit2,
  Eye,
  Archive,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Track, PublishingStatus } from '../../types';
import { ApiService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

export const AdminTrackManager: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showSuccess, showError } = useNotification();

  const loadTracks = async () => {
    const data = await ApiService.getTracks();
    setTracks(data);
  };

  useEffect(() => {
    loadTracks();
  }, []);

  const handleEdit = (track: Track) => {
    setEditingTrack({ ...track });
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      title: '',
      shortDescription: '',
      fullDescription: '',
      area: 'Engenharia de Software',
      level: 'Iniciante',
      estimatedHours: 20,
      publishingStatus: 'draft',
      enrolledStudentsCount: 0,
      version: '1.0.0',
      lastUpdatedAt: new Date().toISOString().split('T')[0],
      certificationAvailable: true,
      prerequisites: [],
      learningObjectives: [],
      competenciesWorked: [],
      modules: [],
    };
    setEditingTrack(newTrack);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack || !editingTrack.title.trim()) {
      showError('Preencha os campos obrigatórios da trilha');
      return;
    }

    try {
      await ApiService.saveTrack(editingTrack);
      showSuccess(
        'Trilha salva com sucesso!',
        `Versão ${editingTrack.version} atualizada com status ${editingTrack.publishingStatus}.`
      );
      setIsModalOpen(false);
      setEditingTrack(null);
      await loadTracks();
    } catch (err) {
      showError('Erro ao salvar trilha');
    }
  };

  const statusBadges = {
    draft: <Badge variant="neutral">Rascunho</Badge>,
    in_review: <Badge variant="warning">Em Revisão Pedagógica</Badge>,
    published: <Badge variant="success">Publicado</Badge>,
    archived: <Badge variant="error">Arquivado</Badge>,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1">
            <Settings className="w-4 h-4" />
            <span>GESTÃO PEDAGÓGICA & CONTEÚDOS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Administração de Trilhas & Versões
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Crie, publique, atualize versões e versione os módulos de aprendizagem e critérios de avaliação da plataforma.
          </p>
        </div>

        <Button
          onClick={handleCreateNew}
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-purple-700 hover:bg-purple-600"
        >
          Criar Nova Trilha
        </Button>
      </div>

      {/* Tracks Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="py-3 px-4">Trilha</th>
              <th className="py-3 px-4">Área & Nível</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Versão</th>
              <th className="py-3 px-4">Alunos</th>
              <th className="py-3 px-4">Última Atualização</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tracks.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-900 block">{t.title}</span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{t.shortDescription}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-700">
                  <div className="space-y-0.5">
                    <span className="font-medium">{t.area}</span>
                    <span className="text-[11px] text-slate-400 block">{t.level}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">{statusBadges[t.publishingStatus]}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{t.version}</td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{t.enrolledStudentsCount}</td>
                <td className="py-3.5 px-4 text-slate-500">{t.lastUpdatedAt}</td>
                <td className="py-3.5 px-4 text-right">
                  <Button
                    onClick={() => handleEdit(t)}
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {editingTrack && (
        <Dialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTrack.title ? `Editar Trilha: ${editingTrack.title}` : 'Nova Trilha de Aprendizagem'}
          description="Ajuste parâmetros de publicação, versão e objetivos pedagógicos"
          size="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Título da Trilha"
              value={editingTrack.title}
              onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Área de Conhecimento"
                options={[
                  { value: 'Engenharia de Software', label: 'Engenharia de Software' },
                  { value: 'Banco de Dados', label: 'Banco de Dados' },
                  { value: 'Arquitetura & Backend', label: 'Arquitetura & Backend' },
                  { value: 'Frontend Moderno', label: 'Frontend Moderno' },
                  { value: 'DevOps & Qualidade', label: 'DevOps & Qualidade' },
                ]}
                value={editingTrack.area}
                onChange={(e) => setEditingTrack({ ...editingTrack, area: e.target.value as any })}
              />

              <Select
                label="Nível"
                options={[
                  { value: 'Iniciante', label: 'Iniciante' },
                  { value: 'Intermediário', label: 'Intermediário' },
                  { value: 'Avançado', label: 'Avançado' },
                ]}
                value={editingTrack.level}
                onChange={(e) => setEditingTrack({ ...editingTrack, level: e.target.value as any })}
              />

              <Select
                label="Status de Publicação"
                options={[
                  { value: 'draft', label: 'Rascunho' },
                  { value: 'in_review', label: 'Em Revisão Pedagógica' },
                  { value: 'published', label: 'Publicado' },
                  { value: 'archived', label: 'Arquivado' },
                ]}
                value={editingTrack.publishingStatus}
                onChange={(e) =>
                  setEditingTrack({ ...editingTrack, publishingStatus: e.target.value as any })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Versão Semântica (ex: 2.4.0)"
                value={editingTrack.version}
                onChange={(e) => setEditingTrack({ ...editingTrack, version: e.target.value })}
                required
              />

              <Input
                label="Carga Horária Estimada (horas)"
                type="number"
                value={editingTrack.estimatedHours}
                onChange={(e) =>
                  setEditingTrack({ ...editingTrack, estimatedHours: Number(e.target.value) })
                }
                required
              />
            </div>

            <Textarea
              label="Descrição Curta (para os cards do catálogo)"
              value={editingTrack.shortDescription}
              onChange={(e) => setEditingTrack({ ...editingTrack, shortDescription: e.target.value })}
              rows={2}
              required
            />

            <Textarea
              label="Descrição Completa & Proposta Pedagógica"
              value={editingTrack.fullDescription}
              onChange={(e) => setEditingTrack({ ...editingTrack, fullDescription: e.target.value })}
              rows={4}
              required
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
};
