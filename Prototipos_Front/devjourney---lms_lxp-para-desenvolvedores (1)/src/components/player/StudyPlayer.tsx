import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  Maximize2,
  Volume2,
  FileText,
  Edit3,
  HelpCircle,
  Trophy,
  GitFork,
  BookOpen
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { MarkdownViewer } from './MarkdownViewer';
import { ProgressBar } from '../common/ProgressBar';

export const StudyPlayer: React.FC = () => {
  const {
    activeTrack,
    activeModule,
    activeLessonId,
    setActiveLesson,
    completedLessonIds,
    toggleLessonCompleted,
    setCurrentTab,
    notes,
    saveNote,
    openQuizModal,
    quizResults
  } = useLMS();

  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'resources'>('content');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);

  const currentLesson =
    activeModule?.lessons.find((l) => l.id === activeLessonId) ||
    activeModule?.lessons[0];

  useEffect(() => {
    if (currentLesson) {
      setCurrentNote(notes[currentLesson.id] || '');
    }
  }, [currentLesson, notes]);

  if (!activeModule || !currentLesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nenhuma aula selecionada</h2>
        <p className="text-sm text-slate-500 mt-2">Escolha um módulo na Árvore de Habilidades para começar.</p>
        <button
          onClick={() => setCurrentTab('skill-tree')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
        >
          Ir para a Skill Tree
        </button>
      </div>
    );
  }

  const isCompleted = completedLessonIds.includes(currentLesson.id);
  const lessons = activeModule.lessons;
  const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const quizResult = quizResults[activeModule.id];
  const isQuizPassed = quizResult?.passed === true;

  const completedCount = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const handleSaveNotes = () => {
    saveNote(currentLesson.id, currentNote);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2000);
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      setActiveLesson(activeModule.id, nextLesson.id);
    }
  };

  const handlePrevLesson = () => {
    if (prevLesson) {
      setActiveLesson(activeModule.id, prevLesson.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      {/* Top Bar for Immersive Classroom */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-16 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('skill-tree')}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar para a Trilha</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {activeTrack.title} · Módulo {activeModule.order}
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
              {activeModule.title}
            </h1>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevLesson}
            disabled={!prevLesson}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <button
            onClick={handleNextLesson}
            disabled={!nextLesson}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Study Layout: Content Deck (Left) + Index Sidebar (Right) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left: Video / Article Player & Lesson Materials */}
        <div className="flex-1 space-y-6">
          {/* Video Player Box (if videoUrl) */}
          {currentLesson.type === 'video' ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
              <video
                key={currentLesson.id}
                src={currentLesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                className="w-full h-full object-cover"
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                  Atividade Teórico-Prática
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h2>
              </div>
            </div>
          )}

          {/* Lesson Header & Mark Completed CTA */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Aula {currentIndex + 1} de {lessons.length}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {currentLesson.durationMinutes} minutos
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{currentLesson.type}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h2>
              </div>

              {/* Complete Lesson Button */}
              <button
                onClick={() => toggleLessonCompleted(currentLesson.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Aula Concluída' : 'Marcar como Concluída (+35 XP)'}</span>
              </button>
            </div>

            {/* Tab navigation inside lesson (Content, Notes) */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 mt-6 pt-2">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'content'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Conteúdo & Código</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Minhas Anotações</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="pt-6">
              {activeTab === 'content' ? (
                <MarkdownViewer
                  content={currentLesson.contentMarkdown}
                  codeSnippet={currentLesson.codeSnippet}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Caderno de estudos pessoal (sincronizado automaticamente no seu navegador)</span>
                    {isSavedAlert && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
                        Salvo com sucesso!
                      </span>
                    )}
                  </div>
                  <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    rows={8}
                    placeholder="Escreva seus resumos, dúvidas para o fórum, ou comandos que aprendeu nesta aula..."
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Salvar Anotação
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Module Index & Quiz Unlock Card */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Module Lessons Index Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Ementa do Módulo
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeModule.title}
              </h3>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                <span>{completedCount} de {lessons.length} aulas</span>
                <span className="font-mono tabular-nums">{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} showPercentage={false} size="sm" color="primary" />
            </div>

            {/* Lesson List */}
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {lessons.map((lesson, idx) => {
                const isSelected = lesson.id === currentLesson.id;
                const isDone = completedLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(activeModule.id, lesson.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-slate-400 font-mono mb-0.5">
                        Aula {idx + 1} · {lesson.durationMinutes}m
                      </div>
                      <div
                        className={`text-xs font-semibold truncate ${
                          isSelected
                            ? 'text-indigo-900 dark:text-indigo-200 font-bold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lesson.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Quiz Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Avaliação de Domínio
              </h4>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Realize a prova com nota mínima de <strong>70%</strong> para consolidar suas horas e desbloquear os módulos seguintes da Skill Tree.
            </p>

            {isQuizPassed && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  Aprovado com <strong>{quizResult.scorePercent}%</strong> de acerto!
                </span>
              </div>
            )}

            <button
              onClick={() => openQuizModal(activeModule)}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isQuizPassed
                  ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{isQuizPassed ? 'Refazer Avaliação' : 'Iniciar Prova do Módulo'}</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
