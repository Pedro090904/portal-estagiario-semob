// Definições de Tipagem Estrita TypeScript (Padrão SUTINF - sem uso de 'any')

export type ScreenType = 
  | 'home' 
  | 'roteiro' 
  | 'modulo-git' 
  | 'modulo-sql' 
  | 'modulo-gabarito' 
  | 'modulo-backend' 
  | 'modulo-frontend' 
  | 'quizzes' 
  | 'desafio-sql' 
  | 'desafio-backend' 
  | 'desafio-frontend' 
  | 'certificado';

export type ThemeMode = 'dark' | 'light';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  language?: string;
  options: (QuizOption | string)[];
  correctOptionId?: string;
  correctOptionIndex?: number;
  explanation: string;
  category?: string;
  moduleId?: string;
}

export interface QuizBlockData {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  questions: QuizQuestion[];
  passingScore: number; // Porcentagem mínima de aprovação (ex: 70)
}

export interface QuizAttempt {
  moduleId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  attemptNumber?: number;

  // Propriedades para compatibilidade com a UI existente
  quizId?: string;
  selectedAnswers?: Record<string, any>;
  correctCount?: number;
}

export interface ChallengeSubmission {
  challengeId: string;
  repositoryUrl?: string;
  checklistCompleted: boolean;
  completedAt: string;
}

export interface StudentProgress {
  schemaVersion?: number;
  studentName: string;
  completedModules: string[];
  completedChecklists: Record<string, string[]>;
  /** Mantém a melhor tentativa ou a mais recente para compatibilidade imediata com a UI */
  quizScores: Record<string, QuizAttempt>;
  /** NOVO: Histórico completo de todas as tentativas por módulo (Fase 4) */
  quizHistory: Record<string, QuizAttempt[]>;
  /** NOVO: Submissões estruturadas de desafios práticos */
  challengeSubmissions?: Record<string, ChallengeSubmission>;
  moduleNotes: Record<string, string>;
  startedAt: string;
  completedAt?: string;
  certificateCode?: string;

  // Aliases sincronizados para 100% de compatibilidade com as telas atuais
  quizAttempts: Record<string, QuizAttempt>;
  completedChallenges: string[];
  notes: Record<string, string>;
}

export interface SqlQuestion {
  id: string;
  letter: string;
  title: string;
  category: 'Parte I: Linha 0.111' | 'Parte II: Sentidos 0.170' | 'Parte III: Cruzamentos Gerais';
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  objective: string;
  officialQuery: string;
  logicExplanation: string;
  trapsAndTips: string;
}

export interface ModuleMetadata {
  id: string;
  screenKey: ScreenType;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: 'Fundamental' | 'Dados' | 'Back-end' | 'Front-end' | 'Prática';
  duration: string;
  htmlFile: string;
  description: string;
  iconName: string;
  quizId: string;
  topics: string[];
}
