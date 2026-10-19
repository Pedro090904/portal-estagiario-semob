import {
  ChallengeSubmission,
  QuizAttempt,
  StudentProgress,
} from '../types';
import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TRACK_VERSION,
  PASSING_PERCENTAGE,
  normalizeModuleId,
  recordQuizAttemptInProgress,
} from './progressEngine';
import { brandConfig } from '../config/brand';

const ACTIVE_STORAGE_KEY = `${brandConfig.storageKeyPrefix}_progress_v1`;
const LEGACY_STORAGE_KEY = 'semob_intern_portal_progress_v1';
const THEME_KEY = `${brandConfig.storageKeyPrefix}_theme_mode`;

const createInitialProgress = (): StudentProgress => ({
  schemaVersion: CURRENT_SCHEMA_VERSION,
  studentName: '',
  studentRole: 'ALUNO',
  completedModules: [],
  completedChecklists: {},
  quizScores: {},
  quizHistory: {},
  challengeSubmissions: {},
  moduleNotes: {},
  startedAt: new Date().toISOString(),
});

/**
 * Higieniza e migra dados legados deduplicando IDs antigos ('git' -> 'mod-2-git')
 * e aplicando a nota de corte oficial de 70% (C2).
 */
export function sanitizeAndMigrateProgress(raw: unknown): StudentProgress {
  const initial = createInitialProgress();
  if (!raw || typeof raw !== 'object') {
    return initial;
  }

  const parsed = raw as Partial<StudentProgress>;

  // 1. Deduplica e normaliza completedModules
  const rawCompleted = Array.isArray(parsed.completedModules)
    ? parsed.completedModules.filter((id): id is string => typeof id === 'string')
    : [];
  const completedModules = Array.from(
    new Set(rawCompleted.map((id) => normalizeModuleId(id)))
  );

  // 2. Migra e deduplica quizScores e quizHistory para IDs canónicos
  const migratedScores: Record<string, QuizAttempt> = {};
  const migratedHistory: Record<string, QuizAttempt[]> = {};

  if (parsed.quizHistory && typeof parsed.quizHistory === 'object') {
    Object.entries(parsed.quizHistory).forEach(([rawKey, list]) => {
      if (!Array.isArray(list)) return;
      const canonicalKey = normalizeModuleId(rawKey);
      const existingList = migratedHistory[canonicalKey] || [];
      const normalizedAttempts = list.map((att, idx) => ({
        ...att,
        moduleId: canonicalKey,
        passed: att.percentage >= PASSING_PERCENTAGE,
        attemptNumber: idx + 1,
        contentVersion: att.contentVersion || CURRENT_TRACK_VERSION,
      }));
      migratedHistory[canonicalKey] = [...existingList, ...normalizedAttempts];
    });
  }

  if (parsed.quizScores && typeof parsed.quizScores === 'object') {
    Object.entries(parsed.quizScores).forEach(([rawKey, attempt]) => {
      if (!attempt || typeof attempt !== 'object') return;
      const canonicalKey = normalizeModuleId(rawKey);
      const normalizedAttempt: QuizAttempt = {
        ...attempt,
        moduleId: canonicalKey,
        passed: attempt.percentage >= PASSING_PERCENTAGE,
        contentVersion: attempt.contentVersion || CURRENT_TRACK_VERSION,
      };

      const currentBest = migratedScores[canonicalKey];
      if (!currentBest || normalizedAttempt.percentage >= currentBest.percentage) {
        migratedScores[canonicalKey] = normalizedAttempt;
      }

      if (!migratedHistory[canonicalKey] || migratedHistory[canonicalKey].length === 0) {
        migratedHistory[canonicalKey] = [{ ...normalizedAttempt, attemptNumber: 1 }];
      }
    });
  }

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    studentName: typeof parsed.studentName === 'string' ? parsed.studentName : '',
    studentEmail: typeof parsed.studentEmail === 'string' ? parsed.studentEmail : undefined,
    studentRole: parsed.studentRole || 'ALUNO',
    seiProcessNumber:
      typeof parsed.seiProcessNumber === 'string' ? parsed.seiProcessNumber : undefined,
    completedModules,
    completedChecklists:
      parsed.completedChecklists && typeof parsed.completedChecklists === 'object'
        ? parsed.completedChecklists
        : {},
    quizScores: migratedScores,
    quizHistory: migratedHistory,
    challengeSubmissions:
      parsed.challengeSubmissions && typeof parsed.challengeSubmissions === 'object'
        ? parsed.challengeSubmissions
        : {},
    moduleNotes:
      parsed.moduleNotes && typeof parsed.moduleNotes === 'object'
        ? parsed.moduleNotes
        : {},
    startedAt:
      typeof parsed.startedAt === 'string' ? parsed.startedAt : initial.startedAt,
    completedAt: typeof parsed.completedAt === 'string' ? parsed.completedAt : undefined,
    certificateCode:
      typeof parsed.certificateCode === 'string' ? parsed.certificateCode : undefined,
    certificateApproval: parsed.certificateApproval,
  };
}

