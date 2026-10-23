export type CanonicalModuleId =
  | 'mod-1-ambiente'
  | 'mod-2-git'
  | 'mod-3-banco-dados'
  | 'mod-4-backend'
  | 'mod-5-frontend';

export type CanonicalChallengeId =
  | 'challenge-sql-relatorios'
  | 'challenge-backend-api'
  | 'challenge-frontend-ui'
  | 'challenge-fullstack-infoonibus';

export type UserRole = 'ALUNO' | 'DESENVOLVEDOR' | 'SUPERVISOR' | 'ADMIN';
export type ContentAudience = 'PUBLICO' | 'INTERNO' | 'RESTRITO_PERFIL';
export type ContentScope = 'GERAL' | 'INSTITUCIONAL_SEMOB';
export type ReviewStatus = 'PENDENTE' | 'EM_REVISAO' | 'APROVADO' | 'AJUSTES_SOLICITADOS';

export type ScreenType =
  | 'home'
  | 'roteiro'
  | 'biblioteca'
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
  | 'desafio-infoonibus'
  | 'sql-challenge'
  | 'backend-challenge'
  | 'frontend-challenge'
  | 'fullstack-challenge'
  | 'certificado'
  | 'validar-certificado';

export type ThemeMode = 'dark' | 'light';

export interface QuizOption {
  id: string;
  text: string;
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

export interface InteractiveFolderItem {
  id: string;
  path: string;
  type: 'folder' | 'file';
  analogy: string;
  purpose: string;
  filesInside: string[];
  mustDo: string[];
  mustNotDo: string[];
  codePreview?: string;
}

export interface GuidedStepItem {
  stepNumber: number;
  title: string;
  fileTarget: string;
  questionAnswered: string;
  whyItMatters: string;
  lineByLineExplanations: { lineHighlight: string; explanation: string }[];
  code: string;
  language: string;
}

export interface HttpStatusCodeItem {
  code: number;
  phrase: string;
  category: '2xx' | '4xx' | '5xx';
  analogy: string;
  realWorldScenario: string;
  howToTriggerNest: string;
  responsePreview: string;
}

export interface ModuleSection {
  heading: string;
  body: string;
  paragraphs?: string[];
  bullets?: string[];
  codeExample?: string;
  codeLanguage?: string;
  tip?: string;
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
  folderExplorer?: InteractiveFolderItem[];
  guidedTutorialSteps?: GuidedStepItem[];
  enableSwaggerSimulator?: boolean;
  enableFrontendBridgeSimulator?: boolean;
  enableFrontendFolderGame?: boolean;
  httpCodesExplorer?: HttpStatusCodeItem[];
  enableDualModeSimulator?: boolean;
  enableCdpSimulator?: boolean;
  enableEnvSimulator?: boolean;
}

export interface LearningModule {
  id: CanonicalModuleId | string;
  order: number;
  title: string;
  category: 'fundamentos' | 'git' | 'banco-dados' | 'backend' | 'frontend' | 'arquitetura' | string;
  estimatedTime: string;
  /** Carga horária oficial em horas para compor o certificado (Q34) */
  workloadHours?: number;
  /** Versão semântica do conteúdo para auditoria de progresso e certificado (C7) */
  version?: string;
  updatedAt?: string;
  audience?: ContentAudience;
  scope?: ContentScope;
  description: string;
  objectives: string[];
  /** Habilidades observáveis da matriz de competências (Q4 / verso do certificado) */
  competencies?: string[];
  sections: ModuleSection[];
  checklist: string[];
  externalManualUrl?: string;

  // Propriedades opcionais para compatibilidade
  screenKey?: ScreenType;
  shortTitle?: string;
  subtitle?: string;
  duration?: string;
  htmlFile?: string;
  iconName?: string;
  quizId?: string;
  topics?: string[];
}

export type ModuleMetadata = LearningModule;

export interface QuizQuestion {
  id: string;
  moduleId: CanonicalModuleId | string;
  question: string;
  options: (string | QuizOption)[];
  correctOptionIndex: number;
  explanation: string;
  competencyTag?: string;
  category?: string;
  codeSnippet?: string;
  language?: string;
  correctOptionId?: string;
}

export interface QuizBlockData {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizAttempt {
  moduleId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  attemptNumber?: number;
  contentVersion?: string;

