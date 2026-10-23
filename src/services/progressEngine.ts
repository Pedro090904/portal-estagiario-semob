import {
  CanonicalChallengeId,
  CanonicalModuleId,
  QuizAttempt,
  QuizQuestion,
  StudentProgress,
} from '../types';

/** Nota mínima oficial padronizada conforme decisão C2 do documento de visão */
export const PASSING_PERCENTAGE = 70;
export const CURRENT_SCHEMA_VERSION = 3;
export const CURRENT_TRACK_VERSION = '1.0.0';

export const CANONICAL_MODULE_IDS: CanonicalModuleId[] = [
  'mod-1-ambiente',
  'mod-2-git',
  'mod-3-banco-dados',
  'mod-4-backend',
  'mod-5-frontend',
];

export const CANONICAL_CHALLENGE_IDS: CanonicalChallengeId[] = [
  'challenge-sql-relatorios',
  'challenge-backend-api',
  'challenge-frontend-ui',
  'challenge-fullstack-infoonibus',
];

const LEGACY_MODULE_ID_MAP: Record<string, CanonicalModuleId> = {
  ambiente: 'mod-1-ambiente',
  fundamentos: 'mod-1-ambiente',
  'mod-1': 'mod-1-ambiente',
  'mod-1-ambiente': 'mod-1-ambiente',
  git: 'mod-2-git',
  'mod-2': 'mod-2-git',
  'mod-2-git': 'mod-2-git',
  'mod-git': 'mod-2-git',
  sql: 'mod-3-banco-dados',
  'banco-dados': 'mod-3-banco-dados',
  'mod-3': 'mod-3-banco-dados',
  'mod-3-banco-dados': 'mod-3-banco-dados',
  backend: 'mod-4-backend',
  'mod-4': 'mod-4-backend',
  'mod-4-backend': 'mod-4-backend',
  frontend: 'mod-5-frontend',
  'mod-5': 'mod-5-frontend',
  'mod-5-frontend': 'mod-5-frontend',
};

/**
 * Converte qualquer ID legado de quiz ou módulo para o ID canónico oficial.
 */
export function normalizeModuleId(rawId: string): string {
  const trimmed = rawId.trim();
  return LEGACY_MODULE_ID_MAP[trimmed] || trimmed;
}

export interface OverallProgressMetrics {
  completedCount: number;
  passedQuizzesCount: number;
  completedChallengesCount: number;
  totalRequiredChallenges: number;
  completionPercentage: number;
  allModulesCompleted: boolean;
  allQuizzesPassed: boolean;
  allChallengesSubmitted: boolean;
  /** Elegível para solicitar homologação ao supervisor (C1 + C4) */
  isCertificateEligible: boolean;
  /** Mantido para compatibilidade com a UI existente */
  isCertificateUnlocked: boolean;
}

/**
 * Avalia uma tentativa de quiz aplicando a nota de corte oficial (70%).
 */
export function evaluateQuizAttempt(
  moduleId: string,
  questions: QuizQuestion[],
  selectedAnswers: Record<string, number>,
  previousAttemptsCount = 0,
  nowIso = new Date().toISOString()
): QuizAttempt {
  const canonicalId = normalizeModuleId(moduleId);

  if (questions.length === 0) {
    return {
      moduleId: canonicalId,
      score: 0,
      totalQuestions: 0,
      percentage: 0,
      passed: false,
      completedAt: nowIso,
      attemptNumber: previousAttemptsCount + 1,
      contentVersion: CURRENT_TRACK_VERSION,
    };
  }

  const correctCount = questions.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctOptionIndex ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctCount / questions.length) * 100);

  return {
    moduleId: canonicalId,
    score: correctCount,
    totalQuestions: questions.length,
    percentage,
    passed: percentage >= PASSING_PERCENTAGE,
    completedAt: nowIso,
    attemptNumber: previousAttemptsCount + 1,
    contentVersion: CURRENT_TRACK_VERSION,
  };
}

