import { QuizAttempt, StudentProgress, ChallengeSubmission } from '../types';
import { brandConfig } from '../config/brand';
import {
  CURRENT_SCHEMA_VERSION,
  recordQuizAttemptInProgress,
} from './progressEngine';

const STORAGE_KEY = 'semob_intern_portal_progress_v1';
const LEGACY_STORAGE_KEY = 'semob_portal_student_progress_v1';
const THEME_KEY = 'semob_portal_theme_mode';

const createInitialProgress = (): StudentProgress => ({
  schemaVersion: CURRENT_SCHEMA_VERSION,
  studentName: '',
  completedModules: [],
  completedChecklists: {},
  quizScores: {},
  quizHistory: {},
  challengeSubmissions: {},
  moduleNotes: {},
  startedAt: new Date().toISOString(),
  quizAttempts: {},
  completedChallenges: [],
  notes: {},
});

/**
 * Higieniza e migra dados legados salvos no localStorage sem perder progresso.
 */
export function sanitizeAndMigrateProgress(raw: unknown): StudentProgress {
  const initial = createInitialProgress();
  if (!raw || typeof raw !== 'object') {
    return initial;
  }

  const parsed = raw as Partial<StudentProgress> & {
    quizAttempts?: Record<string, QuizAttempt>;
    notes?: Record<string, string>;
    completedChallenges?: string[];
  };

  const quizScores =
    parsed.quizScores && typeof parsed.quizScores === 'object'
      ? { ...parsed.quizScores }
      : (parsed.quizAttempts && typeof parsed.quizAttempts === 'object'
        ? { ...parsed.quizAttempts }
        : {});

  // Migração automática: se existia quizScores mas não existia quizHistory, popula com a tentativa existente
  const rawHistory =
    parsed.quizHistory && typeof parsed.quizHistory === 'object'
      ? { ...parsed.quizHistory }
      : {};

  Object.entries(quizScores).forEach(([moduleId, attempt]) => {
    if (attempt && (!rawHistory[moduleId] || rawHistory[moduleId].length === 0)) {
      rawHistory[moduleId] = [{ ...attempt, attemptNumber: 1 }];
    }
  });

  const moduleNotes =
    parsed.moduleNotes && typeof parsed.moduleNotes === 'object'
      ? { ...parsed.moduleNotes }
      : (parsed.notes && typeof parsed.notes === 'object' ? { ...parsed.notes } : {});

  const completedChallenges = Array.isArray(parsed.completedChallenges)
    ? parsed.completedChallenges
    : [];

  const result: StudentProgress = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    studentName: typeof parsed.studentName === 'string' ? parsed.studentName : '',
    completedModules: Array.isArray(parsed.completedModules)
      ? parsed.completedModules.filter((id): id is string => typeof id === 'string')
      : [],
    completedChecklists:
      parsed.completedChecklists && typeof parsed.completedChecklists === 'object'
        ? parsed.completedChecklists
        : {},
    quizScores,
    quizHistory: rawHistory,
    challengeSubmissions:
      parsed.challengeSubmissions && typeof parsed.challengeSubmissions === 'object'
        ? parsed.challengeSubmissions
        : {},
    moduleNotes,
    startedAt:
      typeof parsed.startedAt === 'string' ? parsed.startedAt : initial.startedAt,
    completedAt: typeof parsed.completedAt === 'string' ? parsed.completedAt : undefined,
    certificateCode:
      typeof parsed.certificateCode === 'string' ? parsed.certificateCode : undefined,
    quizAttempts: quizScores,
    completedChallenges,
    notes: moduleNotes,
  };

  return result;
}