export const storageService = {
  getProgress(): StudentProgress {
    try {
      const raw =
        localStorage.getItem(ACTIVE_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY);

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
      const serialized = JSON.stringify(progress);
      localStorage.setItem(ACTIVE_STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Erro ao salvar progresso no localStorage:', error);
    }
  },

  updateStudentName(name: string, seiProcessNumber?: string): StudentProgress {
    const current = this.getProgress();
    const updated: StudentProgress = {
      ...current,
      studentName: name.trim(),
      seiProcessNumber:
        seiProcessNumber !== undefined ? seiProcessNumber.trim() : current.seiProcessNumber,
    };
    this.saveProgress(updated);
    return updated;
  },

  toggleModuleCompletion(moduleId: string): StudentProgress {
    const current = this.getProgress();
    const canonicalId = normalizeModuleId(moduleId);
    const exists = current.completedModules.includes(canonicalId);
    const completedModules = exists
      ? current.completedModules.filter((id) => id !== canonicalId)
      : [...current.completedModules, canonicalId];

    const updated: StudentProgress = { ...current, completedModules };
    this.saveProgress(updated);
    return updated;
  },

  toggleChecklistItem(scopeId: string, itemKey: string): StudentProgress {
    const current = this.getProgress();
    const currentList = current.completedChecklists[scopeId] || [];
    const exists = currentList.includes(itemKey);

    const updatedList = exists
      ? currentList.filter((item) => item !== itemKey)
      : [...currentList, itemKey];

    const updated: StudentProgress = {
      ...current,
      completedChecklists: {
        ...current.completedChecklists,
        [scopeId]: updatedList,
      },
    };
    this.saveProgress(updated);
    return updated;
  },

  saveQuizAttempt(attempt: QuizAttempt): StudentProgress {
    const current = this.getProgress();
    const updated = recordQuizAttemptInProgress(current, attempt);
    this.saveProgress(updated);
    return updated;
  },

  saveModuleNote(moduleId: string, note: string): StudentProgress {
    const current = this.getProgress();
    const canonicalId = normalizeModuleId(moduleId);
    const updated: StudentProgress = {
      ...current,
      moduleNotes: {
        ...current.moduleNotes,
        [canonicalId]: note,
      },
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
      reviewStatus: 'PENDENTE',
    };

    const nextCompleted =
      data.checklistCompleted !== undefined
        ? data.checklistCompleted
        : existing.checklistCompleted;

    const updatedSubmission: ChallengeSubmission = {
      ...existing,
      ...data,
      checklistCompleted: nextCompleted,
      reviewStatus: nextCompleted ? 'EM_REVISAO' : existing.reviewStatus,
      sqlQueries: {
        ...(existing.sqlQueries || {}),
        ...(data.sqlQueries || {}),
      },
      completedAt: new Date().toISOString(),
    };

    const updated: StudentProgress = {
      ...current,
      challengeSubmissions: {
        ...(current.challengeSubmissions || {}),
        [challengeId]: updatedSubmission,
      },
    };
    this.saveProgress(updated);
    return updated;
  },

  /**
   * Emite e persiste de forma imutável o código de verificação do certificado
   * registrando processo SEI e aprovação do supervisor (Decisões C4, Q30, Q31 e Q66).
   */
  issueCertificate(
    seiProcessNumber?: string,
    supervisorName = 'Supervisor Técnico SUTINF'
  ): StudentProgress {
    const current = this.getProgress();
    const finalSei = seiProcessNumber?.trim() || current.seiProcessNumber || '00090-00000000/2026-00';

    if (current.certificateCode) {
      const updatedExisting: StudentProgress = {
        ...current,
        seiProcessNumber: finalSei,
        certificateApproval: {
          status: 'EMITIDO',
          seiProcessNumber: finalSei,
          approvedBySupervisor: supervisorName,
          approvedAt: current.completedAt || new Date().toISOString(),
          trackVersion: CURRENT_TRACK_VERSION,
          totalWorkloadHours: 40,
        },
      };
      this.saveProgress(updatedExisting);
      return updatedExisting;
    }

    const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const year = new Date().getFullYear();
    const nowIso = new Date().toISOString();

    const updated: StudentProgress = {
      ...current,
      seiProcessNumber: finalSei,
      completedAt: nowIso,
      certificateCode: `${brandConfig.certificatePrefix}-${year}-${randomHash}`,
      certificateApproval: {
        status: 'EMITIDO',
        seiProcessNumber: finalSei,
        approvedBySupervisor: supervisorName,
        approvedAt: nowIso,
        trackVersion: CURRENT_TRACK_VERSION,
        totalWorkloadHours: 40,
      },
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

  // Helper de compatibilidade durante a migração
  toggleChallengeCompleted(challengeId: string): StudentProgress {
    const current = this.getProgress();
    const existing = current.challengeSubmissions?.[challengeId];
    const isDone = !(existing && existing.checklistCompleted);
    return this.saveChallengeSubmission(challengeId, { checklistCompleted: isDone });
  },
};
