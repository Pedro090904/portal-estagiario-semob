import { describe, it, expect } from 'vitest';
import {
  evaluateQuizAttempt,
  recordQuizAttemptInProgress,
  calculateOverallProgress,
  CANONICAL_MODULE_IDS,
  CANONICAL_CHALLENGE_IDS,
} from '../progressEngine';
import { sanitizeAndMigrateProgress } from '../storageService';
import { QuizQuestion, StudentProgress } from '../../types';

const mockQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    moduleId: 'mod-2-git',
    question: 'Qual comando cria uma branch?',
    options: ['git switch -c', 'git init', 'git status', 'git log'],
    correctOptionIndex: 0,
    explanation: 'git switch -c cria e alterna para a nova branch.',
  },
  {
    id: 'q2',
    moduleId: 'mod-2-git',
    question: 'Qual cláusula filtra registos em SQL?',
    options: ['SELECT', 'WHERE', 'GROUP BY', 'ORDER BY'],
    correctOptionIndex: 1,
    explanation: 'WHERE filtra linhas e realiza junções.',
  },
];

const createEmptyProgress = (): StudentProgress =>
  sanitizeAndMigrateProgress({});

describe('Motor de Progresso e Integridade de Regras (Sprint 1)', () => {
  it('deve aprovar o estudante quando atingir >= 70% (Decisão C2) e normalizar IDs legados', () => {
    const attempt = evaluateQuizAttempt('git', mockQuestions, {
      q1: 0,
      q2: 1,
    });

    expect(attempt.moduleId).toBe('mod-2-git');
    expect(attempt.percentage).toBe(100);
    expect(attempt.passed).toBe(true);
  });

  it('NÃO deve marcar o módulo teórico como lido apenas por passar no quiz (Fim do Certificado sem Estudo)', () => {
    let state = createEmptyProgress();
    const attempt = evaluateQuizAttempt('mod-2-git', mockQuestions, { q1: 0, q2: 1 });
    state = recordQuizAttemptInProgress(state, attempt);

    expect(state.quizScores['mod-2-git'].passed).toBe(true);
    // O módulo NÃO pode entrar em completedModules sem leitura explícita
    expect(state.completedModules).not.toContain('mod-2-git');
  });

  it('deve deduplicar chaves legadas (ex: "git" e "mod-2-git") sem contar o mesmo quiz duas vezes', () => {
    const legacyCorruptedData = {
      studentName: 'Pedro',
      completedModules: ['git', 'mod-2-git'],
      quizScores: {
        git: {
          moduleId: 'git',
          score: 3,
          totalQuestions: 4,
          percentage: 75,
          passed: true,
          completedAt: '2026-10-18T00:00:00.000Z',
        },
        'mod-2-git': {
          moduleId: 'mod-2-git',
          score: 4,
          totalQuestions: 4,
          percentage: 100,
          passed: true,
          completedAt: '2026-10-18T01:00:00.000Z',
        },
      },
    };

    const migrated = sanitizeAndMigrateProgress(legacyCorruptedData);
    expect(migrated.completedModules).toEqual(['mod-2-git']);
    expect(Object.keys(migrated.quizScores)).toEqual(['mod-2-git']);
    expect(migrated.quizScores['mod-2-git'].percentage).toBe(100);

    const metrics = calculateOverallProgress(migrated, CANONICAL_MODULE_IDS, CANONICAL_CHALLENGE_IDS);
    expect(metrics.completedCount).toBe(1);
    expect(metrics.passedQuizzesCount).toBe(1);
    expect(metrics.isCertificateUnlocked).toBe(false);
  });

  it('só deve liberar a elegibilidade do certificado quando 100% dos módulos, quizzes E desafios forem concluídos (Decisão C1)', () => {
    let state = createEmptyProgress();
    const testModules = ['mod-1-ambiente', 'mod-2-git'];
    const testChallenges = ['challenge-sql-relatorios'];

    // 1. Passou nos 2 quizzes, mas não leu os módulos nem fez o desafio
    state = recordQuizAttemptInProgress(
      state,
      evaluateQuizAttempt('mod-1-ambiente', mockQuestions, { q1: 0, q2: 1 })
    );
    state = recordQuizAttemptInProgress(
      state,
      evaluateQuizAttempt('mod-2-git', mockQuestions, { q1: 0, q2: 1 })
    );

    let metrics = calculateOverallProgress(state, testModules, testChallenges);
    expect(metrics.allQuizzesPassed).toBe(true);
    expect(metrics.allModulesCompleted).toBe(false);
    expect(metrics.isCertificateEligible).toBe(false);

    // 2. Leu os 2 módulos, mas ainda falta o desafio prático
    state.completedModules = ['mod-1-ambiente', 'mod-2-git'];
    metrics = calculateOverallProgress(state, testModules, testChallenges);
    expect(metrics.allModulesCompleted).toBe(true);
    expect(metrics.allChallengesSubmitted).toBe(false);
    expect(metrics.isCertificateEligible).toBe(false);

    // 3. Concluiu e submeteu o desafio prático -> 100% elegível!
    state.challengeSubmissions['challenge-sql-relatorios'] = {
      challengeId: 'challenge-sql-relatorios',
      checkedPrItems: [0, 1, 2, 3],
      checklistCompleted: true,
    };

    metrics = calculateOverallProgress(state, testModules, testChallenges);
    expect(metrics.completionPercentage).toBe(100);
    expect(metrics.isCertificateEligible).toBe(true);
  });
});
