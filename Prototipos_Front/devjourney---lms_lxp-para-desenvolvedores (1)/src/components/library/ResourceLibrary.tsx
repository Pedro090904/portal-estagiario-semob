import React, { useState } from 'react';
import { Search, FileText, Bookmark, Download, ExternalLink, Code, BookOpen, Layers } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { LearningMaterial } from '../../types/lms';
import { Modal } from '../common/Modal';
import { MarkdownViewer } from '../player/MarkdownViewer';

export const ResourceLibrary: React.FC = () => {
  const {
    materials,
    bookmarkedMaterialIds,
    toggleBookmarkMaterial
  } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingMaterial, setViewingMaterial] = useState<LearningMaterial | null>(null);

  const categories = ['all', 'Cheat Sheet', 'Guia Prático', 'Template', 'Documentação'];

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'bookmarked') return bookmarkedMaterialIds.includes(item.id);
    return item.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Repositório de Documentos & Cheat Sheets</span>
            <span aria-hidden="true">·</span>
            <span>Apoio Técnico ao Desenvolvedor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Biblioteca de Materiais Técnicos
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Consulte resumos de comandos, especificações da linguagem, arquiteturas de referência e guias de boas práticas desenvolvidos para complementar seu aprendizado nas aulas.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tópicos, Git, Flexbox, React..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
            <button
              onClick={() => setSelectedCategory('bookmarked')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'bookmarked'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Salvos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMaterials.map((item) => {
          const isBookmarked = bookmarkedMaterialIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{item.readTimeMinutes} min de leitura</span>
                  </div>

                  <button
                    onClick={() => toggleBookmarkMaterial(item.id)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors"
                    title={isBookmarked ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {item.moduleName && (
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Módulo: {item.moduleName}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setViewingMaterial(item)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Visualizar Documento</span>
                </button>

                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Acessar no GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Integrated Document Viewer Modal */}
      <Modal
        isOpen={!!viewingMaterial}
        onClose={() => setViewingMaterial(null)}
        title={viewingMaterial?.title}
        subtitle={`${viewingMaterial?.category} · ${viewingMaterial?.readTimeMinutes} min de leitura`}
        maxWidth="3xl"
      >
        {viewingMaterial && (
          <div className="space-y-6">
            <MarkdownViewer
              content={viewingMaterial.markdownContent}
              codeSnippet={viewingMaterial.codeSnippet}
            />

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setViewingMaterial(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-semibold transition-colors"
              >
                Fechar Visualizador
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
