/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Clock,
  Check,
  HelpCircle,
  AlertCircle,
  FileText,
  List,
} from 'lucide-react';
import { Track, Stage } from '../../types';
import { ApiService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../ui/Button';
import { CodeBlock } from '../ui/CodeBlock';
import { Alert } from '../ui/Alert';

interface StudyReaderProps {
  stageId?: string;
  trackId?: string;
  onNavigate: (section: string, payload?: any) => void;
}

export const StudyReader: React.FC<StudyReaderProps> = ({
  stageId = 'stage-git-reading',
  trackId = 'track-interns-dev',
  onNavigate,
}) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCompletedState, setIsCompletedState] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    async function load() {
      const data = await ApiService.getTrackById(trackId);
      if (data) {
        setTrack(data);
        // Find stage
        let found: Stage | undefined;
        for (const mod of data.modules) {
          const s = mod.stages.find((item) => item.id === stageId);
          if (s) {
            found = s;
            break;
          }
        }
        if (found) {
          setCurrentStage(found);
          setIsCompletedState(found.isCompleted);
        }
      }
    }
    load();
  }, [stageId, trackId]);

  if (!currentStage || !track) {
    return (
      <div className="p-8 text-center text-slate-500">
        Carregando conteúdo de estudo...
      </div>
    );
  }

  const handleMarkAsCompleted = async () => {
    try {
      await ApiService.markStageCompleted(track.id, currentStage.id);
      setIsCompletedState(true);
      showSuccess(
        'Etapa concluída!',
        'Seu progresso na trilha foi atualizado e salvo com sucesso.'
      );
    } catch (e) {
      showError('Erro ao salvar progresso', 'Tente novamente em instantes.');
    }
  };

  const handleQuizOptionSelect = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleQuizSubmit = () => {
    const questions = currentStage.quizQuestions || [];
    const answeredCount = Object.keys(selectedQuizAnswers).length;
    if (answeredCount < questions.length) {
      showError('Responda todas as questões antes de validar');
      return;
    }

    setQuizSubmitted(true);
    const correctCount = questions.filter(
      (q) => selectedQuizAnswers[q.id] === q.correctOptionId
    ).length;

    if (correctCount === questions.length) {
      showSuccess(
        'Excelente! 100% de acertos!',
        'Você demonstrou domínio dos conceitos apresentados nesta etapa.'
      );
      handleMarkAsCompleted();
    } else {
      showError(
        `${correctCount} de ${questions.length} questões corretas`,
        'Revise as explicações e tente novamente.'
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      {/* Lateral Syllabus Navigation */}
      <aside className="w-full lg:w-72 shrink-0 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4 lg:sticky lg:top-20">
        <button
          type="button"
          onClick={() => onNavigate('track_detail')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Índice da Trilha</span>
        </button>

        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Estrutura da Trilha
          </p>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {track.modules.map((m) => (
              <div key={m.id} className="space-y-1">
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{m.title}</p>
                <div className="space-y-0.5 pl-2 border-l border-slate-200">
                  {m.stages.map((s) => {
                    const isCurrent = s.id === currentStage.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          if (s.type === 'reading' || s.type === 'quiz') {
                            setCurrentStage(s);
                            setIsCompletedState(s.isCompleted);
                            setQuizSubmitted(false);
                            setSelectedQuizAnswers({});
                          } else {
                            onNavigate(
                              s.type === 'sql_challenge'
                                ? 'challenge_sql'
                                : s.type === 'backend_challenge'
                                ? 'challenge_backend'
                                : s.type === 'frontend_challenge'
                                ? 'challenge_frontend'
                                : 'projects'
                            );
                          }
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                          isCurrent
                            ? 'bg-indigo-50 text-indigo-900 font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{s.title}</span>
                        {s.isCompleted && (
                          <span className="text-emerald-600 text-xs shrink-0 font-bold">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Study Content Area */}
      <main className="flex-1 min-w-0 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs">
        {/* Stage metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="font-semibold text-indigo-700">Etapa de Aprendizagem</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {currentStage.durationMinutes} minutos de leitura
          </span>
          {isCompletedState && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Concluída
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
          {currentStage.title}
        </h1>

        <p className="text-sm text-slate-600 pb-6 border-b border-slate-200 leading-relaxed mb-8">
          {currentStage.description}
        </p>

        {/* Formatted Markdown Content */}
        <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
          {currentStage.contentMarkdown ? (
            <div className="space-y-6">
              {currentStage.contentMarkdown.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('# ')) {
                  return null; // Skip main title as we already rendered it
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2
                      key={idx}
                      className="text-lg font-bold text-slate-900 pt-4 border-t border-slate-100"
                    >
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('```')) {
                  const lines = paragraph.split('\n');
                  const lang = lines[0].replace('```', '') || 'sql';
                  const code = lines.slice(1, -1).join('\n');
                  return <CodeBlock key={idx} code={code} language={lang} />;
                }
                if (paragraph.startsWith('> ')) {
                  return (
                    <Alert key={idx} type="info">
                      {paragraph.replace('> ', '').replace('**Dica Importante**: ', '')}
                    </Alert>
                  );
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>
          ) : (
            <p>Conteúdo em formulação pelo time pedagógico.</p>
          )}
        </div>

        {/* Embedded Quiz / Knowledge check if present */}
        {currentStage.quizQuestions && currentStage.quizQuestions.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>Verificação de Aprendizagem</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Responda para validar sua compreensão
              </h2>
              <p className="text-xs text-slate-500">
                A conclusão desta etapa requer a validação correta das questões abaixo.
              </p>
            </div>

            <div className="space-y-6">
              {currentStage.quizQuestions.map((q, qIndex) => {
                const selectedOpt = selectedQuizAnswers[q.id];
                const isCorrect = selectedOpt === q.correctOptionId;

                return (
                  <div key={q.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {qIndex + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const isOptionSelected = selectedOpt === opt.id;
                        let optStyle = 'border-slate-200 bg-white hover:border-slate-300';
                        if (isOptionSelected) {
                          optStyle = 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900';
                        }
                        if (quizSubmitted && opt.id === q.correctOptionId) {
                          optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                        } else if (quizSubmitted && isOptionSelected && !isCorrect) {
                          optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleQuizOptionSelect(q.id, opt.id)}
                            className={`w-full p-3 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${optStyle}`}
                          >
                            <span>{opt.text}</span>
                            {quizSubmitted && opt.id === q.correctOptionId && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="text-xs text-slate-600 p-3 rounded-lg bg-white border border-slate-200">
                        <span className="font-semibold text-slate-900 block mb-0.5">Explicação Técnica:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-end gap-3 pt-2">
                {!quizSubmitted ? (
                  <Button onClick={handleQuizSubmit} size="md">
                    Validar Respostas
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedQuizAnswers({});
                    }}
                    variant="outline"
                    size="md"
                  >
                    Tentar Novamente
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer actions: Mark as completed & Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('track_detail')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Voltar à Trilha
          </Button>

          <div className="flex items-center gap-3">
            {!currentStage.quizQuestions && (
              <Button
                variant={isCompletedState ? 'outline' : 'primary'}
                size="md"
                onClick={handleMarkAsCompleted}
                leftIcon={isCompletedState ? <Check className="w-4 h-4 text-emerald-600" /> : undefined}
              >
                {isCompletedState ? 'Marcada como Concluída' : 'Marcar Leitura como Concluída'}
              </Button>
            )}

            <Button
              onClick={() => onNavigate('challenge_sql')}
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Próxima Etapa: Laboratório SQL
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
