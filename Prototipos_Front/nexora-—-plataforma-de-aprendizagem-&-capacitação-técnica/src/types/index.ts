/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'supervisor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId: string;
  organizationName: string;
  title: string;
  joinedAt: string;
  supervisorId?: string;
}

export type CompetencyStatus = 'not_started' | 'in_progress' | 'validated' | 'needs_review';

export interface Competency {
  id: string;
  name: string;
  description: string;
  domain: 'database' | 'backend' | 'frontend' | 'engineering' | 'soft_skills';
  status: CompetencyStatus;
  lastValidatedAt?: string;
  validatedBy?: string;
  evidenceCount: number;
  relatedTrackId: string;
}

export type TrackStatus = 'not_enrolled' | 'in_progress' | 'completed';
export type PublishingStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface Stage {
  id: string;
  moduleId: string;
  trackId: string;
  title: string;
  description: string;
  type: 'reading' | 'quiz' | 'sql_challenge' | 'backend_challenge' | 'frontend_challenge' | 'project';
  durationMinutes: number;
  order: number;
  isCompleted: boolean;
  isRequired: boolean;
  challengeId?: string;
  contentMarkdown?: string;
  quizQuestions?: QuizQuestion[];
  competencyIds: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  explanation: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export interface Module {
  id: string;
  trackId: string;
  title: string;
  description: string;
  order: number;
  stages: Stage[];
}

export interface Track {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  area: 'Engenharia de Software' | 'Banco de Dados' | 'Arquitetura & Backend' | 'Frontend Moderno' | 'DevOps & Qualidade';
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  estimatedHours: number;
  publishingStatus: PublishingStatus;
  enrolledStudentsCount: number;
  modules: Module[];
  prerequisites: string[];
  learningObjectives: string[];
  competenciesWorked: string[];
  finalProjectDescription?: string;
  certificationAvailable: boolean;
  version: string;
  lastUpdatedAt: string;
}

export type ChallengeType = 'sql' | 'backend' | 'frontend';
export type SubmissionStatus = 'pending' | 'evaluating' | 'approved' | 'rejected' | 'needs_revision';

export interface CriterionResult {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  feedback?: string;
  pointsAwarded: number;
  maxPoints: number;
}

export interface SubmissionEvaluation {
  id: string;
  submissionId: string;
  status: SubmissionStatus;
  scorePercentage: number;
  summaryFeedback: string;
  criteriaResults: CriterionResult[];
  evaluatedAt: string;
  evaluatorName: string;
  isAutomated: boolean;
  nextRecommendedAction: string;
}

export interface BaseChallenge {
  id: string;
  trackId: string;
  stageId: string;
  type: ChallengeType;
  title: string;
  domain: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  estimatedMinutes: number;
  summary: string;
  problemStatement: string;
  functionalRequirements: string[];
  restrictions: string[];
  acceptanceCriteria: string[];
  hints: string[];
}

export interface SqlTableColumn {
  name: string;
  type: string;
  description: string;
  isPrimary?: boolean;
  isForeign?: boolean;
}

export interface SqlTableSchema {
  tableName: string;
  description: string;
  columns: SqlTableColumn[];
  sampleRows: Record<string, any>[];
}

export interface SqlChallenge extends BaseChallenge {
  type: 'sql';
  schemas: SqlTableSchema[];
  initialQuery: string;
  solutionQuery: string;
  expectedColumns: string[];
  expectedRowCount: number;
  explanation: string;
}

export interface BackendEndpointContract {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestHeaders?: Record<string, string>;
  requestBodySchema?: string;
  responseBodyExample: string;
  expectedStatusCode: number;
}

export interface BackendTestCase {
  id: string;
  title: string;
  type: 'contract' | 'business_rule' | 'edge_case';
  description: string;
  passed: boolean;
  durationMs: number;
  errorLog?: string;
}

export interface BackendChallenge extends BaseChallenge {
  type: 'backend';
  apiSpecTitle: string;
  endpoints: BackendEndpointContract[];
  testSuites: {
    suiteName: string;
    cases: BackendTestCase[];
  }[];
  starterCodeRepoUrl: string;
}

export interface FrontendChallenge extends BaseChallenge {
  type: 'frontend';
  visualRequirements: string[];
  responsiveBreakpoints: string[];
  a11yCriteria: string[];
  starterTemplate: string;
  referenceComponentPreviewHtml?: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  studentId: string;
  studentName: string;
  attemptNumber: number;
  submittedAt: string;
  type: ChallengeType;
  codeOrQuery?: string;
  repositoryUrl?: string;
  branchName?: string;
  commitHash?: string;
  evaluation?: SubmissionEvaluation;
}

export interface LibraryItem {
  id: string;
  title: string;
  category: 'Manuais' | 'Guias Rápidos' | 'Boas Práticas' | 'Exemplos Práticos' | 'Normas & Padrões';
  type: 'article' | 'cheatsheet' | 'standard';
  readingTimeMinutes: number;
  tags: string[];
  summary: string;
  contentMarkdown: string;
  relatedTrackId?: string;
  lastUpdated: string;
}

export interface ProjectDeliverable {
  id: string;
  projectId: string;
  studentId: string;
  stageName: string;
  title: string;
  repositoryUrl: string;
  liveDemoUrl?: string;
  technicalNotes: string;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'approved' | 'revision_requested';
  supervisorFeedback?: string;
  reviewedAt?: string;
}

export interface Certificate {
  id: string;
  credentialCode: string;
  studentId: string;
  studentName: string;
  trackId: string;
  trackTitle: string;
  workloadHours: number;
  issuedAt: string;
  issuedByOrganization: string;
  supervisorSignature: string;
  competenciesSummary: string[];
  status: 'active' | 'revoked';
}
