import { useState, useCallback } from 'react';
import { StudentProgress, QuizAttempt } from '../types';
import { storageService } from '../services/storageService';
import { MODULES, QUIZZES, SQL_CHALLENGE_QUESTIONS } from '../services/dataService';

export function useStudentProgress() {
  const [progress, setProgress] = useState<StudentProgress>(() => storageService.getProgress());

  const updateStudentName = useCallback((name: string) => {
    const updated = storageService.setStudentName(name);
    setProgress(updated);
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    const updated = storageService.toggleModuleCompleted(moduleId);
    setProgress(updated);
  }, []);

  const toggleChallenge = useCallback((challengeId: string) => {
    const updated = storageService.toggleChallengeCompleted(challengeId);
    setProgress(updated);
  }, []);

  const recordQuizAttempt = useCallback((attempt: QuizAttempt) => {
    const updated = storageService.saveQuizAttempt(attempt);
    setProgress(updated);
  }, []);

  const recordNote = useCallback((key: string, note: string) => {
    const updated = storageService.saveNote(key, note);
    setProgress(updated);
  }, []);

  const resetProgress = useCallback(() => {
    const updated = storageService.resetAllProgress();
    setProgress(updated);
  }, []);

  // Métricas computadas
  const totalModules = MODULES.length;
  const completedModulesCount = progress.completedModules.length;

  const totalQuizzes = QUIZZES.length;
  const passedQuizzesCount = QUIZZES.filter((q) => {
    const attempt = progress.quizAttempts[q.id];
    return attempt && attempt.passed;
  }).length;

  const totalChallenges = SQL_CHALLENGE_QUESTIONS.length + 2; // 25 SQL + Backend + Frontend
  const completedChallengesCount = progress.completedChallenges.length;

  // Média ponderada de conclusão global da formação
  const modulesWeight = 0.35;
  const quizzesWeight = 0.45;
  const challengesWeight = 0.20;

  const modulesRatio = totalModules > 0 ? completedModulesCount / totalModules : 0;
  const quizzesRatio = totalQuizzes > 0 ? passedQuizzesCount / totalQuizzes : 0;
  const challengesRatio = totalChallenges > 0 ? Math.min(completedChallengesCount / totalChallenges, 1) : 0;

  const overallPercentage = Math.round(
    (modulesRatio * modulesWeight + quizzesRatio * quizzesWeight + challengesRatio * challengesWeight) * 100
  );

  const averageQuizScore = (() => {
    const attempts = Object.values(progress.quizAttempts);
    if (attempts.length === 0) return 0;
    const sum = attempts.reduce((acc, a) => acc + a.score, 0);
    return Math.round(sum / attempts.length);
  })();

  const isCertificateUnlocked = passedQuizzesCount >= 4 && completedModulesCount >= 3;

  return {
    progress,
    updateStudentName,
    toggleModule,
    toggleChallenge,
    recordQuizAttempt,
    recordNote,
    resetProgress,
    metrics: {
      totalModules,
      completedModulesCount,
      totalQuizzes,
      passedQuizzesCount,
      totalChallenges,
      completedChallengesCount,
      overallPercentage,
      averageQuizScore,
      isCertificateUnlocked,
    },
  };
}