  // Propriedades legadas para compatibilidade
  quizId?: string;
  selectedAnswers?: Record<string, any>;
  correctCount?: number;
}

export interface ChallengeSubmission {
  challengeId: CanonicalChallengeId | string;
  repositoryUrl?: string;
  deployUrl?: string;
  checkedPrItems: number[];
  checklistCompleted: boolean;
  sqlQueries?: Record<string, string>;
  reviewStatus?: ReviewStatus;
  supervisorFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  completedAt?: string;
}

export interface CertificateApprovalRecord {
  status: 'BLOQUEADO' | 'AGUARDANDO_SUPERVISOR' | 'EMITIDO' | 'ANULADO';
  seiProcessNumber?: string;
  approvedBySupervisor?: string;
  approvedAt?: string;
  revokedReason?: string;
  trackVersion: string;
  totalWorkloadHours: number;
}

export interface IntegrationStep {
  id?: string;
  dayOrPhase?: string;
  title: string;
  description?: string;
  deliverables?: string[];
  relatedModuleId?: CanonicalModuleId | string;
  step?: number;
  summary?: string;
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

export interface StudentProgress {
  schemaVersion?: number;
  studentName: string;
  studentEmail?: string;
  studentRole?: UserRole;
  seiProcessNumber?: string;
  completedModules: string[];
  completedChecklists: Record<string, string[]>;
  quizScores: Record<string, QuizAttempt>;
  quizHistory: Record<string, QuizAttempt[]>;
  challengeSubmissions: Record<string, ChallengeSubmission>;
  moduleNotes: Record<string, string>;
  startedAt: string;
  completedAt?: string;
  certificateCode?: string;
  certificateApproval?: CertificateApprovalRecord;

  // Aliases sincronizados para compatibilidade de transição
  quizAttempts?: Record<string, QuizAttempt>;
  completedChallenges?: string[];
  notes?: Record<string, string>;
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
  prChecklist: string[];
  referenceGuideUrl?: string;
  referenceSolutionUrl?: string;
}

// ==========================================
// Comunidade & Fórum de Dúvidas (devjourney)
// ==========================================
export interface ForumComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'Aluno' | 'Monitor' | 'Supervisor' | 'Instrutor';
  content: string;
  createdAt: string;
  isSolution?: boolean;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  moduleId: string;
  moduleTitle: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  tags: string[];
  upvotes: number;
  userHasUpvoted?: boolean;
  solved: boolean;
  commentsCount: number;
  comments: ForumComment[];
}

export interface ForumFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// ==========================================
// Ofensivas & Heatmap estilo GitHub (devjourney)
// ==========================================
export interface HeatmapDay {
  date: string;
  count: number; // 0 a 4+
  lessonsCompleted: number;
  minutesSpent: number;
}

// ==========================================
// Mapa de Competências & Perfil (devjourney)
// ==========================================
export interface SkillScore {
  skill: string;
  score: number;
  fullMark: number;
  category: string;
  description: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
}

// ==========================================
// Painel do Supervisor (plataforma-semob)
// ==========================================
export type SupervisorDecision = 'aprovada' | 'aprovada_com_ajustes' | 'precisa_de_correcao';

export interface SubmissionReviewItem {
  id: string;
  submissionId: string;
  studentName: string;
  studentEmail: string;
  challengeId: string;
  challengeTitle: string;
  submittedAt: string;
  waitingHours: number;
  repositoryUrl: string;
  deployUrl?: string;
  status: ReviewStatus;
  checkedPrItems: number[];
  sqlQueriesCount?: number;
  supervisorFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface CertificateHomologationItem {
  id: string;
  studentName: string;
  studentEmail: string;
  seiProcessNumber: string;
  trackTitle: string;
  workloadHours: number;
  completedModulesCount: number;
  totalModulesCount: number;
  averageScore: number;
  status: 'ELEGIVEL' | 'HOMOLOGADO' | 'ANULADO';
  requestedAt: string;
  certificateCode?: string;
}

export interface InternProgressOverview {
  id: string;
  name: string;
  email: string;
  area: string;
  completedSteps: number;
  totalSteps: number;
  quizAverage: number;
  lastAccess: string;
  status: 'em_dia' | 'revisao_pendente' | 'atencao' | 'concluido';
}

// ==========================================
// Administração de Trilhas & Usuários (nexora)
// ==========================================
export type PublishingStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface ManagedTrack {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  area: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  estimatedHours: number;
  publishingStatus: PublishingStatus;
  version: string;
  enrolledStudentsCount: number;
  lastUpdatedAt: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  title: string;
  role: UserRole;
  organizationName: string;
  joinedAt: string;
  avatarUrl?: string;
}
