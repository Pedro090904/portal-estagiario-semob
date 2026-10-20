import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  Send,
  User,
  ShieldCheck
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { ForumThread } from '../../types/lms';
import { MOCK_FAQS } from '../../data/mockForum';
import { Modal } from '../common/Modal';

export const ForumCommunity: React.FC = () => {
  const {
    forumThreads,
    toggleUpvoteThread,
    addForumThread,
    addCommentToThread,
    activeTrack
  } = useLMS();

  const [activeTab, setActiveTab] = useState<'threads' | 'faq'>('threads');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(forumThreads[0] || null);
  const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Form states for new thread
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newModuleId, setNewModuleId] = useState(activeTrack.modules?.[0]?.id || 'mod-1');
  const [newTags, setNewTags] = useState('');

  // Comment input
  const [commentInput, setCommentInput] = useState('');

  const filteredThreads = forumThreads.filter((t) => {
    return (
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addForumThread({
      title: newTitle,
      content: newContent,
      moduleId: newModuleId,
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    });

    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setIsNewThreadModalOpen(false);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedThread) return;

    addCommentToThread(selectedThread.id, commentInput);
    setCommentInput('');
  };

  // Keep selectedThread in sync if threads update
  const currentSelected = selectedThread
    ? forumThreads.find((t) => t.id === selectedThread.id) || selectedThread
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Canais de Dúvidas & Suporte Técnico</span>
              <span aria-hidden="true">·</span>
              <span>Comunidade Ativa DevJourney</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Comunidade & Fórum de Dúvidas
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tire dúvidas diretamente com instrutores, monitores e outros estudantes da trilha. Participe de discussões e ganhe pontos de experiência (XP) por suas contribuições!
            </p>
          </div>

          <button
            onClick={() => setIsNewThreadModalOpen(true)}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Dúvida</span>
          </button>
        </div>

        {/* View Switcher Tabs (Fórum vs FAQ) */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-6 pt-4">
          <button
            onClick={() => setActiveTab('threads')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'threads'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tópicos & Dúvidas ({forumThreads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Perguntas Frequentes (FAQ)</span>
          </button>
        </div>
      </div>

      {activeTab === 'threads' ? (
        /* Threads Two-Column Layout (Slack/Discord Style) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Threads Channel List (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por dúvidas ou tags..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {filteredThreads.map((thread) => {
                const isSelected = currentSelected?.id === thread.id;

                return (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-medium truncate max-w-[180px] text-indigo-600 dark:text-indigo-400">
                        {thread.moduleTitle}
                      </span>
                      <span>{thread.createdAt}</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {thread.title}
                    </h3>

                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={thread.authorAvatar}
                          alt={thread.authorName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-[11px] truncate max-w-[100px]">{thread.authorName}</span>
                      </div>

                      <div className="flex items-center gap-3 font-mono tabular-nums text-[11px]">
                        <span className="flex items-center gap-1">
                          ▲ {thread.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {thread.commentsCount}
                        </span>
                        {thread.solved && (
                          <span title="Resolvida">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Thread Details & Reply Box (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            {currentSelected ? (
              <>
                {/* Thread Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentSelected.authorAvatar}
                        alt={currentSelected.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {currentSelected.authorName}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          Postado {currentSelected.createdAt} · {currentSelected.moduleTitle}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleUpvoteThread(currentSelected.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        currentSelected.userHasUpvoted
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">{currentSelected.upvotes}</span>
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {currentSelected.title}
                  </h2>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {currentSelected.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {currentSelected.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Answers / Comments Section */}
                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Respostas ({currentSelected.comments.length})
                  </h3>

                  <div className="space-y-3">
                    {currentSelected.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-4 rounded-xl border space-y-2 text-xs sm:text-sm ${
                          comment.isSolution
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              {comment.authorName}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                comment.authorRole === 'Instrutor'
                                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                                  : comment.authorRole === 'Monitor'
                                  ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {comment.authorRole}
                            </span>
                          </div>

                          {comment.isSolution && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Solução Aprovada
                            </span>
                          )}
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Reply Form */}
                  <form onSubmit={handleSendComment} className="pt-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Escreva sua resposta para ajudar o colega..."
                        className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Responder</span>
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-slate-400">
                Selecione uma dúvida ao lado para visualizar a discussão.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* FAQ Section (Accordion) */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Perguntas Frequentes por Módulo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Esclareça dúvidas operacionais sobre progressão, certificados, quizzes e ambiente de desenvolvimento.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl">
            {MOCK_FAQS.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Thread Modal */}
      <Modal
        isOpen={isNewThreadModalOpen}
        onClose={() => setIsNewThreadModalOpen(false)}
        title="Criar Nova Dúvida na Comunidade"
        subtitle="Compartilhe seu questionamento com clareza para receber respostas rápidas"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateThread} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Módulo Relacionado
            </label>
            <select
              value={newModuleId}
              onChange={(e) => setNewModuleId(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {activeTrack.modules?.map((m) => (
                <option key={m.id} value={m.id}>
                  Módulo {m.order}: {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título da Dúvida
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Como lidar com tipagem de Promises no TypeScript?"
              className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição Detalhada do Problema
            </label>
            <textarea
              required
              rows={5}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Descreva o que você estava tentando fazer, o erro que apareceu e os passos que você já tentou..."
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Ex: TypeScript, Promises, Async"
              className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsNewThreadModalOpen(false)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              Publicar Tópico (+20 XP)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