/**
 * Registra uma tentativa de quiz preservando o histórico e mantendo a melhor nota,
 * SEM marcar automaticamente o módulo teórico como lido (resolve o bug de Certificado sem Estudo).
 */
export function recordQuizAttemptInProgress(
  current: StudentProgress,
  attempt: QuizAttempt
): StudentProgress {
  const canonicalId = normalizeModuleId(attempt.moduleId);
  const previousHistory = current.quizHistory?.[canonicalId] ?? [];

  const nextAttempt: QuizAttempt = {
    ...attempt,
    moduleId: canonicalId,
    attemptNumber: previousHistory.length + 1,
    contentVersion: attempt.contentVersion || CURRENT_TRACK_VERSION,
  };

  const updatedModuleHistory = [...previousHistory, nextAttempt];
  const existingBest = current.quizScores[canonicalId];

  const bestAttempt =
    !existingBest || nextAttempt.percentage >= existingBest.percentage
      ? nextAttempt
      : existingBest;

  return {
    ...current,
    quizScores: {
      ...current.quizScores,
      [canonicalId]: bestAttempt,
    },
    quizHistory: {
      ...(current.quizHistory ?? {}),
      [canonicalId]: updatedModuleHistory,
    },
  };
}

/**
 * Calcula o progresso global da trilha sem duplicações, validando apenas IDs oficiais
 * e exigindo: Módulos Lidos + Quizzes Aprovados (>=70%) + Desafios Práticos Concluídos (Decisão C1).
 */
export function calculateOverallProgress(
  progress: StudentProgress,
  validModuleIds: string[] = CANONICAL_MODULE_IDS,
  requiredChallengeIds: string[] = CANONICAL_CHALLENGE_IDS
): OverallProgressMetrics {
  const totalModules = validModuleIds.length;
  const totalRequiredChallenges = requiredChallengeIds.length;

  if (totalModules <= 0) {
    return {
      completedCount: 0,
      passedQuizzesCount: 0,
      completedChallengesCount: 0,
      totalRequiredChallenges: 0,
      completionPercentage: 0,
      allModulesCompleted: false,
      allQuizzesPassed: false,
      allChallengesSubmitted: false,
      isCertificateEligible: false,
      isCertificateUnlocked: false,
    };
  }

  const normalizedCompletedSet = new Set(
    progress.completedModules.map((id) => normalizeModuleId(id))
  );

  // Conta estritamente os módulos válidos que foram marcados como lidos
  const completedCount = validModuleIds.filter((id) =>
    normalizedCompletedSet.has(id)
  ).length;

  // Conta estritamente os quizzes válidos aprovados (1 por módulo, sem duplicar chaves legadas)
  const passedQuizzesCount = validModuleIds.filter((id) => {
    const attempt = progress.quizScores[id];
    return Boolean(attempt && attempt.passed && attempt.percentage >= PASSING_PERCENTAGE);
  }).length;

  // Conta os desafios obrigatórios cujo checklist/submissão foi concluído
  const completedChallengesCount = requiredChallengeIds.filter((chId) => {
    const sub = progress.challengeSubmissions?.[chId];
    return Boolean(sub && sub.checklistCompleted);
  }).length;

  const totalSteps = totalModules * 2 + totalRequiredChallenges;
  const doneSteps = completedCount + passedQuizzesCount + completedChallengesCount;

  const rawPercentage = Math.round((doneSteps / totalSteps) * 100);
  const completionPercentage = Math.min(100, Math.max(0, rawPercentage));

  const allModulesCompleted = completedCount >= totalModules;
  const allQuizzesPassed = passedQuizzesCount >= totalModules;
  const allChallengesSubmitted = completedChallengesCount >= totalRequiredChallenges;

  const isCertificateEligible =
    allModulesCompleted && allQuizzesPassed && allChallengesSubmitted;

  return {
    completedCount,
    passedQuizzesCount,
    completedChallengesCount,
    totalRequiredChallenges,
    completionPercentage,
    allModulesCompleted,
    allQuizzesPassed,
    allChallengesSubmitted,
    isCertificateEligible,
    isCertificateUnlocked: isCertificateEligible,
  };
}
