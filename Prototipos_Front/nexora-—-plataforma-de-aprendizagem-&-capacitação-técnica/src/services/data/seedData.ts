/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Track,
  SqlChallenge,
  BackendChallenge,
  FrontendChallenge,
  Competency,
  LibraryItem,
  User,
  ProjectDeliverable,
  Certificate,
} from '../../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-pedro',
    name: 'Pedro Sousa',
    email: 'pedro18msousa@gmail.com',
    role: 'student',
    organizationId: 'org-nexora',
    organizationName: 'Nexora Tech Lab',
    title: 'Estagiário de Engenharia de Software',
    joinedAt: '2026-09-01',
    supervisorId: 'user-mariana',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  },
  {
    id: 'user-mariana',
    name: 'Mariana Ramos',
    email: 'mariana.ramos@nexora.internal',
    role: 'supervisor',
    organizationId: 'org-nexora',
    organizationName: 'Nexora Tech Lab',
    title: 'Supervisora de Engenharia & Tech Lead',
    joinedAt: '2024-03-15',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
  },
  {
    id: 'user-carlos',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@nexora.internal',
    role: 'admin',
    organizationId: 'org-nexora',
    organizationName: 'Nexora Tech Lab',
    title: 'Head de Capacitação & Operações Técnicas',
    joinedAt: '2023-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  },
];

export const INITIAL_COMPETENCIES: Competency[] = [
  {
    id: 'comp-sql',
    name: 'Modelagem Relacional & Consultas SQL Avançadas',
    description: 'Capacidade de estruturar esquemas normalizados, executar joins, agregações e otimizar índices em bancos de dados relacionais.',
    domain: 'database',
    status: 'validated',
    lastValidatedAt: '2026-10-12',
    validatedBy: 'Mariana Ramos',
    evidenceCount: 3,
    relatedTrackId: 'track-interns-dev',
  },
  {
    id: 'comp-backend',
    name: 'Construção de APIs REST com Node.js e TypeScript',
    description: 'Desenvolvimento de endpoints idempotentes, validação de payloads, tratamento de erros HTTP e arquitetura em camadas.',
    domain: 'backend',
    status: 'in_progress',
    evidenceCount: 2,
    relatedTrackId: 'track-interns-dev',
  },
  {
    id: 'comp-frontend',
    name: 'Desenvolvimento de Interfaces Modernas com React e Tailwind',
    description: 'Criação de componentes reutilizáveis, gerenciamento de estado previsível, responsividade e separação clara entre lógica e apresentação.',
    domain: 'frontend',
    status: 'in_progress',
    evidenceCount: 1,
    relatedTrackId: 'track-interns-dev',
  },
  {
    id: 'comp-a11y',
    name: 'Acessibilidade Digital & Conformidade WCAG 2.2 AA',
    description: 'Implementação de semântica HTML adequada, suporte a teclado, contraste legível e atributos WAI-ARIA.',
    domain: 'frontend',
    status: 'in_progress',
    evidenceCount: 1,
    relatedTrackId: 'track-interns-dev',
  },
  {
    id: 'comp-git',
    name: 'Fluxo Colaborativo com Git e Revisão de Código',
    description: 'Boas práticas de branches, commits atômicos descritivos, resolução de conflitos e abertura de pull requests consistentes.',
    domain: 'engineering',
    status: 'validated',
    lastValidatedAt: '2026-09-20',
    validatedBy: 'Mariana Ramos',
    evidenceCount: 4,
    relatedTrackId: 'track-interns-dev',
  },
];

export const SQL_SAMPLE_SCHEMAS = [
  {
    tableName: 'clientes',
    description: 'Cadastro de clientes corporativos e seus segmentos de mercado',
    columns: [
      { name: 'id', type: 'INTEGER', description: 'Chave primária do cliente', isPrimary: true },
      { name: 'nome', type: 'VARCHAR(120)', description: 'Razão social ou nome fantasia' },
      { name: 'segmento', type: 'VARCHAR(50)', description: 'Varejo, Saúde, Finanças, Indústria' },
      { name: 'cidade', type: 'VARCHAR(60)', description: 'Cidade sede da empresa' },
      { name: 'estado', type: 'CHAR(2)', description: 'Sigla da unidade federativa' },
      { name: 'data_cadastro', type: 'DATE', description: 'Data de adesão ao sistema' },
    ],
    sampleRows: [
      { id: 1, nome: 'TechVibe Soluções', segmento: 'Tecnologia', cidade: 'São Paulo', estado: 'SP', data_cadastro: '2025-01-15' },
      { id: 2, nome: 'BioSaúde Integrada', segmento: 'Saúde', cidade: 'Belo Horizonte', estado: 'MG', data_cadastro: '2025-02-10' },
      { id: 3, nome: 'VarejoGlobal Distribuidora', segmento: 'Varejo', cidade: 'Curitiba', estado: 'PR', data_cadastro: '2025-03-01' },
      { id: 4, nome: 'FinSeguros Capital', segmento: 'Finanças', cidade: 'Rio de Janeiro', estado: 'RJ', data_cadastro: '2025-04-12' },
      { id: 5, nome: 'AgroSul Cooperativa', segmento: 'Indústria', cidade: 'Porto Alegre', estado: 'RS', data_cadastro: '2025-05-20' },
    ],
  },
  {
    tableName: 'pedidos',
    description: 'Registro de pedidos de serviços e assinaturas efetuados pelos clientes',
    columns: [
      { name: 'id', type: 'INTEGER', description: 'Identificador único do pedido', isPrimary: true },
      { name: 'cliente_id', type: 'INTEGER', description: 'Referência ao cliente comprador', isForeign: true },
      { name: 'data_pedido', type: 'TIMESTAMP', description: 'Data e hora da emissão' },
      { name: 'status', type: 'VARCHAR(30)', description: 'concluido, pendente, cancelado' },
      { name: 'valor_total', type: 'DECIMAL(10,2)', description: 'Valor total consolidado em reais' },
    ],
    sampleRows: [
      { id: 101, cliente_id: 1, data_pedido: '2026-09-02 14:30:00', status: 'concluido', valor_total: 14500.00 },
      { id: 102, cliente_id: 2, data_pedido: '2026-09-05 09:15:00', status: 'concluido', valor_total: 8200.50 },
      { id: 103, cliente_id: 1, data_pedido: '2026-09-18 16:45:00', status: 'concluido', valor_total: 21900.00 },
      { id: 104, cliente_id: 3, data_pedido: '2026-09-22 11:20:00', status: 'pendente', valor_total: 4300.00 },
      { id: 105, cliente_id: 4, data_pedido: '2026-10-01 10:00:00', status: 'concluido', valor_total: 35000.00 },
      { id: 106, cliente_id: 2, data_pedido: '2026-10-08 17:10:00', status: 'concluido', valor_total: 12400.00 },
    ],
  },
];

