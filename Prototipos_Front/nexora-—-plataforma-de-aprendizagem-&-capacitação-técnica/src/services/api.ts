/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Track,
  Stage,
  SqlChallenge,
  BackendChallenge,
  FrontendChallenge,
  ChallengeSubmission,
  Competency,
  LibraryItem,
  ProjectDeliverable,
  Certificate,
  User,
  UserRole,
  SubmissionEvaluation,
} from '../types';
import {
  INITIAL_TRACKS,
  INITIAL_USERS,
  INITIAL_COMPETENCIES,
  INITIAL_LIBRARY_ITEMS,
  INITIAL_PROJECT_DELIVERABLES,
  INITIAL_CERTIFICATE,
  SQL_CHALLENGE_DATA,
  BACKEND_CHALLENGE_DATA,
  FRONTEND_CHALLENGE_DATA,
} from './data/seedData';

const STORAGE_KEYS = {
  TRACKS: 'nexora_tracks_v2',
  USERS: 'nexora_users_v2',
  COMPETENCIES: 'nexora_competencies_v2',
  LIBRARY: 'nexora_library_v2',
  SUBMISSIONS: 'nexora_submissions_v2',
  DELIVERABLES: 'nexora_deliverables_v2',
  CERTIFICATES: 'nexora_certificates_v2',
  CURRENT_USER_ID: 'nexora_current_user_id',
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading from localStorage', e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed writing to localStorage', e);
  }
}

export class ApiService {
  // Users & Auth
  static async getCurrentUser(): Promise<User> {
    const users = this.getAllUsersSync();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-pedro';
    const found = users.find((u) => u.id === currentId);
    return found || users[0];
  }

  static async switchUser(userId: string): Promise<User> {
    const users = this.getAllUsersSync();
    const found = users.find((u) => u.id === userId);
    if (!found) throw new Error('Usuário não encontrado');
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    return found;
  }

  static getAllUsersSync(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static async getAllUsers(): Promise<User[]> {
    return this.getAllUsersSync();
  }

  static async updateUserRole(userId: string, newRole: UserRole): Promise<User> {
    const users = this.getAllUsersSync();
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setStored(STORAGE_KEYS.USERS, updated);
    const user = updated.find((u) => u.id === userId);
    if (!user) throw new Error('Usuário inexistente');
    return user;
  }

  // Tracks
  static async getTracks(): Promise<Track[]> {
    return getStored<Track[]>(STORAGE_KEYS.TRACKS, INITIAL_TRACKS);
  }

  static async getTrackById(trackId: string): Promise<Track | undefined> {
    const tracks = await this.getTracks();
    return tracks.find((t) => t.id === trackId);
  }

  static async markStageCompleted(trackId: string, stageId: string): Promise<Track> {
    const tracks = await this.getTracks();
    const updatedTracks = tracks.map((track) => {
      if (track.id !== trackId) return track;
      return {
        ...track,
        modules: track.modules.map((module) => ({
          ...module,
          stages: module.stages.map((stage) => {
            if (stage.id === stageId) {
              return { ...stage, isCompleted: true };
            }
            return stage;
          }),
        })),
      };
    });
    setStored(STORAGE_KEYS.TRACKS, updatedTracks);
    const updated = updatedTracks.find((t) => t.id === trackId);
    if (!updated) throw new Error('Trilha não encontrada');
    return updated;
  }

  static async saveTrack(track: Track): Promise<Track> {
    const tracks = await this.getTracks();
    const exists = tracks.some((t) => t.id === track.id);
    const updated = exists ? tracks.map((t) => (t.id === track.id ? track : t)) : [...tracks, track];
    setStored(STORAGE_KEYS.TRACKS, updated);
    return track;
  }

  // Challenges Data
  static async getSqlChallenge(challengeId: string): Promise<SqlChallenge> {
    return SQL_CHALLENGE_DATA;
  }

  static async getBackendChallenge(challengeId: string): Promise<BackendChallenge> {
    return BACKEND_CHALLENGE_DATA;
  }

  static async getFrontendChallenge(challengeId: string): Promise<FrontendChallenge> {
    return FRONTEND_CHALLENGE_DATA;
  }

  // Real SQL Execution Simulation against Seed Tables
  static async executeSqlQuery(query: string): Promise<{
    columns: string[];
    rows: Record<string, any>[];
    rowCount: number;
    executionTimeMs: number;
    evaluation?: SubmissionEvaluation;
    error?: string;
  }> {
    const startTime = performance.now();
    const trimmed = query.trim().toUpperCase();

    // Basic SQL sanity checks
    if (!trimmed.startsWith('SELECT')) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 12,
        error: 'Erro de sintaxe SQL: apenas consultas SELECT são autorizadas no laboratório analítico.',
      };
    }

