import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_TRACKS } from '../data/mockTracks';
import { MOCK_MATERIALS } from '../data/mockMaterials';
import { MOCK_FORUM_THREADS } from '../data/mockForum';
import { INITIAL_BADGES, INITIAL_SKILL_SCORES, generateMockHeatmap, MOCK_CERTIFICATE } from '../data/mockProfile';
import { Badge, Certificate, ForumThread, HeatmapDay, LearningMaterial, Module, ModuleStatus, SkillScore, Track } from '../types/lms';

export type NavigationTab = 'dashboard' | 'tracks' | 'skill-tree' | 'player' | 'library' | 'community' | 'profile';

interface QuizResult {
  scorePercent: number;
  passed: boolean;
  completedAt: string;
}

interface LMSContextType {
  // Navigation & Theme
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Track & Module selection
  tracks: Track[];
  activeTrack: Track;
  selectTrack: (trackId: string) => void;
  enrollInTrack: (trackId: string) => void;
  activeModule: Module | null;
  activeLessonId: string | null;
  setActiveLesson: (moduleId: string, lessonId: string) => void;
  
  // Progression states
  completedLessonIds: string[];
  toggleLessonCompleted: (lessonId: string, completed?: boolean) => void;
  quizResults: Record<string, QuizResult>;
  submitQuiz: (moduleId: string, scorePercent: number) => { passed: boolean; rewardXP: number };
  getModuleStatus: (module: Module) => ModuleStatus;
  getTrackProgressPercent: (trackId: string) => number;
  getNextRecommendedLesson: () => { module: Module; lesson: Module['lessons'][0] } | null;

  // Student metrics & Gamification
  userXP: number;
  currentStreak: number;
  weeklyGoalHours: number;
  completedWeeklyMinutes: number;
  badges: Badge[];
  skillScores: SkillScore[];
  heatmapDays: HeatmapDay[];
  certificate: Certificate;

  // Modals & Popups
  quizModalModule: Module | null;
  openQuizModal: (module: Module) => void;
  closeQuizModal: () => void;
  detailModalModule: Module | null;
  openModuleDetail: (module: Module) => void;
  closeModuleDetail: () => void;
  isCertificateModalOpen: boolean;
  setIsCertificateModalOpen: (open: boolean) => void;

  // Study Notes & Library
  notes: Record<string, string>;
  saveNote: (lessonId: string, note: string) => void;
  materials: LearningMaterial[];
  bookmarkedMaterialIds: string[];
  toggleBookmarkMaterial: (materialId: string) => void;

  // Community / Forum
  forumThreads: ForumThread[];
  toggleUpvoteThread: (threadId: string) => void;
  addForumThread: (newThread: { title: string; content: string; tags: string[]; moduleId: string }) => void;
  addCommentToThread: (threadId: string, commentText: string) => void;