export const SQL_CHALLENGE_DATA: SqlChallenge = {
  id: 'chal-sql-01',
  trackId: 'track-interns-dev',
  stageId: 'stage-sql-lab',
  type: 'sql',
  title: 'Análise de Faturamento Consolidado por Segmento de Cliente',
  domain: 'Banco de Dados Relacional',
  difficulty: 'Médio',
  estimatedMinutes: 45,
  summary: 'Construa uma consulta SQL analítica que calcule o faturamento total e ticket médio de pedidos concluídos agrupados por segmento de clientes.',
  problemStatement: `A diretoria de operações precisa identificar quais segmentos de clientes geraram maior receita com pedidos com status 'concluido'.
Sua missão é escrever uma consulta que relacione a tabela de clientes com a tabela de pedidos, filtrando apenas os pedidos efetivados, agregando o montante faturado e a quantidade de pedidos por segmento.`,
  functionalRequirements: [
    'A consulta deve retornar as colunas: segmento, total_pedidos, faturamento_total e ticket_medio.',
    "Apenas pedidos com status = 'concluido' devem ser considerados no cálculo.",
    'O faturamento_total deve ser a soma exata dos valores dos pedidos (arredondado em 2 casas decimais).',
    'O ticket_medio deve ser o quociente entre o faturamento_total e o total_pedidos.',
    'Os registros devem vir ordenados de forma decrescente pelo faturamento_total.',
  ],
  restrictions: [
    'Não use subconsultas correlacionadas desnecessárias que degradem o plano de execução.',
    'Utilize INNER JOIN explícito com cláusula ON adequada entre clientes e pedidos.',
  ],
  acceptanceCriteria: [
    'Retorna 4 colunas com os nomes exatos solicitados.',
    'Exclui pedidos com status diferente de "concluido".',
    'Segmento "Finanças" deve liderar com faturamento_total de R$ 35.000,00.',
    'Segmento "Tecnologia" deve conter 2 pedidos com faturamento total de R$ 36.400,00.',
  ],
  hints: [
    'Lembre-se de utilizar GROUP BY c.segmento para permitir a agregação de SUM e COUNT.',
    'Para calcular o ticket médio, você pode usar ROUND(AVG(p.valor_total), 2) ou dividir o total de vendas pelo contador.',
  ],
  schemas: SQL_SAMPLE_SCHEMAS,
  initialQuery: `-- Escreva aqui sua consulta SQL
SELECT
  c.segmento,
  COUNT(p.id) AS total_pedidos,
  ROUND(SUM(p.valor_total), 2) AS faturamento_total,
  ROUND(AVG(p.valor_total), 2) AS ticket_medio
FROM clientes c
INNER JOIN pedidos p ON c.id = p.cliente_id
WHERE p.status = 'concluido'
GROUP BY c.segmento
ORDER BY faturamento_total DESC;`,
  solutionQuery: `SELECT
  c.segmento,
  COUNT(p.id) AS total_pedidos,
  ROUND(SUM(p.valor_total), 2) AS faturamento_total,
  ROUND(AVG(p.valor_total), 2) AS ticket_medio
FROM clientes c
INNER JOIN pedidos p ON c.id = p.cliente_id
WHERE p.status = 'concluido'
GROUP BY c.segmento
ORDER BY faturamento_total DESC;`,
  expectedColumns: ['segmento', 'total_pedidos', 'faturamento_total', 'ticket_medio'],
  expectedRowCount: 3,
  explanation: 'Agrupamento correto com filtro WHERE antes do GROUP BY para performance de índice.',
};

