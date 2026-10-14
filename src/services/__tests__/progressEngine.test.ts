import { describe, it, expect } from 'vitest';
import {
  evaluateQuizAttempt,
  recordQuizAttemptInProgress,
  calculateOverallProgress,
} from '../progressEngine';
import { sanitizeAndMigrateProgress } from '../storageService';
import { QuizQuestion, StudentProgress } from '../../types';

const mockQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    moduleId: 'mod-git',
    question: 'Qual comando cria uma branch?',
    options: ['git checkout -b', 'git init', 'git status', 'git log'],
    correctOptionIndex: 0,
    explanation: 'git checkout -b cria e alterna para a nova branch.',
  },
  {
    id: 'q2',
    moduleId: 'mod-git',
    question: 'Qual cláusula filtra registros em SQL?',
    options: ['SELECT', 'WHERE', 'GROUP BY', 'ORDER BY'],
    correctOptionIndex: 1,
    explanation: 'WHERE filtra linhas antes do agrupamento.',
  },
];

const createEmptyProgress = (): StudentProgress =>
  sanitizeAndMigrateProgress({});

describe('Motor de Progresso e Avaliação (progressEngine)', () => {
  it('deve aprovar o estudante quando atingir >= 70% de acerto no quiz', () => {
    const attempt = evaluateQuizAttempt('mod-git', mockQuestions, {
      q1: 0,
      q2: 1,
    });

    expect(attempt.score).toBe(2);
    expect(attempt.percentage).toBe(100);
    expect(attempt.passed).toBe(true);
    expect(attempt.attemptNumber).toBe(1);
  });

  it('deve reprovar o estudante quando atingir menos de 70% no quiz', () => {
    const attempt = evaluateQuizAttempt('mod-git', mockQuestions, {
      q1: 0,
      q2: 3, // errada
    });

    expect(attempt.score).toBe(1);
    expect(attempt.percentage).toBe(50);
    expect(attempt.passed).toBe(false);
  });

  it('deve preservar o histórico de tentativas sem sobrescrever tentativas anteriores e manter a melhor nota', () => {
    let state = createEmptyProgress();

    // 1ª tentativa: reprovado (50%)
    const attempt1 = evaluateQuizAttempt('mod-git', mockQuestions, { q1: 0, q2: 3 });
    state = recordQuizAttemptInProgress(state, attempt1);

    expect(state.quizHistory['mod-git']).toHaveLength(1);
    expect(state.quizScores['mod-git'].percentage).toBe(50);
    expect(state.completedModules).not.toContain('mod-git');

    // 2ª tentativa: aprovado (100%)
    const attempt2 = evaluateQuizAttempt('mod-git', mockQuestions, { q1: 0, q2: 1 });
    state = recordQuizAttemptInProgress(state, attempt2);

    expect(state.quizHistory['mod-git']).toHaveLength(2);
    expect(state.quizHistory['mod-git'][0].percentage).toBe(50);
    expect(state.quizHistory['mod-git'][1].percentage).toBe(100);
    expect(state.quizHistory['mod-git'][1].attemptNumber).toBe(2);
    expect(state.quizScores['mod-git'].percentage).toBe(100);
    expect(state.completedModules).toContain('mod-git');

    // 3ª tentativa: refez e tirou nota menor (50%) -> histórico registra a 3ª, mas mantém os 100% conquistados no resumo!
    const attempt3 = evaluateQuizAttempt('mod-git', mockQuestions, { q1: 0, q2: 2 });
    state = recordQuizAttemptInProgress(state, attempt3);

    expect(state.quizHistory['mod-git']).toHaveLength(3);
    expect(state.quizScores['mod-git'].percentage).toBe(100);
  });

  it('só deve liberar o certificado quando todos os módulos e todos os quizzes estiverem aprovados', () => {
    let state = createEmptyProgress();
    const totalModules = 2;

    // Concluiu apenas 1 módulo e 1 quiz
    const attemptMod1 = evaluateQuizAttempt('mod-1', mockQuestions, { q1: 0, q2: 1 });
    state = recordQuizAttemptInProgress(state, attemptMod1);

    let metrics = calculateOverallProgress(state, totalModules);
    expect(metrics.completionPercentage).toBe(50);
    expect(metrics.isCertificateUnlocked).toBe(false);

    // Concluiu o 2º módulo e passou no 2º quiz
    const attemptMod2 = evaluateQuizAttempt('mod-2', mockQuestions, { q1: 0, q2: 1 });
    state = recordQuizAttemptInProgress(state, attemptMod2);

    metrics = calculateOverallProgress(state, totalModules);
    expect(metrics.completionPercentage).toBe(100);
    expect(metrics.isCertificateUnlocked).toBe(true);
  });

  it('deve migrar dados antigos do localStorage sem quizHistory automaticamente', () => {
    const legacyData = {
      studentName: 'Pedro',
      completedModules: ['mod-git'],
      quizScores: {
        'mod-git': {
          moduleId: 'mod-git',
          score: 5,
          totalQuestions: 5,
          percentage: 100,
          passed: true,
          completedAt: '2026-01-01T00:00:00.000Z',
        },
      },
    };

    const migrated = sanitizeAndMigrateProgress(legacyData);
    expect(migrated.studentName).toBe('Pedro');
    expect(migrated.quizHistory['mod-git']).toHaveLength(1);
    expect(migrated.quizHistory['mod-git'][0].attemptNumber).toBe(1);
  });
});
