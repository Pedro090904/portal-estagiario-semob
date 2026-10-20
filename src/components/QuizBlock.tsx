import React, { useState, useEffect } from 'react';
import { QuizBlockData, QuizAttempt, QuizQuestion } from '../types';
import { evaluateQuizAttempt, PASSING_PERCENTAGE } from '../services/progressEngine';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  Send, 
  Award, 
  HelpCircle,
  Code,
  ChevronLeft,
  ChevronRight,
  List,
  Layers,
} from 'lucide-react';

interface QuizBlockProps {
  quiz?: QuizBlockData;
  moduleId?: string;
  moduleTitle?: string;
  questions?: QuizQuestion[];
  previousAttempt?: QuizAttempt;
  existingAttempt?: QuizAttempt;
  onSaveAttempt?: (attempt: QuizAttempt) => void;
  onCompleteQuiz?: (attempt: QuizAttempt) => void;
}

export const QuizBlock: React.FC<QuizBlockProps> = ({
  quiz: propQuiz,
  moduleId,
  moduleTitle,
  questions: propQuestions,
  previousAttempt,
  existingAttempt: propExistingAttempt,
  onSaveAttempt,
  onCompleteQuiz,
}) => {
  const existingAttempt = propExistingAttempt || previousAttempt;
  const effectiveQuestions = propQuiz?.questions || propQuestions || [];
  const effectiveModuleId = moduleId || propQuiz?.moduleId || propQuiz?.id || 'mod-1-ambiente';

  const quiz: QuizBlockData = propQuiz || {
    id: effectiveModuleId,
    moduleId: effectiveModuleId,
    title: moduleTitle ? `Quiz: ${moduleTitle}` : 'Quiz de Validação de Competências',
    subtitle: 'Validação Oficial de Aprendizagem (≥ 70%)',
    badge: 'Avaliação Oficial',
    description: 'Valide os conhecimentos adquiridos neste módulo técnico da SUTINF.',
    passingScore: PASSING_PERCENTAGE,
    questions: effectiveQuestions,
  };

  const handleSaveAttemptCallback = (att: QuizAttempt) => {
    if (onSaveAttempt) onSaveAttempt(att);
    if (onCompleteQuiz) onCompleteQuiz(att);
  };

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'list'>('carousel');

  // Carregar tentativa anterior se houver
  useEffect(() => {
    if (existingAttempt) {
      if (existingAttempt.selectedAnswers) {
        const parsed: Record<string, number> = {};
        Object.entries(existingAttempt.selectedAnswers).forEach(([qId, val]) => {
          parsed[qId] = typeof val === 'number' ? val : Number(val);
        });
        setSelectedAnswers(parsed);
      }
      setIsSubmitted(true);
    } else {
      setSelectedAnswers({});
      setIsSubmitted(false);
    }
    setCurrentIndex(0);
  }, [quiz.id, existingAttempt]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setValidationError(null);
  };

  const handleSubmit = () => {
    const unansweredQuestions = quiz.questions.filter((q) => selectedAnswers[q.id] === undefined);
    if (unansweredQuestions.length > 0) {
      // Leva o usuário para a primeira pergunta não respondida
      const firstUnansweredIndex = quiz.questions.findIndex((q) => selectedAnswers[q.id] === undefined);
      if (firstUnansweredIndex !== -1) {
        setCurrentIndex(firstUnansweredIndex);
      }
      setValidationError(
        `Você ainda tem ${unansweredQuestions.length} questão(ões) sem resposta. Selecione uma opção antes de finalizar.`
      );
      return;
    }

    const attempt = evaluateQuizAttempt(effectiveModuleId, quiz.questions, selectedAnswers);
    attempt.selectedAnswers = selectedAnswers;
    attempt.quizId = quiz.id;

    setIsSubmitted(true);
    handleSaveAttemptCallback(attempt);

    if (attempt.passed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // confetti fallback
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setValidationError(null);
    setCurrentIndex(0);
  };

  const currentScore = existingAttempt?.percentage ?? (
    isSubmitted
      ? Math.round(
          (quiz.questions.filter((q) => selectedAnswers[q.id] === q.correctOptionIndex).length /
            quiz.questions.length) *
            100
        )
      : null
  );

  const totalQuestions = quiz.questions.length;
  if (totalQuestions === 0) return null;

  const currentQuestion = quiz.questions[currentIndex] || quiz.questions[0];
  const answeredCount = quiz.questions.filter((q) => selectedAnswers[q.id] !== undefined).length;

  const renderQuestionCard = (question: QuizQuestion, index: number) => {
    const userAnswer = selectedAnswers[question.id];
    const isAnswered = userAnswer !== undefined;
    const isCorrect = isAnswered && userAnswer === question.correctOptionIndex;

    return (
      <div 
        key={question.id} 
        className={`quiz-question-item ${isSubmitted ? (isCorrect ? 'item-correct' : 'item-wrong') : ''}`}
        style={{ margin: 0 }}
      >
        <div className="question-top">
          <span className="question-number">Questão {index + 1} de {totalQuestions}</span>
          <span className="question-cat">{question.competencyTag || question.category}</span>
          {isSubmitted && (
            <span className={`status-pill ${isCorrect ? 'pill-green' : 'pill-red'}`}>
              {isCorrect ? (
                <>
                  <CheckCircle size={14} /> Correto (+{Math.round(100 / totalQuestions)}%)
                </>
              ) : (
                <>
                  <XCircle size={14} /> Incorreto
                </>
              )}
            </span>
          )}
        </div>

        <div className="question-text">{question.question}</div>

        {question.codeSnippet && (
          <div className="question-code-box">
            <div className="code-header">
              <Code size={14} />
              <span>{question.language || 'typescript'}</span>
            </div>
            <pre>
              <code>{question.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Opções */}
        <div className="quiz-options-group">
          {question.options.map((opt, optIndex) => {
            const optText = typeof opt === 'string' ? opt : opt.text;
            const isSelected = userAnswer === optIndex;
            const isThisOptionCorrect = optIndex === question.correctOptionIndex;

            let optionClass = 'quiz-option-card';
            if (isSelected) optionClass += ' selected';

            if (isSubmitted) {
              if (isThisOptionCorrect) {
                optionClass += ' is-correct-answer';
              } else if (isSelected && !isThisOptionCorrect) {
                optionClass += ' is-wrong-answer';
              }
            }

            const letter = String.fromCharCode(65 + optIndex);

            return (
              <label 
                key={optIndex} 
                className={optionClass}
                onClick={() => handleSelectOption(question.id, optIndex)}
              >
                <input
                  type="radio"
                  name={`quiz_${quiz.id}_${question.id}`}
                  value={optIndex}
                  checked={isSelected}
                  disabled={isSubmitted}
                  onChange={() => {}}
                  className="quiz-radio"
                />
                <span className="opt-letter">{letter}</span>
                <span className="opt-text">{optText}</span>
                {isSubmitted && isThisOptionCorrect && (
                  <CheckCircle size={18} className="opt-feedback-icon icon-green" />
                )}
                {isSubmitted && isSelected && !isThisOptionCorrect && (
                  <XCircle size={18} className="opt-feedback-icon icon-red" />
                )}
              </label>
            );
          })}
        </div>

        {/* Explicação Didática / Gabarito Comentado */}
        {isSubmitted && (
          <div className="quiz-explanation-box">
            <div className="explanation-title">
              <HelpCircle size={16} />
              <strong>Gabarito Didático Comentado:</strong>
            </div>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="quiz-block-card">
      <div className="quiz-header">
        <div className="quiz-header-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="quiz-badge-wrap">
            <span className="quiz-badge">{quiz.badge}</span>
            <span className="quiz-pass-score">Mínimo para aprovação: {PASSING_PERCENTAGE}%</span>
          </div>

          {/* Toggle entre Carrossel e Lista */}
          <div className="quiz-view-toggle" style={{ display: 'flex', gap: '0.35rem', background: 'var(--surface-elevated, rgba(255,255,255,0.04))', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setViewMode('carousel')}
              className={`btn-secondary ${viewMode === 'carousel' ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', border: 'none' }}
              title="Apresentação em Carrossel (uma questão por vez)"
            >
              <Layers size={13} />
              <span>Carrossel</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`btn-secondary ${viewMode === 'list' ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', border: 'none' }}
              title="Apresentação em Lista corrida"
            >
              <List size={13} />
              <span>Lista</span>
            </button>
          </div>
        </div>

        <h3 className="quiz-title">{quiz.title}</h3>
        <p className="quiz-subtitle">{quiz.subtitle}</p>
        <p className="quiz-desc">{quiz.description}</p>
      </div>

      {/* Alerta de validação */}
      {validationError && (
        <div className="quiz-alert error">
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Banner de resultado se já enviado */}
      {isSubmitted && currentScore !== null && (
        <div className={`quiz-result-banner ${currentScore >= PASSING_PERCENTAGE ? 'passed' : 'failed'}`}>
          <div className="result-icon-box">
            {currentScore >= PASSING_PERCENTAGE ? (
              <Award className="icon-success" size={32} />
            ) : (
              <AlertCircle className="icon-fail" size={32} />
            )}
          </div>
          <div className="result-details">
            <h4>
              {currentScore >= PASSING_PERCENTAGE
                ? '🎉 Parabéns! Você foi APROVADO(A) neste bloco!'
                : 'Ainda não atingiu a pontuação mínima.'}
            </h4>
            <p>
              Sua pontuação: <strong>{currentScore}%</strong> (
              {quiz.questions.filter((q) => selectedAnswers[q.id] === q.correctOptionIndex).length} de {totalQuestions} questões corretas).
            </p>
            <p className="result-hint">
              {currentScore >= PASSING_PERCENTAGE
                ? 'Excelente domínio dos padrões da SEMOB. Você pode revisar o gabarito comentado abaixo ou avançar para o próximo módulo.'
                : 'Recomendamos reler o manual técnico oficial acima e tentar novamente para fixar os conceitos.'}
            </p>
          </div>
          <button onClick={handleReset} className="btn-secondary btn-sm" title="Refazer teste">
            <RotateCcw size={16} />
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Modo Carrossel */}
      {viewMode === 'carousel' ? (
        <div className="quiz-carousel-wrapper">
          {/* Stepper de Navegação Rápida entre Questões */}
          <div className="quiz-stepper-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                Questões:
              </span>
              {quiz.questions.map((q, idx) => {
                const isAns = selectedAnswers[q.id] !== undefined;
                const isCur = idx === currentIndex;
                const isCor = isSubmitted && isAns && selectedAnswers[q.id] === q.correctOptionIndex;
                const isWrg = isSubmitted && isAns && selectedAnswers[q.id] !== q.correctOptionIndex;

                let pillColor = 'var(--surface-elevated)';
                let pillBorder = isCur ? 'var(--primary)' : 'var(--border)';
                let textColor = 'var(--text-main)';

                if (isSubmitted) {
                  if (isCor) {
                    pillColor = 'rgba(16, 185, 129, 0.2)';
                    pillBorder = '#10b981';
                    textColor = '#10b981';
                  } else if (isWrg) {
                    pillColor = 'rgba(239, 68, 68, 0.2)';
                    pillBorder = '#ef4444';
                    textColor = '#ef4444';
                  }
                } else if (isAns) {
                  pillColor = 'rgba(14, 165, 233, 0.15)';
                  pillBorder = isCur ? '#0ea5e9' : 'rgba(14, 165, 233, 0.4)';
                  textColor = '#38bdf8';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: `2px solid ${pillBorder}`,
                      background: pillColor,
                      color: textColor,
                      fontWeight: isCur ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                      transform: isCur ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isCur ? '0 0 10px rgba(14, 165, 233, 0.3)' : 'none',
                    }}
                    title={`Ir para questão ${idx + 1}${isAns ? ' (Respondida)' : ''}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Respondidas: <strong style={{ color: 'var(--text-main)' }}>{answeredCount}</strong> de <strong>{totalQuestions}</strong>
            </div>
          </div>

          {/* Questão Ativa do Carrossel */}
          <div className="quiz-carousel-slide">
            {renderQuestionCard(currentQuestion, currentIndex)}
          </div>

          {/* Controles de Próximo e Anterior do Carrossel */}
          <div className="quiz-carousel-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn-secondary"
              style={{ opacity: currentIndex === 0 ? 0.4 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </button>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Questão {currentIndex + 1} de {totalQuestions}
            </span>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="btn-primary"
                >
                  <span>Próxima Questão</span>
                  <ChevronRight size={16} />
                </button>
              ) : !isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary btn-submit-quiz"
                >
                  <Send size={16} />
                  <span>Finalizar Teste e Obter Gabarito</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  <RotateCcw size={16} />
                  <span>Refazer Este Teste</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Modo Lista Tradicional */
        <div className="quiz-questions-list">
          {quiz.questions.map((question, index) => renderQuestionCard(question, index))}

          {/* Footer de ações da lista */}
          <div className="quiz-actions-footer">
            {!isSubmitted ? (
              <button onClick={handleSubmit} className="btn-primary btn-submit-quiz">
                <Send size={18} />
                Finalizar Teste e Obter Gabarito
              </button>
            ) : (
              <div className="quiz-submitted-actions">
                <button onClick={handleReset} className="btn-secondary">
                  <RotateCcw size={16} />
                  Refazer Este Teste
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default QuizBlock;
