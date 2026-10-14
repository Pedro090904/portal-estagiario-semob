import { QuizAttempt, QuizQuestion, StudentProgress } from '../types';

export const PASSING_PERCENTAGE = 70;
export const CURRENT_SCHEMA_VERSION = 2;

export interface OverallProgressMetrics {
  completedCount: number;
  passedQuizzesCount: number;
  completionPercentage: number;
  allModulesCompleted: boolean;
  allQuizzesPassed: boolean;
  isCertificateUnlocked: boolean;
}

/**
 * Calcula a nota de uma tentativa de quiz comparando as respostas enviadas com o gabarito.
 */
export function evaluateQuizAttempt(
  moduleId: string,
  questions: QuizQuestion[],
  selectedAnswers: Record<string, number | string>,
  previousAttemptsCount = 0,
  nowIso = new Date().toISOString()
): QuizAttempt {
  if (questions.length === 0) {
    return {
      moduleId,
      score: 0,
      totalQuestions: 0,
      percentage: 0,
      passed: false,
      completedAt: nowIso,
      attemptNumber: previousAttemptsCount + 1,
    };
  }

  const correctCount = questions.reduce((acc, q) => {
    const selected = selectedAnswers[q.id];
    let isCorrect = false;
    if (q.correctOptionIndex !== undefined) {
      isCorrect = selected === q.correctOptionIndex;
    } else if (q.correctOptionId !== undefined) {
      isCorrect = selected === q.correctOptionId;
    }
    return isCorrect ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctCount / questions.length) * 100);

  return {
    moduleId,
    score: correctCount,
    totalQuestions: questions.length,
    percentage,
    passed: percentage >= PASSING_PERCENTAGE,
    completedAt: nowIso,
    attemptNumber: previousAttemptsCount + 1,
  };
}

/**
 * Registra uma nova tentativa preservando todo o histórico anterior e mantendo
 * a melhor pontuação no resumo principal (quizScores).
 */
export function recordQuizAttemptInProgress(
  current: StudentProgress,
  attempt: QuizAttempt
): StudentProgress {
  const previousHistory = current.quizHistory?.[attempt.moduleId] ?? [];
  const nextAttempt: QuizAttempt = {
    ...attempt,
    attemptNumber: previousHistory.length + 1,
  };

  const updatedModuleHistory = [...previousHistory, nextAttempt];
  const existingBest = current.quizScores[attempt.moduleId];

  // Mantém a tentativa com maior percentual como referência principal (ou a mais recente em caso de empate)
  const bestAttempt =
    !existingBest || nextAttempt.percentage >= existingBest.percentage
      ? nextAttempt
      : existingBest;

  // Se passou no quiz, garante que o módulo também conste como concluído
  const completedModules =
    nextAttempt.passed && !current.completedModules.includes(attempt.moduleId)
      ? [...current.completedModules, attempt.moduleId]
      : current.completedModules;

  return {
    ...current,
    completedModules,
    quizScores: {
      ...current.quizScores,
      [attempt.moduleId]: bestAttempt,
    },
    quizHistory: {
      ...(current.quizHistory ?? {}),
      [attempt.moduleId]: updatedModuleHistory,
    },
  };
}

/**
 * Calcula todas as métricas de progresso e elegibilidade de certificado de forma pura.
 */
export function calculateOverallProgress(
  progress: StudentProgress,
  totalModules: number
): OverallProgressMetrics {
  if (totalModules <= 0) {
    return {
      completedCount: 0,
      passedQuizzesCount: 0,
      completionPercentage: 0,
      allModulesCompleted: false,
      allQuizzesPassed: false,
      isCertificateUnlocked: false,
    };
  }

  const completedCount = progress.completedModules.length;
  const passedQuizzesCount = (Object.values(progress.quizScores) as QuizAttempt[]).filter(
    (attempt) => attempt.passed
  ).length;

  const rawPercentage = Math.round(
    ((completedCount + passedQuizzesCount) / (totalModules * 2)) * 100
  );
  const completionPercentage = Math.min(100, Math.max(0, rawPercentage));

  const allModulesCompleted = completedCount >= totalModules;
  const allQuizzesPassed = passedQuizzesCount >= totalModules;
  const isCertificateUnlocked = allModulesCompleted && allQuizzesPassed;

  return {
    completedCount,
    passedQuizzesCount,
    completionPercentage,
    allModulesCompleted,
    allQuizzesPassed,
    isCertificateUnlocked,
  };
}