export const storageService = {
  getProgress(): StudentProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) {
        const initial = createInitialProgress();
        this.saveProgress(initial);
        return initial;
      }
      const parsed = JSON.parse(raw);
      const migrated = sanitizeAndMigrateProgress(parsed);
      this.saveProgress(migrated);
      return migrated;
    } catch (error) {
      console.error('Erro ao ler progresso local, restaurando padrão seguro:', error);
      return createInitialProgress();
    }
  },

  saveProgress(progress: StudentProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Erro ao salvar progresso no localStorage:', error);
    }
  },

  updateStudentName(name: string): StudentProgress {
    const current = this.getProgress();
    const updated: StudentProgress = { ...current, studentName: name.trim() };
    this.saveProgress(updated);
    return updated;
  },

  toggleModuleCompletion(moduleId: string): StudentProgress {
    const current = this.getProgress();
    const exists = current.completedModules.includes(moduleId);
    const completedModules = exists
      ? current.completedModules.filter((id) => id !== moduleId)
      : [...current.completedModules, moduleId];

    const updated: StudentProgress = { ...current, completedModules };
    this.saveProgress(updated);
    return updated;
  },

  toggleChecklistItem(moduleId: string, itemIndex: string): StudentProgress {
    const current = this.getProgress();
    const currentList = current.completedChecklists[moduleId] || [];
    const exists = currentList.includes(itemIndex);

    const updatedList = exists
      ? currentList.filter((item) => item !== itemIndex)
      : [...currentList, itemIndex];

    const updated: StudentProgress = {
      ...current,
      completedChecklists: {
        ...current.completedChecklists,
        [moduleId]: updatedList,
      },
    };
    this.saveProgress(updated);
    return updated;
  },

  saveQuizAttempt(attempt: QuizAttempt): StudentProgress {
    const current = this.getProgress();
    const moduleId = attempt.moduleId || attempt.quizId || 'quiz';
    const normalizedAttempt: QuizAttempt = {
      ...attempt,
      moduleId,
      percentage: attempt.percentage ?? attempt.score ?? 0,
    };
    const updated = recordQuizAttemptInProgress(current, normalizedAttempt);

    if (attempt.quizId && attempt.quizId !== moduleId) {
      updated.quizScores[attempt.quizId] = updated.quizScores[moduleId];
    }
    updated.quizAttempts = updated.quizScores;

    this.saveProgress(updated);
    return updated;
  },

  saveModuleNote(moduleId: string, note: string): StudentProgress {
    const current = this.getProgress();
    const moduleNotes = {
      ...current.moduleNotes,
      [moduleId]: note,
    };
    const updated: StudentProgress = {
      ...current,
      moduleNotes,
      notes: moduleNotes,
    };
    this.saveProgress(updated);
    return updated;
  },

  saveChallengeSubmission(
    challengeId: string,
    data: Partial<ChallengeSubmission>
  ): StudentProgress {
    const current = this.getProgress();
    const existing = current.challengeSubmissions?.[challengeId] || {
      challengeId,
      checkedPrItems: [],
      checklistCompleted: false,
      sqlQueries: {},
    };

    const updatedSubmission: ChallengeSubmission = {
      ...existing,
      ...data,
      sqlQueries: {
        ...(existing.sqlQueries || {}),
        ...(data.sqlQueries || {}),
      },
      completedAt: new Date().toISOString(),
    };

    const isDone = Boolean(updatedSubmission.checklistCompleted);
    const existingChallenges = current.completedChallenges || [];
    const completedChallenges = isDone
      ? Array.from(new Set([...existingChallenges, challengeId]))
      : existingChallenges.filter((id) => id !== challengeId);

    const updated: StudentProgress = {
      ...current,
      completedChallenges,
      challengeSubmissions: {
        ...(current.challengeSubmissions || {}),
        [challengeId]: updatedSubmission,
      },
    };
    this.saveProgress(updated);
    return updated;
  },

  issueCertificate(): StudentProgress {
    const current = this.getProgress();
    if (current.certificateCode) return current;

    const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const year = new Date().getFullYear();
    const updated: StudentProgress = {
      ...current,
      completedAt: new Date().toISOString(),
      certificateCode: `${brandConfig.certificatePrefix}-${year}-${randomHash}`,
    };
    this.saveProgress(updated);
    return updated;
  },

  resetProgress(): StudentProgress {
    const fresh = createInitialProgress();
    this.saveProgress(fresh);
    return fresh;
  },

  // Suporte a tema (usado por useTheme)
  getTheme(): 'dark' | 'light' {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  },

  setTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  },

  // Aliases de compatibilidade legada
  setStudentName(name: string): StudentProgress {
    return this.updateStudentName(name);
  },

  toggleModuleCompleted(moduleId: string): StudentProgress {
    return this.toggleModuleCompletion(moduleId);
  },

  toggleChallengeCompleted(challengeId: string): StudentProgress {
    const current = this.getProgress();
    const currentChallenges = current.completedChallenges || [];
    const exists = currentChallenges.includes(challengeId);
    const updatedChallenges = exists
      ? currentChallenges.filter((id) => id !== challengeId)
      : [...currentChallenges, challengeId];

    const existing = current.challengeSubmissions?.[challengeId];

    const updated: StudentProgress = {
      ...current,
      completedChallenges: updatedChallenges,
      challengeSubmissions: {
        ...(current.challengeSubmissions || {}),
        [challengeId]: {
          ...existing,
          challengeId,
          checkedPrItems: existing?.checkedPrItems || [],
          checklistCompleted: !exists,
          completedAt: new Date().toISOString(),
        },
      },
    };
    this.saveProgress(updated);
    return updated;
  },

  saveNote(key: string, note: string): StudentProgress {
    return this.saveModuleNote(key, note);
  },

  resetAllProgress(): StudentProgress {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return this.resetProgress();
  },
};
