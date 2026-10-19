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
  Code
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
    const unansweredCount = quiz.questions.filter((q) => selectedAnswers[q.id] === undefined).length;
    if (unansweredCount > 0) {
      setValidationError(
        `Você ainda tem ${unansweredCount} questão(ões) sem resposta. Por favor, selecione uma alternativa para cada pergunta antes de submeter.`
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

  return (
    <div className="quiz-block-card">
      <div className="quiz-header">
        <div className="quiz-badge-wrap">
          <span className="quiz-badge">{quiz.badge}</span>
          <span className="quiz-pass-score">Mínimo para aprovação: {PASSING_PERCENTAGE}%</span>
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
              {quiz.questions.filter((q) => selectedAnswers[q.id] === q.correctOptionIndex).length} de {quiz.questions.length} questões corretas).
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

      {/* Questões */}
      <div className="quiz-questions-list">
        {quiz.questions.map((question, index) => {
          const userAnswer = selectedAnswers[question.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === question.correctOptionIndex;

          return (
            <div 
              key={question.id} 
              className={`quiz-question-item ${isSubmitted ? (isCorrect ? 'item-correct' : 'item-wrong') : ''}`}
            >
              <div className="question-top">
                <span className="question-number">Questão {index + 1} de {quiz.questions.length}</span>
                <span className="question-cat">{question.competencyTag || question.category}</span>
                {isSubmitted && (
                  <span className={`status-pill ${isCorrect ? 'pill-green' : 'pill-red'}`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle size={14} /> Correto (+{Math.round(100 / quiz.questions.length)}%)
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
        })}
      </div>

      {/* Footer de ações */}
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
  );
};
export default QuizBlock;