export const BACKEND_CHALLENGE_DATA: BackendChallenge = {
  id: 'chal-back-01',
  trackId: 'track-interns-dev',
  stageId: 'stage-back-lab',
  type: 'backend',
  title: 'API de Gestão de Ordens de Serviço (RESTful & Idempotência)',
  domain: 'Arquitetura Backend & APIs REST',
  difficulty: 'Médio',
  estimatedMinutes: 60,
  summary: 'Desenvolva e submeta os endpoints de criação e consulta de ordens de serviço respeitando validação de contrato e tratamento rigoroso de erros HTTP.',
  problemStatement: `No time de plataformas internas, as equipes de campo precisam registrar e consultar ordens de serviço com status, prioridade e checklist.
Você deve implementar a API REST em Node.js com TypeScript, cobrindo validações de entrada (ex: descrição com no mínimo 10 caracteres, prioridade válida: 'baixa', 'media', 'alta') e idempotência na criação.`,
  functionalRequirements: [
    'POST /api/v1/orders — Criação com validação de payload (campos obrigatórios: client_id, title, priority, description). Retorna HTTP 201 com o recurso criado.',
    'GET /api/v1/orders — Listagem paginada com suporte a filtros por status e prioridade.',
    'GET /api/v1/orders/:id — Retorna HTTP 200 com a ordem ou HTTP 404 estruturado caso o ID não exista.',
    'PATCH /api/v1/orders/:id/status — Transição de estado validada (aberta -> em_execucao -> concluida). Não permite reabrir ordem concluída sem justificativa.',
  ],
  restrictions: [
    'Payloads com erros devem retornar código HTTP 400 com lista detalhada de violações no formato { error: string, fields: Record<string, string> }.',
    'Todas as rotas devem usar headers de resposta "Content-Type: application/json".',
  ],
  acceptanceCriteria: [
    'Suite de testes unitários com cobertura >= 80% nas camadas de regras de negócio.',
    'Todos os 6 testes de contrato e integração executados pelo runner automatizado com status APROVADO.',
    'Sem vazamento de stack trace em respostas de erro (500).',
  ],
  hints: [
    'Use bibliotecas como Zod ou Joi para schema validation sem poluir o controlador.',
    'Separe as camadas em Controller, Service e Repository para desacoplar as regras de persistência.',
  ],
  apiSpecTitle: 'WorkOrder Management API v1.2',
  endpoints: [
    {
      method: 'POST',
      path: '/api/v1/orders',
      description: 'Registra uma nova ordem de serviço',
      requestBodySchema: `{
  "clientId": "string (UUID)",
  "title": "string (min 5, max 100)",
  "priority": "enum ('baixa' | 'media' | 'alta')",
  "description": "string (min 10)",
  "estimatedHours": "number (positivo)"
}`,
      responseBodyExample: `{
  "id": "ord-8921-992a",
  "clientId": "cli-101",
  "title": "Correção de vazamento no servidor de rede",
  "priority": "alta",
  "status": "aberta",
  "createdAt": "2026-10-19T14:00:00Z"
}`,
      expectedStatusCode: 201,
    },
    {
      method: 'GET',
      path: '/api/v1/orders/:id',
      description: 'Obtém detalhes de uma ordem existente por ID',
      responseBodyExample: `{
  "id": "ord-8921-992a",
  "status": "aberta",
  "priority": "alta",
  "title": "Correção de vazamento no servidor de rede"
}`,
      expectedStatusCode: 200,
    },
  ],
  testSuites: [
    {
      suiteName: 'Testes de Contrato & Validação de Payload',
      cases: [
        {
          id: 'tc-01',
          title: 'Validação de campos obrigatórios ausentes no POST /api/v1/orders',
          type: 'contract',
          description: 'Envia JSON vazio e espera status HTTP 400 com mapa de campos violados.',
          passed: true,
          durationMs: 42,
        },
        {
          id: 'tc-02',
          title: 'Retorno 404 para ID inexistente no GET /api/v1/orders/:id',
          type: 'contract',
          description: 'Busca por ID uuid aleatório e verifica mensagem clara e código 404.',
          passed: true,
          durationMs: 18,
        },
      ],
    },
    {
      suiteName: 'Testes de Regras de Negócio e Máquina de Estados',
      cases: [
        {
          id: 'tc-03',
          title: 'Transição permitida: aberta para em_execucao',
          type: 'business_rule',
          description: 'Verifica mudança de estado e registro do timestamp de início de atendimento.',
          passed: true,
          durationMs: 31,
        },
        {
          id: 'tc-04',
          title: 'Bloqueio de transição inválida: concluida para aberta sem justificativa',
          type: 'edge_case',
          description: 'Garante que o backend rejeite com HTTP 422 Unprocessable Entity.',
          passed: true,
          durationMs: 25,
        },
      ],
    },
  ],
  starterCodeRepoUrl: 'https://github.com/nexora-learning/intern-backend-challenge-template',
};

