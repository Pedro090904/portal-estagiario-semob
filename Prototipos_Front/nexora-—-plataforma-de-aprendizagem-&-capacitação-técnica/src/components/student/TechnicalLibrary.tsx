/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  ArrowRight,
  ExternalLink,
  Tag,
  Calendar,
  X,
} from 'lucide-react';
import { LibraryItem } from '../../types';
import { ApiService } from '../../services/api';
import { Input } from '../ui/Input';
import { Tabs } from '../ui/Tabs';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { CodeBlock } from '../ui/CodeBlock';
import { EmptyState } from '../ui/EmptyState';

interface TechnicalLibraryProps {
  onNavigate: (section: string, payload?: any) => void;
}

export const TechnicalLibrary: React.FC<TechnicalLibraryProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  useEffect(() => {
    async function load() {
      const data = await ApiService.getLibraryItems();
      setItems(data);
    }
    load();
  }, []);

  const categories = [
    { id: 'all', label: 'Todos os Materiais' },
    { id: 'Manuais', label: 'Manuais de Engenharia' },
    { id: 'Guias Rápidos', label: 'Guias Rápidos (Cheatsheets)' },
    { id: 'Boas Práticas', label: 'Boas Práticas & RFCs' },
    { id: 'Normas & Padrões', label: 'Normas & Acessibilidade' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>BASE DE CONHECIMENTO & CONSULTA RÁPIDA</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Biblioteca Técnica</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Consulte manuais, especificações de arquitetura, referências rápidas de sintaxe e guias de normas para aplicar no seu dia a dia profissional.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
        <Input
          placeholder="Pesquisar manuais (ex: Git, JOIN, WCAG, RFC 7807)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Tabs
            items={categories}
            activeId={selectedCategory}
            onChange={setSelectedCategory}
            variant="segmented"
          />
          <span className="text-xs text-slate-400 hidden sm:inline">
            {filteredItems.length} materiais disponíveis
          </span>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8 text-slate-400" />}
          title="Nenhum material encontrado"
          description="Verifique os termos da busca ou limpe os filtros para visualizar os outros artigos."
          actionLabel="Limpar Busca"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              padding="md"
              variant="interactive"
              onClick={() => setSelectedItem(item)}
              className="flex flex-col justify-between group"
            >
              <div>
                {/* Clean unboxed metadata with typographic separators */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-indigo-700">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.readingTimeMinutes} min
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Atualizado em {item.lastUpdated}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {item.summary}
                </p>

                {/* Clean tags without pill capsules */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500">
                  <span className="text-slate-400">Tópicos:</span>
                  {item.tags.map((tag, i) => (
                    <span key={tag} className="font-medium text-slate-700">
                      #{tag}
                      {i < item.tags.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Ler Documento Completo
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                {item.relatedTrackId && (
                  <span className="text-slate-400 text-[11px]">Vinculado à Trilha de Devs</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {selectedItem && (
        <Dialog
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          description={`${selectedItem.category} · Leitura estimada de ${selectedItem.readingTimeMinutes} minutos`}
          size="lg"
          footer={
            <Button onClick={() => setSelectedItem(null)} variant="outline" size="sm">
              Fechar Documento
            </Button>
          }
        >
          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            {selectedItem.contentMarkdown.split('\n\n').map((para, idx) => {
              if (para.startsWith('# ')) {
                return null;
              }
              if (para.startsWith('## ')) {
                return (
                  <h3
                    key={idx}
                    className="text-base font-bold text-slate-900 pt-3 border-t border-slate-100"
                  >
                    {para.replace('## ', '')}
                  </h3>
                );
              }
              if (para.startsWith('```')) {
                const lines = para.split('\n');
                const lang = lines[0].replace('```', '') || 'sql';
                const code = lines.slice(1, -1).join('\n');
                return <CodeBlock key={idx} code={code} language={lang} />;
              }
              return <p key={idx}>{para}</p>;
            })}
          </div>
        </Dialog>
      )}
    </div>
  );
};
