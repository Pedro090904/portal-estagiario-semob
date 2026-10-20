import { useState, useCallback, useMemo } from 'react';
import { ChallengeSubmission, QuizAttempt, StudentProgress } from '../types';
import { storageService } from '../services/storageService';
import { getModules } from '../services/dataService';
import {
  CANONICAL_CHALLENGE_IDS,
  calculateOverallProgress,
} from '../services/progressEngine';

export function useStudentProgress() {
  const [progress, setProgress] = useState<StudentProgress>(() =>
    storageService.getProgress()
  );

  const validModuleIds = useMemo(
    () => getModules().map((m) => m.id),
    []
  );

  const updateName = useCallback((name: string, seiProcessNumber?: string) => {
    setProgress(storageService.updateStudentName(name, seiProcessNumber));
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    setProgress(storageService.toggleModuleCompletion(moduleId));
  }, []);

  const toggleChecklist = useCallback((scopeId: string, itemKey: string) => {
    setProgress(storageService.toggleChecklistItem(scopeId, itemKey));
  }, []);

  const recordQuiz = useCallback((attempt: QuizAttempt) => {
    setProgress(storageService.saveQuizAttempt(attempt));
  }, []);

  const saveNote = useCallback((moduleId: string, note: string) => {
    setProgress(storageService.saveModuleNote(moduleId, note));
  }, []);

  const saveChallenge = useCallback(
    (challengeId: string, data: Partial<ChallengeSubmission>) => {
      setProgress(storageService.saveChallengeSubmission(challengeId, data));
    },
    []
  );

  const generateCertificate = useCallback(
    (seiProcessNumber?: string, supervisorName?: string) => {
      setProgress(storageService.issueCertificate(seiProcessNumber, supervisorName));
    },
    []
  );

  const resetAll = useCallback(() => {
    setProgress(storageService.resetProgress());
  }, []);

  const metrics = useMemo(
    () =>
      calculateOverallProgress(
        progress,
        validModuleIds,
        CANONICAL_CHALLENGE_IDS
      ),
    [progress, validModuleIds]
  );

  return {
    progress,
    totalModules: validModuleIds.length,
    ...metrics,
    updateName,
    toggleModule,
    toggleChecklist,
    recordQuiz,
    saveNote,
    saveChallenge,
    generateCertificate,
    resetAll,

    // Aliases para compatibilidade imediata com App.tsx e telas legadas durante transição
    updateStudentName: updateName,
    toggleChallenge: (challengeId: string) =>
      saveChallenge(challengeId, { checklistCompleted: true }),
    recordQuizAttempt: recordQuiz,
    recordNote: saveNote,
    resetProgress: resetAll,
    metrics: {
      ...metrics,
      totalModules: validModuleIds.length,
      completedModulesCount: metrics.completedCount,
      totalQuizzes: validModuleIds.length,
      completedChallengesCount: metrics.completedChallengesCount,
      totalChallenges: metrics.totalRequiredChallenges,
      overallPercentage: metrics.completionPercentage,
      averageQuizScore: 0,
    },
  };
}