export const FRONTEND_CHALLENGE_DATA: FrontendChallenge = {
  id: 'chal-front-01',
  trackId: 'track-interns-dev',
  stageId: 'stage-front-lab',
  type: 'frontend',
  title: 'Card de Status de Ordens Acessível & Responsivo com Filtros',
  domain: 'Frontend Moderno & Acessibilidade',
  difficulty: 'Médio',
  estimatedMinutes: 50,
  summary: 'Implemente um componente de listagem de ordens de serviço com filtros interativos, foco navegável por teclado e conformidade com WCAG 2.2 AA.',
  problemStatement: `O aplicativo do técnico de campo é utilizado em tablets e desktops. Os operadores precisam filtrar as ordens por prioridade sem recarregar a página, identificar claramente os status sem depender unicamente de cor, e interagir via teclado (Tab, Enter, Espaço).
Sua missão é desenvolver o componente com Tailwind e React, atendendo a todos os requisitos de contraste e semântica WAI-ARIA.`,
  functionalRequirements: [
    'Segmented control para alternar entre: "Todas", "Alta Prioridade", "Em Execução", "Concluídas".',
    'Badge de status unindo texto legível e ícone indicativo (nunca apenas cor circular).',
    'Ação de clique para expandir detalhes da ordem com animação suave de transição.',
    'Acessibilidade com foco visível no teclado (:focus-visible ring).',
  ],
  restrictions: [
    'Não use tags <div> para botões ou elementos acionáveis; use elementos semânticos <button>.',
    'Evite contraste inferior a 4.5:1 para textos regulares.',
  ],
  acceptanceCriteria: [
    'Navegação completa por teclado sem armadilhas de foco (focus traps).',
    'Leitores de tela anunciam corretamente os estados expandido/recolhido (aria-expanded).',
    'Layout fluido adaptável a telas de 375px até 1440px sem rolagem horizontal.',
  ],
  hints: [
    'Use aria-expanded={isExpanded} e aria-controls={detailsId} no botão acionador.',
    'Garanta que elementos com foco tenham outline ou ring de alto contraste.',
  ],
  visualRequirements: [
    'Tipografia hierárquica clara com título em destaque e metadados discretos.',
    'Botões com área de toque mínima de 44x44px em dispositivos móveis.',
    'Indicador de prioridade visual com ícone de alerta e texto explicativo.',
  ],
  responsiveBreakpoints: ['Mobile (375px - 640px)', 'Tablet (641px - 1024px)', 'Desktop (>1024px)'],
  a11yCriteria: [
    'Contraste de texto WCAG AA comprovado (mínimo 4.5:1).',
    'Todos os botões possuem rótulo perceptível (aria-label ou texto interno).',
    'Navegável via Tab e ativável via Enter/Espaço.',
  ],
  starterTemplate: 'export function OrderCard({ order, onSelect }: Props) { ... }',
};

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-interns-dev',
    title: 'Trilha de Formação para Estagiários: Engenharia de Software',
    shortDescription: 'Programa completo e prático de nivelamento para desenvolvedores iniciantes, abrangendo Git, Modelagem SQL, APIs REST e React.',
    fullDescription: `Esta trilha é a jornada central de capacitação profissional para estagiários de tecnologia na Nexora.
Desenvolvida por engenheiros seniores e líderes de produto, a trilha prepara você para entregar código de padrão de produção através de leitura guiada, exercícios de fixação, três laboratórios técnicos reais (SQL, Backend e Frontend) e um projeto integrador avaliado pelo seu supervisor.`,
    area: 'Engenharia de Software',
    level: 'Iniciante',
    estimatedHours: 40,
    publishingStatus: 'published',
    enrolledStudentsCount: 28,
    version: '2.4.0',
    lastUpdatedAt: '2026-10-15',
    certificationAvailable: true,
    prerequisites: [
      'Conceitos fundamentais de lógica de programação e algoritmos.',
      'Familiaridade básica com o terminal de linha de comando.',
      'Vontade de aprender e praticar com padrões profissionais.',
    ],
    learningObjectives: [
      'Dominar o ciclo de vida do desenvolvimento de software em equipe utilizando Git e GitHub.',
      'Projetar esquemas de banco de dados relacionais e escrever queries SQL otimizadas com JOINs e agregações.',
      'Desenvolver APIs RESTful idempotentes em Node.js com TypeScript, cobrindo validações e tratamento de erros.',
      'Construir componentes de interface modernos, reutilizáveis e acessíveis (WCAG 2.2 AA) com React.',
      'Defender tecnicamente suas decisões perante a supervisão e entregar projetos integrados de ponta a ponta.',
    ],
    competenciesWorked: [
      'Modelagem Relacional & Consultas SQL Avançadas',
      'Construção de APIs REST com Node.js e TypeScript',
      'Desenvolvimento de Interfaces Modernas com React e Tailwind',
      'Acessibilidade Digital & Conformidade WCAG 2.2 AA',
      'Fluxo Colaborativo com Git e Revisão de Código',
    ],
    finalProjectDescription: 'Desenvolvimento completo do Sistema de Gestão de Ordens de Serviço, integrando banco de dados, API REST e interface web responsiva.',
    modules: [
      {
        id: 'mod-01',
        trackId: 'track-interns-dev',
        title: 'Módulo 1: Fundamentos de Engenharia & Versionamento com Git',
        description: 'Padrões de trabalho em equipe, ciclo de vida de software, branches semânticas e boas práticas de pull request.',
        order: 1,
        stages: [
          {
            id: 'stage-git-reading',
            moduleId: 'mod-01',
            trackId: 'track-interns-dev',
            title: 'Ciclo de Vida do Software & Convenções de Código',
            description: 'Como um time de tecnologia organiza suas tarefas, code reviews, ambientes de homologação e produção.',
            type: 'reading',
            durationMinutes: 20,
            order: 1,
            isCompleted: true,
            isRequired: true,
            competencyIds: ['comp-git'],
            contentMarkdown: `# Ciclo de Vida do Software & Convenções de Código

Bem-vindo ao início da sua jornada na Nexora. A diferença entre um projeto de hobby e um sistema corporativo profissional reside na **disciplina de engenharia, previsibilidade e colaboração**.

---

## 1. O Pipeline de Entrega Contínua

Todo código escrito passa por estágios bem definidos antes de atingir o ambiente de produção:

1. **Desenvolvimento Local**: Escrita do código com testes unitários locais e verificação de tipagem estrita com TypeScript.
2. **Pull Request (PR)**: Submissão de uma branch com título explicativo no formato de *Conventional Commits*.
3. **CI (Continuous Integration)**: Execução automática de linters, testes de regressão e build de pacotes.
4. **Code Review**: Avaliação por ao menos um engenheiro sênior ou par, revisando legibilidade, segurança e performance.
5. **Merge e Deploy em Staging**: Homologação com dados sanitizados.
6. **Produção**: Entrega para os usuários com monitoramento de métricas e rastreamento de erros.

---

## 2. Boas Práticas de Commits

Evite commits genéricos como \`"ajustes"\` ou \`"wip"\`. Adote a especificação:

- \`feat: adiciona filtro por prioridade na listagem de pedidos\`
- \`fix: corrige cálculo de arredondamento no total do faturamento\`
- \`docs: atualiza documentação do contrato de endpoints REST\`
- \`refactor: separa lógica de cálculo de impostos em serviço dedicado\`

> **Dica Importante**: Commits atômicos facilitam auditorias e rollbacks rápidos caso um incidente ocorra em produção.`,
          },
          {
            id: 'stage-git-quiz',
            moduleId: 'mod-01',
            trackId: 'track-interns-dev',
            title: 'Quiz de Validação: Git Flow e Convenções',
            description: 'Validação rápida de conhecimentos sobre branches, merge e boas práticas.',
            type: 'quiz',
            durationMinutes: 15,
            order: 2,
            isCompleted: true,
            isRequired: true,
            competencyIds: ['comp-git'],
            quizQuestions: [
              {
                id: 'q1',
                question: 'Qual é o formato recomendado para nomear uma branch de correção de bug?',
                explanation: 'O prefixo fix/ deixa a finalidade da branch clara para todo o time e ferramentas de CI.',
                options: [
                  { id: 'opt1', text: 'fix/issue-142-calculo-total' },
                  { id: 'opt2', text: 'minha-branch-corrigida' },
                  { id: 'opt3', text: 'patch_final_v2' },
                ],
                correctOptionId: 'opt1',
              },
              {
                id: 'q2',
                question: 'Por que devemos evitar fazer commits diretamente na branch principal (main)?',
                explanation: 'A branch main representa o código estável que vai para produção; alterações devem ser revisadas e validadas por CI.',
                options: [
                  { id: 'opt1', text: 'Para garantir que o código passe por testes e code review antes de ir a produção' },
                  { id: 'opt2', text: 'Porque o Git não permite commits na branch main' },
                  { id: 'opt3', text: 'Apenas para economizar espaço no repositório' },
                ],
                correctOptionId: 'opt1',
              },
            ],
          },
        ],
      },
      {
        id: 'mod-02',
        trackId: 'track-interns-dev',
        title: 'Módulo 2: Banco de Dados Relacional & SQL',
        description: 'Modelagem relacional, chaves, relacionamentos 1:N e N:N, consultas analíticas com JOIN e GROUP BY.',
        order: 2,
        stages: [
          {
            id: 'stage-sql-reading',
            moduleId: 'mod-02',
            trackId: 'track-interns-dev',
            title: 'Modelagem Entidade-Relacionamento e Normalização',
            description: 'Como transformar requisitos de negócio em esquemas relacionais consistentes até a 3ª Forma Normal.',
            type: 'reading',
            durationMinutes: 25,
            order: 1,
            isCompleted: true,
            isRequired: true,
            competencyIds: ['comp-sql'],
            contentMarkdown: `# Modelagem Entidade-Relacionamento e Normalização

Bancos de dados relacionais são o coração da persistência de dados transacionais na maioria das aplicações corporativas.

---

## 1. As Três Formas Normais (3FN)

Para evitar anomalias de inserção, exclusão e atualização:

1. **1ª Forma Normal (1FN)**: Todos os atributos devem ser atômicos (sem listas ou campos multivalorados em uma mesma coluna) e cada tabela deve possuir chave primária única.
2. **2ª Forma Normal (2FN)**: Estar na 1FN e nenhum atributo não-chave depender de parte de uma chave primária composta.
3. **3ª Forma Normal (3FN)**: Estar na 2FN e nenhum atributo não-chave depender transitivamente de outro atributo não-chave.

---

## 2. Relacionamentos Comuns

- **1 para N (1:N)**: Um cliente pode ter múltiplos pedidos. A chave estrangeira (\`cliente_id\`) fica na tabela dependente (\`pedidos\`).
- **N para N (N:N)**: Um pedido possui múltiplos produtos e um produto pode estar em múltiplos pedidos. Exige tabela intermediária associativa (\`itens_pedido\`).

\`\`\`sql
-- Exemplo de relacionamento 1:N
CREATE TABLE pedidos (
  id INT PRIMARY KEY,
  cliente_id INT NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
\`\`\``,
          },
          {
            id: 'stage-sql-lab',
            moduleId: 'mod-02',
            trackId: 'track-interns-dev',
            title: 'Laboratório Prático: Desafio de Consulta SQL e Faturamento',
            description: 'Execução interativa no laboratório SQL com tabelas reais e validação automatizada de critérios.',
            type: 'sql_challenge',
            durationMinutes: 45,
            order: 2,
            isCompleted: true,
            isRequired: true,
            challengeId: 'chal-sql-01',
            competencyIds: ['comp-sql'],
          },
        ],
      },
      {
        id: 'mod-03',
        trackId: 'track-interns-dev',
        title: 'Módulo 3: APIs RESTful & Back-end com Node.js',
        description: 'Construção de serviços web escaláveis, tratamento semântico de status HTTP, validação com schemas e idempotência.',
        order: 3,
        stages: [
          {
            id: 'stage-back-reading',
            moduleId: 'mod-03',
            trackId: 'track-interns-dev',
            title: 'Design de Contratos REST e Idempotência',
            description: 'Semântica de métodos HTTP (GET, POST, PUT, PATCH, DELETE) e códigos de status padronizados.',
            type: 'reading',
            durationMinutes: 30,
            order: 1,
            isCompleted: true,
            isRequired: true,
            competencyIds: ['comp-backend'],
            contentMarkdown: `# Design de Contratos REST e Idempotência

Uma API limpa respeita o protocolo HTTP e trata os recursos como substantivos orientados a domínio.

---

## 1. Semântica dos Verbos HTTP

- \`GET /api/v1/orders\`: Consulta segura e idempotente. Não altera estado do servidor.
- \`POST /api/v1/orders\`: Criação de novo recurso subordinado. **Não idempotente**.
- \`PUT /api/v1/orders/:id\`: Substituição completa do recurso existente. **Idempotente**.
- \`PATCH /api/v1/orders/:id\`: Modificação parcial (ex: atualizar apenas status).
- \`DELETE /api/v1/orders/:id\`: Exclusão de recurso. **Idempotente**.

---

## 2. Respostas e Códigos de Status

- \`200 OK\`: Sucesso com corpo de resposta.
- \`201 Created\`: Recurso criado com sucesso (geralmente acompanhado de Location header).
- \`400 Bad Request\`: Violação de validação de payload informada pelo cliente.
- \`401 Unauthorized\`: Ausência ou token de autenticação inválido.
- \`403 Forbidden\`: Autenticado, mas sem permissão de acesso ao recurso.
- \`404 Not Found\`: Recurso com ID solicitado não existe.
- \`500 Internal Server Error\`: Falha inesperada de infraestrutura.`,
          },
          {
            id: 'stage-back-lab',
            moduleId: 'mod-03',
            trackId: 'track-interns-dev',
            title: 'Laboratório Prático: Desafio de Backend com Suite de Testes',
            description: 'Implementação de endpoints com suite de testes automatizados e critérios de aceitação rígidos.',
            type: 'backend_challenge',
            durationMinutes: 60,
            order: 2,
            isCompleted: false, // In progress!
            isRequired: true,
            challengeId: 'chal-back-01',
            competencyIds: ['comp-backend'],
          },
        ],
      },
      {
        id: 'mod-04',
        trackId: 'track-interns-dev',
        title: 'Módulo 4: Interfaces Modernas & Front-end com React',
        description: 'Componentização declarativa, boas práticas com Tailwind CSS, acessibilidade WCAG 2.2 e responsividade.',
        order: 4,
        stages: [
          {
            id: 'stage-front-reading',
            moduleId: 'mod-04',
            trackId: 'track-interns-dev',
            title: 'Componentização & Acessibilidade Web (WCAG 2.2 AA)',
            description: 'Criação de componentes acessíveis com navegação por teclado, contraste e semântica WAI-ARIA.',
            type: 'reading',
            durationMinutes: 30,
            order: 1,
            isCompleted: false,
            isRequired: true,
            competencyIds: ['comp-frontend', 'comp-a11y'],
            contentMarkdown: `# Componentização & Acessibilidade Web (WCAG 2.2 AA)

Acessibilidade não é um complemento opcional: é um pilar da qualidade de engenharia de software profissional.

---

## 1. Princípios Fundamentais da WCAG

1. **Perceptível**: As informações devem ser apresentadas de modo que qualquer usuário consiga percebê-las (ex: bom contraste de cor, textos alternativos para imagens).
2. **Operável**: A navegação e a interação devem ser possíveis através de múltiplos dispositivos (mouse, teclado, leitor de tela).
3. **Compreensível**: Linguagem clara, mensagens de erro contextualizadas e previsibilidade na navegação.
4. **Robusto**: Código semântico padronizado, compatível com tecnologias assistivas atuais e futuras.

---

## 2. Regras Práticas para React e Tailwind

- Use tags semânticas (\`<button>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<header>\`).
- Nunca substitua \`<button>\` por \`<div onClick={...}>\` sem atalhos de teclado.
- Garanta anel de foco visível com classes como: \`focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none\`.
- Sempre combine cor com ícone ou texto para representar status (ex: não exiba apenas um círculo verde ou vermelho).`,
          },
          {
            id: 'stage-front-lab',
            moduleId: 'mod-04',
            trackId: 'track-interns-dev',
            title: 'Laboratório Prático: Desafio de UI Acessível com Sandbox',
            description: 'Desenvolvimento e validação de componente acessível com foco por teclado e responsividade.',
            type: 'frontend_challenge',
            durationMinutes: 50,
            order: 2,
            isCompleted: false,
            isRequired: true,
            challengeId: 'chal-front-01',
            competencyIds: ['comp-frontend', 'comp-a11y'],
          },
        ],
      },
      {
        id: 'mod-05',
        trackId: 'track-interns-dev',
        title: 'Módulo 5: Projeto Integrador Final & Certificação',
        description: 'Integração de ponta a ponta dos conhecimentos, revisão com o supervisor técnico e emissão do certificado.',
        order: 5,
        stages: [
          {
            id: 'stage-project',
            moduleId: 'mod-05',
            trackId: 'track-interns-dev',
            title: 'Projeto Integrador: Sistema de Gestão de Ordens de Serviço',
            description: 'Entrega do repositório final integrando banco de dados relacional, API REST e interface web acessível.',
            type: 'project',
            durationMinutes: 180,
            order: 1,
            isCompleted: false,
            isRequired: true,
            competencyIds: ['comp-sql', 'comp-backend', 'comp-frontend', 'comp-git', 'comp-a11y'],
          },
        ],
      },
    ],
  },
  {
    id: 'track-data-eng',
    title: 'Trilha de Fundamentos de Engenharia de Dados',
    shortDescription: 'Pipelines de dados, orquestração e modelagem de Data Warehouses com SQL e Python.',
    fullDescription: 'Aprenda a construir pipelines analíticos robustos, tratar dados em escala e desenhar esquemas estrela/floco de neve.',
    area: 'Banco de Dados',
    level: 'Intermediário',
    estimatedHours: 35,
    publishingStatus: 'published',
    enrolledStudentsCount: 14,
    version: '1.2.0',
    lastUpdatedAt: '2026-10-01',
    certificationAvailable: true,
    prerequisites: ['SQL intermediário', 'Noções de Python para manipulação de arquivos'],
    learningObjectives: ['Criar pipelines ETL/ELT', 'Modelagem dimensional de Data Warehouses', 'Otimização de índices analíticos'],
    competenciesWorked: ['Modelagem Relacional & Consultas SQL Avançadas'],
    modules: [],
  },
  {
    id: 'track-devops-cloud',
    title: 'Trilha de DevOps, CI/CD e Observabilidade',
    shortDescription: 'Pipelines automatizados de deploy, Docker, monitoramento com logs e métricas em ambientes modernos.',
    fullDescription: 'Domine a esteira completa de entrega de software com automações seguras, contêineres e telemetria de produção.',
    area: 'DevOps & Qualidade',
    level: 'Intermediário',
    estimatedHours: 30,
    publishingStatus: 'draft',
    enrolledStudentsCount: 0,
    version: '0.9.0',
    lastUpdatedAt: '2026-10-18',
    certificationAvailable: false,
    prerequisites: ['Noções de Linux e redes', 'Controle de versão com Git'],
    learningObjectives: ['Containerização de aplicações', 'Configuração de esteiras CI/CD', 'Monitoramento e métricas de saúde'],
    competenciesWorked: ['Fluxo Colaborativo com Git e Revisão de Código'],
    modules: [],
  },
];