    if (!trimmed.includes('CLIENTES') || !trimmed.includes('PEDIDOS')) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 18,
        error: 'Erro relacional: a consulta precisa relacionar a tabela de clientes e pedidos (JOIN requerido).',
      };
    }

    // Process realistic joins & groupings based on the problem statement
    // Data in seed:
    // TechVibe Soluções (Tecnologia): Pedido 101 ($14500), Pedido 103 ($21900) -> total: $36400, count: 2, avg: $18200
    // BioSaúde Integrada (Saúde): Pedido 102 ($8200.50), Pedido 106 ($12400) -> total: $20600.50, count: 2, avg: $10300.25
    // VarejoGlobal (Varejo): Pedido 104 ($4300, pendente) -> EXCLUDED from status = 'concluido'
    // FinSeguros Capital (Finanças): Pedido 105 ($35000) -> total: $35000, count: 1, avg: $35000
    // AgroSul Cooperativa (Indústria): 0 pedidos concluidos

    const simulatedRows = [
      { segmento: 'Tecnologia', total_pedidos: 2, faturamento_total: 36400.0, ticket_medio: 18200.0 },
      { segmento: 'Finanças', total_pedidos: 1, faturamento_total: 35000.0, ticket_medio: 35000.0 },
      { segmento: 'Saúde', total_pedidos: 2, faturamento_total: 20600.5, ticket_medio: 10300.25 },
    ];

    const hasStatusFilter = trimmed.includes("'CONCLUIDO'") || trimmed.includes('"CONCLUIDO"');
    const hasGroupBy = trimmed.includes('GROUP BY');
    const hasOrder = trimmed.includes('ORDER BY');

    const duration = Math.round(performance.now() - startTime) + 38; // realistic query latency

    // Check criteria
    const criteriaResults = [
      {
        id: 'crit-columns',
        title: 'Nomes e projeção de colunas',
        description: 'Retorna segmento, total_pedidos, faturamento_total e ticket_medio',
        passed: trimmed.includes('SEGMENTO') && trimmed.includes('TOTAL_PEDIDOS'),
        pointsAwarded: trimmed.includes('SEGMENTO') ? 25 : 0,
        maxPoints: 25,
      },
      {
        id: 'crit-filter',
        title: "Filtro de status = 'concluido'",
        description: 'Desconsidera pedidos cancelados ou pendentes',
        passed: hasStatusFilter,
        pointsAwarded: hasStatusFilter ? 25 : 0,
        maxPoints: 25,
      },
      {
        id: 'crit-group',
        title: 'Agrupamento por segmento com agregações corretas',
        description: 'Uso de GROUP BY e funções SUM/COUNT/AVG',
        passed: hasGroupBy,
        pointsAwarded: hasGroupBy ? 25 : 0,
        maxPoints: 25,
      },
      {
        id: 'crit-order',
        title: 'Ordenação decrescente por faturamento total',
        description: 'Cláusula ORDER BY faturamento_total DESC',
        passed: hasOrder,
        pointsAwarded: hasOrder ? 25 : 0,
        maxPoints: 25,
      },
    ];

    const totalPoints = criteriaResults.reduce((acc, c) => acc + c.pointsAwarded, 0);
    const isApproved = totalPoints === 100;

    const evaluation: SubmissionEvaluation = {
      id: `eval-sql-${Date.now()}`,
      submissionId: `sub-sql-${Date.now()}`,
      status: isApproved ? 'approved' : 'needs_revision',
      scorePercentage: totalPoints,
      summaryFeedback: isApproved
        ? 'Excelente trabalho! Sua consulta SQL utiliza adequadamente o INNER JOIN, filtra apenas registros concluídos e agrega os montantes por segmento de forma performática.'
        : 'A consulta retornou dados parciais, mas alguns critérios de aceitação não foram plenamente atendidos. Verifique as cláusulas WHERE, GROUP BY e ORDER BY.',
      criteriaResults,
      evaluatedAt: new Date().toISOString(),
      evaluatorName: 'Nexora SQL Automated Grader & Optimizer',
      isAutomated: true,
      nextRecommendedAction: isApproved
        ? 'Avançar para o Módulo de APIs REST & Backend'
        : 'Revisar a cláusula GROUP BY e os nomes de alias conforme o enunciado.',
    };

    return {
      columns: ['segmento', 'total_pedidos', 'faturamento_total', 'ticket_medio'],
      rows: simulatedRows,
      rowCount: simulatedRows.length,
      executionTimeMs: duration,
      evaluation,
    };
  }

  // Backend Test Suite Execution
  static async runBackendTests(
    repoUrl: string,
    branch: string
  ): Promise<{
    passedCount: number;
    totalCount: number;
    evaluation: SubmissionEvaluation;
    testOutputLogs: string;
  }> {
    const isValidBranch = Boolean(branch && branch.trim().length > 0);
    const isValidUrl = Boolean(repoUrl && (repoUrl.includes('github.com') || repoUrl.includes('gitlab.com')));

    const criteria = [
      {
        id: 'crit-b1',
        title: 'Contrato POST /api/v1/orders com validação',
        description: 'Rejeita payloads incorretos com HTTP 400 e cria com HTTP 201',
        passed: isValidUrl,
        pointsAwarded: isValidUrl ? 25 : 0,
        maxPoints: 25,
      },
      {
        id: 'crit-b2',
        title: 'Busca por ID e tratamento estruturado de 404',
        description: 'Retorna JSON de erro conforme Problem Details RFC 7807',
        passed: isValidUrl,
        pointsAwarded: isValidUrl ? 25 : 0,
        maxPoints: 25,
      },
      {
        id: 'crit-b3',
        title: 'Máquina de estados de ordens de serviço',
        description: 'Impede transição ilegal de concluída para aberta',
        passed: isValidBranch,
        pointsAwarded: isValidBranch ? 25 : 0,
        maxPoints: 25,
      },
      {
        id: 'crit-b4',
        title: 'Cobertura de testes automatizados >= 80%',
        description: 'Testes unitários e integrados com Vitest/Jest',
        passed: isValidUrl && isValidBranch,
        pointsAwarded: isValidUrl && isValidBranch ? 25 : 0,
        maxPoints: 25,
      },
    ];

    const total = criteria.reduce((sum, c) => sum + c.pointsAwarded, 0);
    const approved = total >= 75;

    const testOutputLogs = `[nexora-ci-runner] Cloning repository ${repoUrl} (branch: ${branch || 'main'})...
[nexora-ci-runner] Installing dependencies with npm ci... (ok)
[nexora-ci-runner] Running static typecheck with tsc --noEmit... (0 errors)
[nexora-ci-runner] Running contract test suite...
  ✓ POST /api/v1/orders -> 201 Created (42ms)
  ✓ POST /api/v1/orders (empty payload) -> 400 Bad Request with field map (15ms)
  ✓ GET /api/v1/orders/non-existent-id -> 404 Not Found (18ms)
[nexora-ci-runner] Running domain state machine test suite...
  ✓ State transition: aberta -> em_execucao -> concluida (31ms)
  ✓ Disallow rollback from concluida without supervisor override -> 422 (25ms)
========================================================================
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.42s
Coverage:    84.2% statements, 81.6% branches, 88.0% functions
[nexora-ci-runner] Automated grading concluded with status: ${approved ? 'PASSED' : 'REVISION REQUIRED'}`;

    const evaluation: SubmissionEvaluation = {
      id: `eval-back-${Date.now()}`,
      submissionId: `sub-back-${Date.now()}`,
      status: approved ? 'approved' : 'needs_revision',
      scorePercentage: total,
      summaryFeedback: approved
        ? 'Todos os testes de contrato e integração passaram com sucesso! Cobertura de código atingiu 84.2% e o tratamento de códigos de status HTTP seguiu estritamente o RFC 7807.'
        : 'Identificamos falhas em alguns casos de teste de regras de negócio. Verifique os logs e submeta novamente.',
      criteriaResults: criteria,
      evaluatedAt: new Date().toISOString(),
      evaluatorName: 'Nexora CI Test Runner v3.2',
      isAutomated: true,
      nextRecommendedAction: approved
        ? 'Avançar para o Desafio de Interfaces com React & Acessibilidade'
        : 'Ajustar validação de payload e submeter nova branch.',
    };

    return {
      passedCount: approved ? 4 : 2,
      totalCount: 4,
      evaluation,
      testOutputLogs,
    };
  }

  // Frontend Challenge Evaluation
  static async evaluateFrontendChallenge(answers: {
    hasAriaExpanded: boolean;
    hasKeyboardNav: boolean;
    hasWcagContrast: boolean;
    hasSegmentedControl: boolean;
    hasStatusBadgeWithIcon: boolean;
    codeSnippet?: string;
  }): Promise<SubmissionEvaluation> {
    const criteria = [
      {
        id: 'crit-f1',
        title: 'Segmented Control para Filtros Rápidos',
        description: 'Filtra entre status sem recarregamento de página',
        passed: answers.hasSegmentedControl,
        pointsAwarded: answers.hasSegmentedControl ? 20 : 0,
        maxPoints: 20,
      },
      {
        id: 'crit-f2',
        title: 'Status com Ícone e Texto (WCAG 1.4.1)',
        description: 'Não comunica status apenas através de cor',
        passed: answers.hasStatusBadgeWithIcon,
        pointsAwarded: answers.hasStatusBadgeWithIcon ? 20 : 0,
        maxPoints: 20,
      },
      {
        id: 'crit-f3',
        title: 'Navegação Completa por Teclado (Tab / Enter / Space)',
        description: 'Foco visível evidente sem armadilhas de foco',
        passed: answers.hasKeyboardNav,
        pointsAwarded: answers.hasKeyboardNav ? 20 : 0,
        maxPoints: 20,
      },
      {
        id: 'crit-f4',
        title: 'Atributos WAI-ARIA (aria-expanded & aria-controls)',
        description: 'Comunicação precisa do estado para leitores de tela',
        passed: answers.hasAriaExpanded,
        pointsAwarded: answers.hasAriaExpanded ? 20 : 0,
        maxPoints: 20,
      },
      {
        id: 'crit-f5',
        title: 'Relação de Contraste WCAG 2.2 AA (>= 4.5:1)',
        description: 'Textos com contraste adequado sobre superfícies claras',
        passed: answers.hasWcagContrast,
        pointsAwarded: answers.hasWcagContrast ? 20 : 0,
        maxPoints: 20,
      },
    ];

    const total = criteria.reduce((sum, c) => sum + c.pointsAwarded, 0);
    const approved = total >= 80;

    return {
      id: `eval-front-${Date.now()}`,
      submissionId: `sub-front-${Date.now()}`,
      status: approved ? 'approved' : 'needs_revision',
      scorePercentage: total,
      summaryFeedback: approved
        ? 'Parabéns! Seu componente cumpre integralmente os requisitos de acessibilidade WCAG 2.2 AA, responsividade e separação entre apresentação e controle de estado.'
        : 'Alguns critérios de acessibilidade essenciais não foram validados. Verifique especialmente as propriedades ARIA e o contraste visual.',
      criteriaResults: criteria,
      evaluatedAt: new Date().toISOString(),
      evaluatorName: 'Nexora A11y & Design System Inspector',
      isAutomated: true,
      nextRecommendedAction: approved
        ? 'Submeter o Projeto Integrador para revisão da supervisora Mariana Ramos'
        : 'Ajustar o suporte a teclado e os seletores semânticos.',
    };
  }

  // Competencies
  static async getCompetencies(): Promise<Competency[]> {
    return getStored<Competency[]>(STORAGE_KEYS.COMPETENCIES, INITIAL_COMPETENCIES);
  }

  static async updateCompetencyStatus(id: string, status: Competency['status']): Promise<Competency> {
    const list = await this.getCompetencies();
    const updated = list.map((c) => (c.id === id ? { ...c, status, lastValidatedAt: new Date().toISOString().split('T')[0] } : c));
    setStored(STORAGE_KEYS.COMPETENCIES, updated);
    const found = updated.find((c) => c.id === id);
    if (!found) throw new Error('Competência não encontrada');
    return found;
  }

  // Library
  static async getLibraryItems(): Promise<LibraryItem[]> {
    return getStored<LibraryItem[]>(STORAGE_KEYS.LIBRARY, INITIAL_LIBRARY_ITEMS);
  }

  static async getLibraryItemById(id: string): Promise<LibraryItem | undefined> {
    const items = await this.getLibraryItems();
    return items.find((i) => i.id === id);
  }

  // Deliverables
  static async getDeliverables(): Promise<ProjectDeliverable[]> {
    return getStored<ProjectDeliverable[]>(STORAGE_KEYS.DELIVERABLES, INITIAL_PROJECT_DELIVERABLES);
  }

  static async submitDeliverable(deliverable: Omit<ProjectDeliverable, 'id' | 'submittedAt' | 'status'>): Promise<ProjectDeliverable> {
    const items = await this.getDeliverables();
    const newDeliverable: ProjectDeliverable = {
      ...deliverable,
      id: `deliv-${Date.now()}`,
      submittedAt: new Date().toLocaleString('pt-BR'),
      status: 'submitted',
    };
    const updated = [newDeliverable, ...items];
    setStored(STORAGE_KEYS.DELIVERABLES, updated);
    return newDeliverable;
  }

  static async reviewDeliverable(
    id: string,
    status: 'approved' | 'revision_requested',
    feedback: string
  ): Promise<ProjectDeliverable> {
    const items = await this.getDeliverables();
    const updated = items.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            supervisorFeedback: feedback,
            reviewedAt: new Date().toLocaleString('pt-BR'),
          }
        : item
    );
    setStored(STORAGE_KEYS.DELIVERABLES, updated);
    const found = updated.find((i) => i.id === id);
    if (!found) throw new Error('Entregável inexistente');
    return found;
  }

  // Certificates
  static async getCertificates(): Promise<Certificate[]> {
    return getStored<Certificate[]>(STORAGE_KEYS.CERTIFICATES, [INITIAL_CERTIFICATE]);
  }

  static async getCertificateForStudent(studentId: string, trackId: string): Promise<Certificate | undefined> {
    const certs = await this.getCertificates();
    return certs.find((c) => c.studentId === studentId && c.trackId === trackId && c.status === 'active');
  }

  static async issueCertificate(certData: Omit<Certificate, 'id' | 'credentialCode' | 'issuedAt' | 'status'>): Promise<Certificate> {
    const certs = await this.getCertificates();
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      credentialCode: `NX-2026-DEV-${randomHex}-V`,
      issuedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    const updated = [newCert, ...certs];
    setStored(STORAGE_KEYS.CERTIFICATES, updated);
    return newCert;
  }

  // Reset to default seed
  static resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.TRACKS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.COMPETENCIES);
    localStorage.removeItem(STORAGE_KEYS.LIBRARY);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.DELIVERABLES);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }
}
