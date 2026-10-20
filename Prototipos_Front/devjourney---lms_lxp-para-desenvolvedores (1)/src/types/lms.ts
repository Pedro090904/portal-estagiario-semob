export type TrackLevel = 'Iniciante' | 'Intermediário' | 'Avançado';
export type ModuleStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';
export type LessonType = 'video' | 'article' | 'exercise';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  type: LessonType;
  completed: boolean;
  videoUrl?: string;
  contentMarkdown?: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'code_analysis';
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  codeSnippet?: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  passingScorePercent: number; // e.g., 70
  questions: QuizQuestion[];
  rewardXP: number;
}

export interface Module {
  id: string;
  trackId: string;
  title: string;
  description: string;
  tier: 'basic' | 'intermediate' | 'advanced';
  order: number;
  prerequisiteModuleIds: string[]; // for skill tree branch dependencies
  estimatedHours: number;
  iconName: string;
  lessons: Lesson[];
  quiz: Quiz;
  skillsAcquired: string[];
}

export interface Track {
  id: string;
  title: string;
  slug: string;
  category: 'Fullstack' | 'Frontend' | 'Backend' | 'DevOps' | 'Mobile';
  level: TrackLevel;
  description: string;
  totalModules: number;
  totalHours: number;
  modules: Module[];
  enrolled: boolean;
  featured?: boolean;
}

export interface LearningMaterial {
  id: string;
  title: string;
  category: 'Cheat Sheet' | 'Documentação' | 'Repositório' | 'Guia Prático' | 'Template';
  trackSlug: string;
  moduleName?: string;
  readTimeMinutes: number;
  description: string;
  downloadUrl?: string;
  githubUrl?: string;
  markdownContent?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface ForumComment {
  id: string;
  authorName: string;
  authorRole: 'Aluno' | 'Monitor' | 'Instrutor';
  authorAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isSolution?: boolean;
}

export interface ForumThread {
  id: string;
  trackId: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  content: string;
  tags: string[];
  upvotes: number;
  userHasUpvoted?: boolean;
  commentsCount: number;
  solved: boolean;
  comments: ForumComment[];
}

export interface FAQItem {
  id: string;
  moduleId: string;
  question: string;
  answer: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progressPercent: number;
  unlocked: boolean;
}

export interface SkillScore {
  skill: string;
  score: number; // 0 to 100
  fullMark: number;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // 0 to 4
  lessonsCompleted: number;
  minutesSpent: number;
}

export interface Certificate {
  id: string;
  trackTitle: string;
  studentName: string;
  issueDate: string;
  totalHours: number;
  verificationCode: string;
  skills: string[];
}