export const INITIAL_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'lib-01',
    title: 'Manual de Boas Práticas para Git e Code Review',
    category: 'Manuais',
    type: 'article',
    readingTimeMinutes: 12,
    tags: ['Git', 'Code Review', 'Engenharia', 'Padronização'],
    summary: 'Guia completo de convenções de branch, escrita de mensagens atômicas de commit e postura construtiva em revisões de código.',
    lastUpdated: '2026-10-10',
    relatedTrackId: 'track-interns-dev',
    contentMarkdown: `# Manual de Boas Práticas para Git e Code Review

Revisão de código é uma ferramenta primária de compartilhamento de conhecimento e proteção da estabilidade do produto.

---

## 1. Princípios para quem abre o Pull Request

- **Mantenha o PR focado**: PRs com menos de 300 linhas de alteração são revisados com 80% mais profundidade e identificam 4x mais potenciais bugs.
- **Forneça contexto**: Explique o **motivo** da alteração, anexe prints ou logs de teste e mencione a tarefa relacionada.
- **Auto-revisão antes de solicitar**: Leia o diff você mesmo antes de marcar os revisores para limpar comentários óbvios ou arquivos esquecidos.

---

## 2. Princípios para quem revisa

- Faça perguntas abertas em vez de ordens imperativas (\`"O que você acha de extrair essa função para evitar duplicação?"\`).
- Elogie soluções elegantes e bem testadas.
- Priorize clareza, manutenibilidade e segurança antes de detalhes estéticos que o linter pode resolver.`,
  },
  {
    id: 'lib-02',
    title: 'Guia Rápido de SQL: Joins, Agrupamentos e Índices',
    category: 'Guias Rápidos',
    type: 'cheatsheet',
    readingTimeMinutes: 8,
    tags: ['SQL', 'PostgreSQL', 'Performance', 'Queries'],
    summary: 'Referência rápida com exemplos visuais de INNER JOIN, LEFT JOIN, cláusula HAVING, funções analíticas de janela e índices compostos.',
    lastUpdated: '2026-10-08',
    relatedTrackId: 'track-interns-dev',
    contentMarkdown: `# Guia Rápido de SQL: Joins, Agrupamentos e Índices

Referência sintática prática para consultas do dia a dia no PostgreSQL / MySQL.

---

## 1. Mapa de Joins

- \`INNER JOIN\`: Retorna somente linhas que possuem correspondência em **ambas** as tabelas.
- \`LEFT JOIN\`: Retorna **todas** as linhas da tabela à esquerda e as correspondências da tabela à direita (preenchendo com \`NULL\` onde não houver).
- \`FULL OUTER JOIN\`: Retorna todas as linhas de ambas as tabelas.

---

## 2. Diferença entre WHERE e HAVING

- \`WHERE\`: Filtra linhas **antes** da operação de agrupamento (\`GROUP BY\`).
- \`HAVING\`: Filtra grupos de linhas gerados **após** a agregação.

\`\`\`sql
SELECT departamento, AVG(salario) AS media_salario
FROM colaboradores
WHERE status = 'ativo'
GROUP BY departamento
HAVING AVG(salario) > 5000;
\`\`\``,
  },
  {
    id: 'lib-03',
    title: 'Guia de Diretrizes de Acessibilidade WCAG 2.2 para Desenvolvedores',
    category: 'Normas & Padrões',
    type: 'standard',
    readingTimeMinutes: 15,
    tags: ['Acessibilidade', 'WCAG', 'Frontend', 'HTML Semântico'],
    summary: 'Checklist prático para desenvolvedores frontend atingirem conformidade de nível AA em conformidade com as diretrizes internacionais.',
    lastUpdated: '2026-10-14',
    relatedTrackId: 'track-interns-dev',
    contentMarkdown: `# Diretrizes WCAG 2.2 AA para Desenvolvedores Frontend

Checklist indispensável para qualquer aplicação web corporativa moderna.

---

## 1. Contraste de Cores

- Texto normal: mínimo de **4.5:1** contra o fundo.
- Texto grande (18pt ou 14pt negrito): mínimo de **3:1**.
- Componentes interativos e bordas de inputs: mínimo de **3:1**.

---

## 2. Navegação por Teclado

- O foco nunca pode ficar preso em um elemento sem possibilidade de saída com a tecla Tab ou Esc.
- O elemento atualmente focado deve ter um anel visual evidente (nunca utilize \`outline: none\` sem fornecer um substituto de foco visível).`,
  },
  {
    id: 'lib-04',
    title: 'Padrão de Resposta de Erros em APIs RESTful',
    category: 'Boas Práticas',
    type: 'standard',
    readingTimeMinutes: 10,
    tags: ['APIs', 'REST', 'Backend', 'Segurança'],
    summary: 'Especificação estruturada de mensagens de erro baseada no RFC 7807 (Problem Details for HTTP APIs).',
    lastUpdated: '2026-09-28',
    relatedTrackId: 'track-interns-dev',
    contentMarkdown: `# RFC 7807: Problem Details para APIs REST

Nunca retorne erros em formatos ad-hoc ou textos puros sem estrutura.

---

## Exemplo de Payload Padronizado

\`\`\`json
{
  "type": "https://api.nexora.internal/errors/validation-error",
  "title": "Falha na validação dos campos de entrada",
  "status": 400,
  "detail": "O campo 'description' deve conter no mínimo 10 caracteres.",
  "instance": "/api/v1/orders/create",
  "invalidParams": [
    {
      "name": "description",
      "reason": "Comprimento atual: 4 caracteres; mínimo exigido: 10."
    }
  ]
}
\`\`\``,
  },
];

