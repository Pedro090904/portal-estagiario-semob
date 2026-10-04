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

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  language?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  category: string;
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
  quizId: string;
  selectedAnswers: Record<string, string>; // questionId -> optionId
  score: number; // porcentagem (0 a 100)
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
  passed: boolean;
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

export interface StudentProgress {
  studentName: string;
  startedAt: string;
  completedModules: string[]; // module ids
  completedChallenges: string[]; // challenge ids
  quizAttempts: Record<string, QuizAttempt>; // quizId -> attempt
  notes: Record<string, string>; // notes by question or challenge
}
