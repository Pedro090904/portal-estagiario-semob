import { useState, useCallback, useMemo } from 'react';
import { QuizAttempt, StudentProgress } from '../types';
import { storageService } from '../services/storageService';
import { getModules } from '../services/dataService';
import { calculateOverallProgress } from '../services/progressEngine';

export function useStudentProgress() {
  const [progress, setProgress] = useState<StudentProgress>(() =>
    storageService.getProgress()
  );

  const totalModules = useMemo(() => getModules().length, []);

  const updateName = useCallback((name: string) => {
    setProgress(storageService.updateStudentName(name));
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    setProgress(storageService.toggleModuleCompletion(moduleId));
  }, []);

  const toggleChecklist = useCallback((moduleId: string, itemKey: string) => {
    setProgress(storageService.toggleChecklistItem(moduleId, itemKey));
  }, []);

  const recordQuiz = useCallback((attempt: QuizAttempt) => {
    setProgress(storageService.saveQuizAttempt(attempt));
  }, []);

  const saveNote = useCallback((moduleId: string, note: string) => {
    setProgress(storageService.saveModuleNote(moduleId, note));
  }, []);

  const generateCertificate = useCallback(() => {
    setProgress(storageService.issueCertificate());
  }, []);

  const resetAll = useCallback(() => {
    setProgress(storageService.resetProgress());
  }, []);

  const toggleChallenge = useCallback((challengeId: string) => {
    setProgress(storageService.toggleChallengeCompleted(challengeId));
  }, []);

  const metrics = useMemo(
    () => calculateOverallProgress(progress, totalModules),
    [progress, totalModules]
  );

  const legacyMetrics = useMemo(() => {
    const completedChallengesCount = (progress.completedChallenges || []).length;
    const totalChallenges = 27;
    const attempts = Object.values(progress.quizScores || {});
    const averageQuizScore =
      attempts.length > 0
        ? Math.round(
            attempts.reduce((acc, a) => acc + (a.percentage ?? a.score ?? 0), 0) /
              attempts.length
          )
        : 0;

    return {
      ...metrics,
      totalModules,
      completedModulesCount: metrics.completedCount,
      totalQuizzes: totalModules,
      completedChallengesCount,
      totalChallenges,
      overallPercentage: metrics.completionPercentage,
      averageQuizScore,
    };
  }, [metrics, progress, totalModules]);

  return {
    progress,
    totalModules,
    ...metrics,
    updateName,
    toggleModule,
    toggleChecklist,
    recordQuiz,
    saveNote,
    generateCertificate,
    resetAll,

    // Compatibilidade com telas atuais
    updateStudentName: updateName,
    toggleChallenge,
    recordQuizAttempt: recordQuiz,
    recordNote: saveNote,
    resetProgress: resetAll,
    metrics: legacyMetrics,
  };
}
