import React from 'react';
import { FileText, MessageSquare, ArrowUpRight, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';

export const QuickAccess: React.FC = () => {
  const {
    materials,
    forumThreads,
    setCurrentTab,
    toggleUpvoteThread,
    bookmarkedMaterialIds,
    toggleBookmarkMaterial
  } = useLMS();

  // Show top 3 materials
  const recentMaterials = materials.slice(0, 3);
  // Show top 2 active threads
  const recentThreads = forumThreads.slice(0, 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Materials Quick Access */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Materiais Recentes & Cheat Sheets
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Documentações essenciais e resumos rápidos
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('library')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Todos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentMaterials.map((mat) => {
              const isBookmarked = bookmarkedMaterialIds.includes(mat.id);
              return (
                <div
                  key={mat.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{mat.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{mat.readTimeMinutes} min de leitura</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {mat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {mat.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleBookmarkMaterial(mat.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors"
                      title={isBookmarked ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                    </button>
                    <button
                      onClick={() => setCurrentTab('library')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors"
                      title="Abrir no leitor"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Community Doubts & Threads Quick Access */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Fórum de Dúvidas da Trilha
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Discussões recentes respondidas por instrutores e monitores
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('community')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Fórum</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentThreads.map((thread) => {
              return (
                <div
                  key={thread.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{thread.authorName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{thread.createdAt}</span>
                    </div>
                    {thread.solved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolvida
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => setCurrentTab('community')}
                    className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    {thread.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="truncate max-w-[200px]">{thread.moduleTitle}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleUpvoteThread(thread.id)}
                        className={`flex items-center gap-1 font-mono tabular-nums ${
                          thread.userHasUpvoted ? 'text-indigo-600 font-bold' : 'hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        ▲ {thread.upvotes}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {thread.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