export const INITIAL_PROJECT_DELIVERABLES: ProjectDeliverable[] = [
  {
    id: 'proj-deliv-01',
    projectId: 'stage-project',
    studentId: 'user-pedro',
    stageName: 'Etapa 1: Modelagem do Banco e Migrations',
    title: 'Esquema Relacional e Script DDL de Ordens de Serviço',
    repositoryUrl: 'https://github.com/pedro-sousa/service-orders-system',
    liveDemoUrl: 'https://staging-orders.nexora.dev',
    technicalNotes: 'Implementadas tabelas orders, customers, order_items e order_history com triggers de auditoria em PostgreSQL.',
    submittedAt: '2026-10-16 11:30',
    status: 'approved',
    supervisorFeedback: 'Excelente modelagem! A normalização está em 3FN e a criação do índice composto em (customer_id, status) demonstrou atenção à performance de leitura.',
    reviewedAt: '2026-10-17 15:45',
  },
  {
    id: 'proj-deliv-02',
    projectId: 'stage-project',
    studentId: 'user-pedro',
    stageName: 'Etapa 2: Endpoints REST e Testes Integrados',
    title: 'API de Gestão de Ordens com Autenticação e Testes',
    repositoryUrl: 'https://github.com/pedro-sousa/service-orders-system/tree/backend-api',
    technicalNotes: 'Contratos validados com Zod, cobertura de 84% com Vitest e tratamento de erros conforme RFC 7807.',
    submittedAt: '2026-10-18 19:20',
    status: 'under_review',
  },
];

export const INITIAL_CERTIFICATE: Certificate = {
  id: 'cert-2026-0041',
  credentialCode: 'NX-2026-DEV-8921-A',
  studentId: 'user-pedro',
  studentName: 'Pedro Sousa',
  trackId: 'track-interns-dev',
  trackTitle: 'Trilha de Formação para Estagiários: Engenharia de Software',
  workloadHours: 40,
  issuedAt: '2026-10-19',
  issuedByOrganization: 'Nexora Tech Lab & Academy',
  supervisorSignature: 'Mariana Ramos — Tech Lead & Mentora',
  competenciesSummary: [
    'Modelagem Relacional & Consultas SQL Avançadas',
    'Construção de APIs REST com Node.js e TypeScript',
    'Desenvolvimento de Interfaces Modernas com React e Tailwind',
    'Acessibilidade Digital & Conformidade WCAG 2.2 AA',
    'Fluxo Colaborativo com Git e Revisão de Código',
  ],
  status: 'active',
};
