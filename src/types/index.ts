// Definições de Tipagem Estrita TypeScript (Padrão SUTINF - sem uso de 'any')

export type ScreenType = 
  | 'home' 
  | 'roteiro' 
  | 'modulo-ambiente'
  | 'modulo-git' 
  | 'modulo-sql' 
  | 'modulo-gabarito' 
  | 'modulo-backend' 
  | 'modulo-frontend' 
  | 'quizzes' 
  | 'desafio-sql' 
  | 'desafio-backend' 
  | 'desafio-frontend' 
  | 'sql-challenge'
  | 'backend-challenge'
  | 'frontend-challenge'
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
  deployUrl?: string;
  checkedPrItems: number[];
  checklistCompleted: boolean;
  /** Guarda as queries SQL digitadas pelo aluno em cada uma das questões */
  sqlQueries?: Record<string, string>;
  completedAt?: string;
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

export interface RichCallout {
  type: 'info' | 'success' | 'warning' | 'danger' | 'important';
  title: string;
  content: string;
  bullets?: string[];
}

export interface RichTable {
  headers: string[];
  rows: string[][];
}

export interface RichCodeBlock {
  title: string;
  language: string;
  code: string;
}

export interface RichCommandCard {
  name: string;
  role: string;
  concept: string;
  details?: string[];
  code: string;
}

export interface RichScenarioCard {
  title: string;
  badgeText: string;
  badgeType: 'info' | 'warning' | 'danger' | 'success';
  description: string;
  commands: string[];
  extraNote?: string;
}

export interface ModuleSection {
  heading: string;
  body: string;
  paragraphs?: string[];
  bullets?: string[];
  codeExample?: string;
  codeLanguage?: string;
  tip?: string;
  /** NOVOS BLOCOS RICOS EXTRAÍDOS DOS MANUAIS HTML */
  callouts?: RichCallout[];
  tables?: RichTable[];
  codeBlocks?: RichCodeBlock[];
  commandCards?: RichCommandCard[];
  scenarios?: RichScenarioCard[];
  svgDiagramType?:
    | 'git-4-zones'
    | 'git-tags-pipeline'
    | 'sql-where-join'
    | 'sql-pg-vs-oracle'
    | 'backend-request-lifecycle'
    | 'frontend-unidirectional-flow';
}

export interface LearningModule {
  id: string;
  order: number;
  category: string;
  estimatedTime: string;
  title: string;
  description: string;
  objectives?: string[];
  sections: ModuleSection[];
  checklist?: string[];

  // Compatibilidade com telas existentes (opcionais para permitir módulos modulares)
  screenKey?: ScreenType;
  shortTitle?: string;
  subtitle?: string;
  duration?: string;
  htmlFile?: string;
  iconName?: string;
  quizId?: string;
  topics?: string[];
  externalManualUrl?: string;
}

export type ModuleMetadata = LearningModule;

export interface IntegrationStep {
  step: number;
  title: string;
  summary: string;
  content?: string;
  highlights?: string[];
  rules?: string[];
  quickCheck?: { question: string; answer: string }[];
  stepsToFeature?: string[];
  dockerSetup?: string;
  layers?: { folder: string; desc: string }[];
  requirements?: string[];
  topics?: string[];
}

export type ChallengeCategory = 'sql' | 'backend' | 'frontend' | 'arquitetura';

export interface ChallengeTaskItem {
  id: string;
  title: string;
  description: string;
  codeSnippet?: string;
  expectedOutputHint?: string;
}

export interface ChallengeDefinition {
  id: string;
  slug: ChallengeCategory;
  title: string;
  subtitle: string;
  badgeText: string;
  estimatedTime: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  scenarioDescription: string;
  architectureOrSchemaCode?: {
    title: string;
    language: string;
    code: string;
  };
  tasks: ChallengeTaskItem[];
  /** Checklist de Revisão de PR (Definition of Done) exigido para concluir */
  prChecklist: string[];
  referenceGuideUrl?: string;
  referenceSolutionUrl?: string;
}
