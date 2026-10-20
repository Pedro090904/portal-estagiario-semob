import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lock,
  Code
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';

export const QuizModal: React.FC = () => {
  const { quizModalModule, closeQuizModal, submitQuiz, setCurrentTab } = useLMS();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<{ passed: boolean; rewardXP: number; scorePercent: number } | null>(null);

  useEffect(() => {
    if (quizModalModule) {
      setSelectedAnswers({});
      setCurrentQuestionIdx(0);
      setQuizSubmitted(false);
      setLastResult(null);
    }
  }, [quizModalModule]);

  if (!quizModalModule) return null;

  const quiz = quizModalModule.quiz;
  const questions = quiz.questions;
  const currentQ = questions[currentQuestionIdx];

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleFinishQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const { passed, rewardXP } = submitQuiz(quizModalModule.id, scorePercent);

    setLastResult({
      passed,
      rewardXP,
      scorePercent
    });
    setQuizSubmitted(true);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setQuizSubmitted(false);
    setLastResult(null);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <Modal
      isOpen={!!quizModalModule}
      onClose={closeQuizModal}
      title={quiz.title}
      subtitle={`Módulo ${quizModalModule.order}: ${quizModalModule.title} · Nota mínima para aprovação: ${quiz.passingScorePercent}%`}
      maxWidth="3xl"
    >
      {!quizSubmitted ? (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>
                Questão {currentQuestionIdx + 1} de {questions.length}
              </span>
              <span className="font-mono tabular-nums">
                {answeredCount} respondida(s)
              </span>
            </div>
            <ProgressBar
              value={((currentQuestionIdx + 1) / questions.length) * 100}
              showPercentage={false}
              size="sm"
            />
          </div>

          {/* Current Question Body */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {currentQuestionIdx + 1}
              </span>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {currentQ.question}
                </h3>

                {/* Code Snippet for Code Analysis Questions */}
                {currentQ.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-indigo-300">
                    <pre>
                      <code>{currentQ.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{opt.text}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-400 dark:border-slate-500'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentQuestionIdx((idx) => Math.max(0, idx - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Questão Anterior
            </button>

            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((idx) => Math.min(questions.length - 1, idx + 1))}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <span>Próxima Questão</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                disabled={!isAllAnswered}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Finalizar Avaliação</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Pedagogical Feedback View */
        <div className="space-y-6">
          {/* Result Banner */}
          <div
            className={`p-6 rounded-2xl border text-center space-y-2 ${
              lastResult?.passed
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-2xl mb-2 bg-white dark:bg-slate-900 shadow-sm">
              {lastResult?.passed ? (
                <Trophy className="w-8 h-8 text-amber-500" />
              ) : (
                <RotateCcw className="w-7 h-7 text-amber-600" />
              )}
            </div>

            <div className="text-3xl font-extrabold font-mono tabular-nums">
              {lastResult?.scorePercent}%
            </div>

            <h3 className="text-lg font-bold">
              {lastResult?.passed
                ? 'Parabéns! Módulo Aprovado com Sucesso!'
                : 'Nota Insuficiente para Desbloqueio'}
            </h3>

            <p className="text-xs max-w-md mx-auto opacity-90 leading-relaxed">
              {lastResult?.passed
                ? `Você atingiu os requisitos mínimos e recebeu +${lastResult.rewardXP} XP! O próximo módulo na Árvore de Habilidades foi liberado.`
                : `Você atingiu ${lastResult?.scorePercent}%, mas a nota mínima é de ${quiz.passingScorePercent}%. Analise os erros abaixo e tente novamente.`}
            </p>
          </div>

          {/* Feedback per question */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Gabarito & Explicações Pedagógicas
            </h4>

            {questions.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correctOptionId;
              const correctOption = q.options.find((o) => o.id === q.correctOptionId);

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <span>{idx + 1}.</span>
                      <span>{q.question}</span>
                    </div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> Correto
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-rose-600 shrink-0">
                        <XCircle className="w-4 h-4" /> Incorreto
                      </span>
                    )}
                  </div>

                  <div className="text-slate-600 dark:text-slate-300 pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Resposta correta:{' '}
                    </span>
                    {correctOption?.text}
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    💡 {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final CTA Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refazer Quiz</span>
            </button>

            {lastResult?.passed ? (
              <button
                onClick={() => {
                  closeQuizModal();
                  setCurrentTab('skill-tree');
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Avançar na Skill Tree</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={closeQuizModal}
                className="px-6 py-2.5 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Revisar Conteúdo da Aula
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
