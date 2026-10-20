/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiService } from '../src/services/api';
import {
  INITIAL_TRACKS,
  INITIAL_USERS,
  SQL_CHALLENGE_DATA,
  BACKEND_CHALLENGE_DATA,
  FRONTEND_CHALLENGE_DATA,
} from '../src/services/data/seedData';

// Polyfill minimal localStorage for NodeJS test execution if not present
if (typeof localStorage === 'undefined') {
  const store: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  };
}

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ [PASSED] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ [FAILED] ${testName}${details ? ` -> ${details}` : ''}`);
    failedTests++;
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('  NEXORA PLATFORM — TEST SUITE DE INTEGRAÇÃO E PONTOS CRÍTICOS');
  console.log('================================================================\n');

  // Fluxo 1: Autenticação e entrada na área do aluno
  console.log('▶ Teste 1: Autenticação do Usuário e Obtenção do Perfil de Aluno');
  const currentUser = await ApiService.getCurrentUser();
  assert(currentUser.role === 'student', 'Usuário padrão possui papel de estudante (Pedro Sousa)');
  assert(currentUser.organizationName === 'Nexora Tech Lab', 'Organização vinculada corretamente');

  // Fluxo 2: Abertura e estrutura da trilha de estagiários
  console.log('\n▶ Teste 2: Catálogo e Detalhes da Trilha de Estagiários');
  const tracks = await ApiService.getTracks();
  assert(tracks.length >= 3, 'Catálogo possui as 3 trilhas estruturadas');
  const devTrack = await ApiService.getTrackById('track-interns-dev');
  assert(Boolean(devTrack), 'Trilha de formação para estagiários encontrada');
  assert(devTrack!.modules.length === 5, 'Trilha possui os 5 módulos curriculares');

  // Fluxo 3: Estudo de conteúdo
  console.log('\n▶ Teste 3: Experiência de Leitura e Conteúdo');
  const readingStage = devTrack!.modules[0].stages[0];
  assert(Boolean(readingStage.contentMarkdown), 'Conteúdo markdown de leitura presente e formatado');
  assert(readingStage.durationMinutes > 0, 'Tempo estimado de leitura configurado');

  // Fluxo 4: Resposta a quiz e validação
  console.log('\n▶ Teste 4: Verificação de Aprendizagem (Quiz)');
  const quizStage = devTrack!.modules[0].stages[1];
  assert(Boolean(quizStage.quizQuestions?.length), 'Questões de quiz vinculadas à etapa');
  assert(quizStage.quizQuestions![0].correctOptionId === 'opt1', 'Gabarito e explicação definidos');

  // Fluxo 5: Desafio de Banco de Dados / SQL
  console.log('\n▶ Teste 5: Laboratório SQL — Executor e Validador de Critérios');
  const sqlChallenge = await ApiService.getSqlChallenge('chal-sql-01');
  assert(sqlChallenge.schemas.length === 2, 'Esquemas de clientes e pedidos disponíveis');

  const validQuery = `
    SELECT c.segmento, COUNT(p.id) AS total_pedidos, ROUND(SUM(p.valor_total), 2) AS faturamento_total, ROUND(AVG(p.valor_total), 2) AS ticket_medio
    FROM clientes c
    INNER JOIN pedidos p ON c.id = p.cliente_id
    WHERE p.status = 'concluido'
    GROUP BY c.segmento
    ORDER BY faturamento_total DESC;
  `;
  const sqlResult = await ApiService.executeSqlQuery(validQuery);
  assert(sqlResult.rowCount === 3, 'Consulta retornou 3 segmentos agregados');
  assert(sqlResult.evaluation?.status === 'approved', 'Avaliação automatizada aprovou com 100/100');

  // Teste de query com erro de sintaxe
  const invalidQuery = 'UPDATE pedidos SET status = "cancelado"';
  const invalidResult = await ApiService.executeSqlQuery(invalidQuery);
  assert(Boolean(invalidResult.error), 'Motor rejeitou consulta que não seja SELECT analítico');

  // Fluxo 6: Desafio de Backend e Runner de CI
  console.log('\n▶ Teste 6: Laboratório de Backend — Runner Automatizado de Testes');
  const backendChallenge = await ApiService.getBackendChallenge('chal-back-01');
  assert(backendChallenge.endpoints.length === 2, 'Contratos OpenAPI definidos');

  const backendRun = await ApiService.runBackendTests(
    'https://github.com/pedro-sousa/service-orders-api',
    'feat/rest-contract-v1'
  );
  assert(backendRun.passedCount === 4, 'Todos os 4 critérios de teste passaram no CI');
  assert(backendRun.evaluation.status === 'approved', 'Status de submissão do backend aprovado');

  // Fluxo 7: Desafio de Frontend & Acessibilidade WCAG 2.2 AA
  console.log('\n▶ Teste 7: Laboratório de Frontend — Conformidade de Acessibilidade');
  const frontendEval = await ApiService.evaluateFrontendChallenge({
    hasAriaExpanded: true,
    hasKeyboardNav: true,
    hasWcagContrast: true,
    hasSegmentedControl: true,
    hasStatusBadgeWithIcon: true,
  });
  assert(frontendEval.scorePercentage === 100, 'Componente obteve 100% de conformidade com WCAG');
  assert(frontendEval.status === 'approved', 'Avaliação de acessibilidade aprovada');

  // Fluxo 8: Matriz de Competências
  console.log('\n▶ Teste 8: Matriz de Competências e Evidências');
  const competencies = await ApiService.getCompetencies();
  assert(competencies.length === 5, '5 competências essenciais mapeadas');
  const validatedComp = competencies.find((c) => c.status === 'validated');
  assert(Boolean(validatedComp?.validatedBy), 'Competência validada possui registro do mentor');

  // Fluxo 9: Projeto Integrador e Revisão do Supervisor
  console.log('\n▶ Teste 9: Projeto Integrador e Ciclo de Parecer da Supervisora');
  const newDeliv = await ApiService.submitDeliverable({
    projectId: 'stage-project',
    studentId: 'user-pedro',
    stageName: 'Etapa 3: Interface Web Acessível',
    title: 'Componente de Ordens com WAI-ARIA',
    repositoryUrl: 'https://github.com/pedro-sousa/service-orders-frontend',
    technicalNotes: 'Foco navegável por teclado e segmented control sem re-render desnecessário.',
  });
  assert(newDeliv.status === 'submitted', 'Entregável registrado com status submetido');

  const reviewed = await ApiService.reviewDeliverable(
    newDeliv.id,
    'approved',
    'Excelente trabalho com acessibilidade e semântica!'
  );
  assert(reviewed.status === 'approved', 'Parecer da supervisora registrado como aprovado');
  assert(Boolean(reviewed.reviewedAt), 'Timestamp de revisão gravado');

  // Fluxo 10: Emissão e Validação de Certificado
  console.log('\n▶ Teste 10: Emissão e Certificação Digital');
  const cert = await ApiService.issueCertificate({
    studentId: 'user-pedro',
    studentName: 'Pedro Sousa',
    trackId: 'track-interns-dev',
    trackTitle: 'Trilha de Formação para Estagiários Dev',
    workloadHours: 40,
    issuedByOrganization: 'Nexora Tech Lab',
    supervisorSignature: 'Mariana Ramos — Tech Lead',
    competenciesSummary: ['SQL Avançado', 'APIs REST', 'React & WCAG AA'],
  });
  assert(Boolean(cert.credentialCode.startsWith('NX-2026-DEV-')), 'Código de credencial gerado');
  assert(cert.status === 'active', 'Certificado ativo no sistema');

  // Fluxo 11: Alternância de Papéis (Supervisor e Admin)
  console.log('\n▶ Teste 11: Troca de Persona e Acesso a Papéis');
  const supervisorUser = await ApiService.switchUser('user-mariana');
  assert(supervisorUser.role === 'supervisor', 'Sessão alternada para Supervisora Mariana');

  const adminUser = await ApiService.switchUser('user-carlos');
  assert(adminUser.role === 'admin', 'Sessão alternada para Administrador Carlos');

  // Retornar ao Pedro
  await ApiService.switchUser('user-pedro');

  console.log('\n================================================================');
  console.log(`  RESULTADO DOS TESTES: ${passedTests} APROVADOS, ${failedTests} FALHAS`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