  // Direct study launcher
  startOrContinueModule: (module: Module) => void;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  THEME: 'devjourney_theme',
  COMPLETED_LESSONS: 'devjourney_completed_lessons',
  QUIZ_RESULTS: 'devjourney_quiz_results',
  USER_XP: 'devjourney_user_xp',
  ACTIVE_TRACK_ID: 'devjourney_active_track_id',
  SAVED_NOTES: 'devjourney_saved_notes',
  BOOKMARKS: 'devjourney_bookmarks',
  FORUM_THREADS: 'devjourney_forum_threads'
};

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Navigation
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');

  // Tracks data
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [activeTrackId, setActiveTrackId] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_TRACK_ID) || 'track-dev-junior';
  });

  const activeTrack = useMemo(() => {
    return tracks.find(t => t.id === activeTrackId) || tracks[0];
  }, [tracks, activeTrackId]);

  // Lessons completed
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPLETED_LESSONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial mock progress: first 3 lessons of mod-1 and 2 of mod-2 completed
    return ['les-1-1', 'les-1-2', 'les-1-3', 'les-2-1', 'les-2-2', 'les-3-1'];
  });

  // Quiz results: { [moduleId]: { scorePercent: number, passed: boolean, completedAt: string } }
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.QUIZ_RESULTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // By default, mod-1 and mod-2 quizzes are already passed
    return {
      'mod-1': { scorePercent: 100, passed: true, completedAt: '2026-09-20' },
      'mod-2': { scorePercent: 85, passed: true, completedAt: '2026-09-29' }
    };
  });

  // User XP
  const [userXP, setUserXP] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_XP);
    return saved ? parseInt(saved, 10) : 1240;
  });

  // Active module & lesson in study player
  const [activeModuleId, setActiveModuleId] = useState<string>('mod-3');
  const [activeLessonId, setActiveLessonId] = useState<string | null>('les-3-2');

  // Study notes
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVED_NOTES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      'les-3-1': 'Lembrar de sempre testar tags semânticas no leitor de tela NVDA antes de finalizar o layout.'
    };
  });

  // Forum threads state
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FORUM_THREADS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return MOCK_FORUM_THREADS;
  });

  // Bookmarked materials
  const [bookmarkedMaterialIds, setBookmarkedMaterialIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['mat-1', 'mat-2'];
  });

  // Modals state
  const [quizModalModule, setQuizModalModule] = useState<Module | null>(null);
  const [detailModalModule, setDetailModalModule] = useState<Module | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);

  // Gamification metrics
  const currentStreak = 12;
  const weeklyGoalHours = 8;
  const completedWeeklyMinutes = 345; // 5.75 hours
  const heatmapDays = useMemo(() => generateMockHeatmap(), []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(quizResults));
  }, [quizResults]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_XP, userXP.toString());
  }, [userXP]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_TRACK_ID, activeTrackId);
  }, [activeTrackId]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SAVED_NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkedMaterialIds));
  }, [bookmarkedMaterialIds]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FORUM_THREADS, JSON.stringify(forumThreads));
  }, [forumThreads]);

  // Determine module status based on prerequisites and quizzes
  const getModuleStatus = (module: Module): ModuleStatus => {
    const quizResult = quizResults[module.id];
    const isQuizPassed = !!quizResult?.passed;

    // Check prerequisites
    const prerequisitesMet = module.prerequisiteModuleIds.every(prereqId => {
      return quizResults[prereqId]?.passed === true;
    });

    if (!prerequisitesMet) {
      return 'locked';
    }

    const allLessonsDone = module.lessons.length > 0 && module.lessons.every(l => completedLessonIds.includes(l.id));

    if (isQuizPassed && allLessonsDone) {
      return 'completed';
    }

    const hasStartedLessons = module.lessons.some(l => completedLessonIds.includes(l.id));
    if (hasStartedLessons || isQuizPassed) {
      return 'in_progress';
    }

    return 'unlocked';
  };

  // Calculate track progress
  const getTrackProgressPercent = (trackId: string): number => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || !track.modules || track.modules.length === 0) return 0;

    let totalPoints = 0;
    let earnedPoints = 0;

    track.modules.forEach(m => {
      // Each lesson = 1 point, each passed quiz = 2 points
      totalPoints += m.lessons.length + 2;
      m.lessons.forEach(l => {
        if (completedLessonIds.includes(l.id)) earnedPoints += 1;
      });
      if (quizResults[m.id]?.passed) {
        earnedPoints += 2;
      }
    });

    if (totalPoints === 0) return 0;
    return Math.min(100, Math.round((earnedPoints / totalPoints) * 100));
  };

  // Find next recommended lesson for the active track
  const getNextRecommendedLesson = (): { module: Module; lesson: Module['lessons'][0] } | null => {
    if (!activeTrack.modules) return null;

    for (const mod of activeTrack.modules) {
      const status = getModuleStatus(mod);
      if (status !== 'locked') {
        const uncompletedLesson = mod.lessons.find(l => !completedLessonIds.includes(l.id));
        if (uncompletedLesson) {
          return { module: mod, lesson: uncompletedLesson };
        }
      }
    }

    // If all unlocked lessons are completed, pick first lesson of last available module
    const firstMod = activeTrack.modules[0];
    if (firstMod && firstMod.lessons[0]) {
      return { module: firstMod, lesson: firstMod.lessons[0] };
    }
    return null;
  };

  // Toggle lesson completion
  const toggleLessonCompleted = (lessonId: string, completed?: boolean) => {
    setCompletedLessonIds(prev => {
      const isAlready = prev.includes(lessonId);
      const shouldComplete = completed !== undefined ? completed : !isAlready;

      if (shouldComplete && !isAlready) {
        // Award XP for completing a lesson
        setUserXP(x => x + 35);
        return [...prev, lessonId];
      } else if (!shouldComplete && isAlready) {
        return prev.filter(id => id !== lessonId);
      }
      return prev;
    });
  };

  // Submit Quiz
  const submitQuiz = (moduleId: string, scorePercent: number) => {
    const module = activeTrack.modules?.find(m => m.id === moduleId);
    const passingScore = module?.quiz.passingScorePercent || 70;
    const passed = scorePercent >= passingScore;
    const rewardXP = passed ? (module?.quiz.rewardXP || 150) : 25;

    setQuizResults(prev => ({
      ...prev,
      [moduleId]: {
        scorePercent,
        passed,
        completedAt: new Date().toISOString().split('T')[0]
      }
    }));

    setUserXP(prev => prev + rewardXP);

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if canvas not supported
      }
    }

    return { passed, rewardXP };
  };

  const selectTrack = (trackId: string) => {
    setActiveTrackId(trackId);
    const target = tracks.find(t => t.id === trackId);
    if (target && target.modules && target.modules.length > 0) {
      setActiveModuleId(target.modules[0].id);
      if (target.modules[0].lessons[0]) {
        setActiveLessonId(target.modules[0].lessons[0].id);
      }
    }
  };

  const enrollInTrack = (trackId: string) => {
    setTracks(prev =>
      prev.map(t => (t.id === trackId ? { ...t, enrolled: true } : t))
    );
    selectTrack(trackId);
  };

  const setActiveLesson = (moduleId: string, lessonId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
  };

  const startOrContinueModule = (module: Module) => {
    setActiveModuleId(module.id);
    const uncompleted = module.lessons.find(l => !completedLessonIds.includes(l.id));
    setActiveLessonId(uncompleted ? uncompleted.id : (module.lessons[0]?.id || null));
    setCurrentTab('player');
  };

  // Modal handlers
  const openQuizModal = (module: Module) => {
    setQuizModalModule(module);
  };

  const closeQuizModal = () => {
    setQuizModalModule(null);
  };

  const openModuleDetail = (module: Module) => {
    setDetailModalModule(module);
  };

  const closeModuleDetail = () => {
    setDetailModalModule(null);
  };

  // Notes
  const saveNote = (lessonId: string, note: string) => {
    setNotes(prev => ({
      ...prev,
      [lessonId]: note
    }));
  };

  // Bookmarks
  const toggleBookmarkMaterial = (materialId: string) => {
    setBookmarkedMaterialIds(prev =>
      prev.includes(materialId) ? prev.filter(id => id !== materialId) : [...prev, materialId]
    );
  };

  // Forum actions
  const toggleUpvoteThread = (threadId: string) => {
    setForumThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          const hasUpvoted = t.userHasUpvoted;
          return {
            ...t,
            userHasUpvoted: !hasUpvoted,
            upvotes: hasUpvoted ? t.upvotes - 1 : t.upvotes + 1
          };
        }
        return t;
      })
    );
  };

  const addForumThread = (newThread: { title: string; content: string; tags: string[]; moduleId: string }) => {
    const mod = activeTrack.modules?.find(m => m.id === newThread.moduleId);
    const thread: ForumThread = {
      id: `thread-${Date.now()}`,
      trackId: activeTrack.id,
      moduleId: newThread.moduleId,
      moduleTitle: mod ? mod.title : 'Geral',
      title: newThread.title,
      authorName: 'Pedro M. Sousa',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: 'Agora mesmo',
      content: newThread.content,
      tags: newThread.tags,
      upvotes: 1,
      userHasUpvoted: true,
      commentsCount: 0,
      solved: false,
      comments: []
    };

    setForumThreads(prev => [thread, ...prev]);
    setUserXP(x => x + 20); // Award XP for asking in community
  };

  const addCommentToThread = (threadId: string, commentText: string) => {
    setForumThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorName: 'Pedro M. Sousa',
            authorRole: 'Aluno' as const,
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            content: commentText,
            createdAt: 'Agora mesmo',
            upvotes: 0
          };
          return {
            ...t,
            commentsCount: t.commentsCount + 1,
            comments: [...t.comments, newComment]
          };
        }
        return t;
      })
    );
    setUserXP(x => x + 15);
  };

  const activeModule = useMemo(() => {
    return activeTrack.modules?.find(m => m.id === activeModuleId) || activeTrack.modules?.[0] || null;
  }, [activeTrack, activeModuleId]);

  return (
    <LMSContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        theme,
        toggleTheme,
        tracks,
        activeTrack,
        selectTrack,
        enrollInTrack,
        activeModule,
        activeLessonId,
        setActiveLesson,
        completedLessonIds,
        toggleLessonCompleted,
        quizResults,
        submitQuiz,
        getModuleStatus,
        getTrackProgressPercent,
        getNextRecommendedLesson,
        userXP,
        currentStreak,
        weeklyGoalHours,
        completedWeeklyMinutes,
        badges: INITIAL_BADGES,
        skillScores: INITIAL_SKILL_SCORES,
        heatmapDays,
        certificate: MOCK_CERTIFICATE,
        quizModalModule,
        openQuizModal,
        closeQuizModal,
        detailModalModule,
        openModuleDetail,
        closeModuleDetail,
        isCertificateModalOpen,
        setIsCertificateModalOpen,
        notes,
        saveNote,
        materials: MOCK_MATERIALS,
        bookmarkedMaterialIds,
        toggleBookmarkMaterial,
        forumThreads,
        toggleUpvoteThread,
        addForumThread,
        addCommentToThread,
        startOrContinueModule
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = (): LMSContextType => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
