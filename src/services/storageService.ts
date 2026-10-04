import { StudentProgress, QuizAttempt } from '../types';

const STORAGE_KEY = 'semob_portal_student_progress_v1';
const THEME_KEY = 'semob_portal_theme_mode';

const DEFAULT_PROGRESS: StudentProgress = {
  studentName: 'Desenvolvedor(a) Estagiário(a)',
  startedAt: new Date().toISOString(),
  completedModules: [],
  completedChallenges: [],
  quizAttempts: {},
  notes: {},
};

export const storageService = {
  getProgress(): StudentProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_PROGRESS, ...parsed };
    } catch (e) {
      console.error('Falha ao recuperar progresso do localStorage:', e);
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress(progress: StudentProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Falha ao gravar progresso no localStorage:', e);
    }
  },

  setStudentName(name: string): StudentProgress {
    const current = this.getProgress();
    const updated = { ...current, studentName: name.trim() || 'Desenvolvedor(a) Estagiário(a)' };
    this.saveProgress(updated);
    return updated;
  },

  toggleModuleCompleted(moduleId: string): StudentProgress {
    const current = this.getProgress();
    const exists = current.completedModules.includes(moduleId);
    const updatedModules = exists
      ? current.completedModules.filter((id) => id !== moduleId)
      : [...current.completedModules, moduleId];

    const updated = { ...current, completedModules: updatedModules };
    this.saveProgress(updated);
    return updated;
  },

  toggleChallengeCompleted(challengeId: string): StudentProgress {
    const current = this.getProgress();
    const exists = current.completedChallenges.includes(challengeId);
    const updatedChallenges = exists
      ? current.completedChallenges.filter((id) => id !== challengeId)
      : [...current.completedChallenges, challengeId];

    const updated = { ...current, completedChallenges: updatedChallenges };
    this.saveProgress(updated);
    return updated;
  },

  saveQuizAttempt(attempt: QuizAttempt): StudentProgress {
    const current = this.getProgress();
    const updated = {
      ...current,
      quizAttempts: {
        ...current.quizAttempts,
        [attempt.quizId]: attempt,
      },
    };
    this.saveProgress(updated);
    return updated;
  },

  saveNote(key: string, note: string): StudentProgress {
    const current = this.getProgress();
    const updated = {
      ...current,
      notes: {
        ...current.notes,
        [key]: note,
      },
    };
    this.saveProgress(updated);
    return updated;
  },

  resetAllProgress(): StudentProgress {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_PROGRESS;
  },

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
    } catch (e) {
      console.error('Falha ao salvar tema no localStorage:', e);
    }
  },
};
