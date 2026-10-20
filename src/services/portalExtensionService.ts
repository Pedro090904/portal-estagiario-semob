import {
  ForumThread,
  ForumFaq,
  HeatmapDay,
  SkillScore,
  AchievementBadge,
  SubmissionReviewItem,
  CertificateHomologationItem,
  InternProgressOverview,
  ManagedTrack,
  ManagedUser,
  UserRole,
  StudentProgress,
  SupervisorDecision,
} from '../types';
import { brandConfig } from '../config/brand';
import { storageService } from './storageService';

const FORUM_STORAGE_KEY = `${brandConfig.storageKeyPrefix}_forum_threads_v1`;
const USER_ROLE_KEY = `${brandConfig.storageKeyPrefix}_active_user_role_v1`;
const SUPERVISOR_REVIEWS_KEY = `${brandConfig.storageKeyPrefix}_supervisor_reviews_v1`;
const MANAGED_TRACKS_KEY = `${brandConfig.storageKeyPrefix}_admin_tracks_v1`;
const MANAGED_USERS_KEY = `${brandConfig.storageKeyPrefix}_admin_users_v1`;

export const MOCK_FAQS: ForumFaq[] = [
  {
    id: 'faq-1',
    category: 'Ambiente & Docker',
    question: 'Como rodar o container PostgreSQL com PostGIS no WSL2?',
    answer:
      'Utilize o arquivo docker-compose.yml oficial fornecido no Módulo 1. Execute "docker compose up -d" no terminal do Ubuntu/WSL2. Verifique se a porta 5432 não está em conflito com uma instalação local do Postgres no Windows.',
  },
  {
    id: 'faq-2',
    category: 'Git & Padrões SEMOB',
    question: 'Qual é o padrão oficial de branches para entrega dos desafios?',
    answer:
      'Conforme a convenção da SUTINF (Módulo 2), utilize o formato "feature/SIT-<NUMERO>-<descricao-curta>" para novas funcionalidades ou "fix/SIT-<NUMERO>-<descricao>" para correções. Os commits devem seguir o Conventional Commits.',
  },
  {
    id: 'faq-3',
    category: 'Banco de Dados & SQL',
    question: 'Por que minha query com agregação dá erro ao filtrar no WHERE?',
    answer:
      'Em SQL padrão e PostgreSQL, a cláusula WHERE é executada antes dos agrupamentos. Funções agregadas como COUNT(), SUM() ou AVG() só podem ser filtradas na cláusula HAVING após o GROUP BY.',
  },
  {
    id: 'faq-4',
    category: 'Certificado & Processo SEI',
    question: 'Como meu certificado é validado e protocolado formalmente no GDF?',
    answer:
      'Após atingir 100% de conclusão dos manuais, aprovação com nota ≥ 70% em todos os quizzes e entrega dos desafios práticos, o orientador técnico da SEMOB homologa o atestado com o número de processo administrativo SEI institucional.',
  },
  {
    id: 'faq-5',
    category: 'Arquitetura Front-end',
    question: 'O que é a regra das 50 linhas para custom hooks?',
    answer:
      'É a diretriz de manutenibilidade da SUTINF (Módulo 5) para evitar hooks monolíticos. Cada hook deve ter responsabilidade única e não ultrapassar 50 linhas de lógica, extraindo helpers utilitários quando necessário.',
  },
];

const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    title: 'Dúvida no Desafio SQL: Questão 12 — Cruzamento de Sentidos da Linha 0.111',
    content:
      'Olá pessoal! Na questão 12 do Desafio SQL onde precisamos comparar viagens de ida e volta da linha 0.111 na Bacia 3, notei uma divergência no JOIN com a tabela de horários programados. Devo considerar apenas dias úteis ou fins de semana também?',
    moduleId: 'mod-3-banco-dados',
    moduleTitle: 'Módulo 3: Bancos de Dados & SQL SEMOB',
    authorName: 'Ana Clara Lima',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    createdAt: 'Há 2 horas',
    tags: ['SQL', 'PostgreSQL', 'dados_mobilidade', 'Linha 0.111'],
    upvotes: 6,
    userHasUpvoted: false,
    solved: true,
    commentsCount: 2,
    comments: [
      {
        id: 'comm-1',
        authorName: 'Carlos Silveira',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        authorRole: 'Supervisor',
        content:
          'Excelente pergunta, Ana! Na modelagem do STPC/DF, o campo tipo_dia diferencia "U" (Útil), "S" (Sábado) e "D" (Domingo). Para a questão 12, filtre por tipo_dia = \'U\' para isolar o padrão de pico operacional.',
        createdAt: 'Há 1 hora',
        isSolution: true,
      },
      {
        id: 'comm-2',
        authorName: 'Pedro M. Sousa',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        authorRole: 'Aluno',
        content: 'Boa! Eu estava com essa mesma dúvida e ao filtrar por "U" a contagem bateu perfeitamente com o gabarito.',
        createdAt: 'Há 35 min',
      },
    ],
  },
  {
    id: 'thread-2',
    title: 'NestJS: Injeção de dependência do VeiculoRepository na camada Service',
    content:
      'Estou implementando a etapa 4 do Desafio Back-end (recurso Veículos no SISMOB Boilerplate). Ao registrar o Repository no módulo com TypeOrmModule.forFeature([VeiculoEntity]), o Nest acusava circular dependency. Alguém passou por isso?',
    moduleId: 'mod-4-backend',
    moduleTitle: 'Módulo 4: Back-end NestJS (SISMOB)',
    authorName: 'Lucas Ferreira Costa',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    createdAt: 'Ontem às 16:40',
    tags: ['NestJS', 'TypeORM', 'Docker', 'InjeçãoDependência'],
    upvotes: 4,
    userHasUpvoted: true,
    solved: true,
    commentsCount: 1,
    comments: [
      {
        id: 'comm-3',
        authorName: 'Mariana Rios',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
        authorRole: 'Monitor',
        content:
          'Verifique se você não importou o VeiculoModule dentro de si mesmo no AppModule. Além disso, lembre-se de exportar o TypeOrmModule caso outro service precise consultar a entidade.',
        createdAt: 'Ontem às 18:10',
        isSolution: true,
      },
    ],
  },
  {
    id: 'thread-3',
    title: 'Dica de Git: Como desfazer um commit local antes do push no GitLab da SEMOB',
    content:
      'Gente, cometi um commit no branch feature com um arquivo de log sem querer. Para desfazer preservando as alterações no working directory, basta rodar: git reset --soft HEAD~1. Fica a dica pra quem estiver começando na esteira de CI/CD!',
    moduleId: 'mod-2-git',
    moduleTitle: 'Módulo 2: Git & Engenharia Colaborativa',
    authorName: 'Mariana Rios',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
    createdAt: 'Há 3 dias',
    tags: ['Git', 'GitLabFlow', 'DicasDev', 'SUTINF'],
    upvotes: 11,
    userHasUpvoted: false,
    solved: false,
    commentsCount: 0,
    comments: [],
  },
];

const INITIAL_MANAGED_TRACKS: ManagedTrack[] = [
  {
    id: 'trilha-dev-semob-2026',
    title: 'Trilha Oficial de Engenharia & Acolhimento SUTINF 2026',
    shortDescription: 'Formação obrigatória para estagiários em engenharia de software e análise de sistemas da SEMOB.',
    fullDescription:
      'Esta trilha abrange todo o ciclo de vida dos sistemas de mobilidade do Distrito Federal: ambiente Linux/Docker, controle de versão colaborativo via GitLab Flow, consultas analíticas em PostgreSQL/PostGIS, serviços backend NestJS em 3 camadas e aplicações reativas com React 18 e acessibilidade.',
    area: 'Engenharia de Software',
    level: 'Iniciante',
    estimatedHours: 40,
    publishingStatus: 'published',
    version: '2.4.0',
    enrolledStudentsCount: 14,
    lastUpdatedAt: '2026-10-18',
  },
  {
    id: 'trilha-postgis-avancado',
    title: 'Análise Espacial de Rotas & Geoprocessamento PostGIS',
    shortDescription: 'Modelagem de dados geoespaciais, trajetórias de ônibus via GPS e cruzamentos espaciais STPC/DF.',
    fullDescription:
      'Capacitação complementar em PostGIS para manipulação de coordenadas SIRGAS 2000, cálculo de extensões de linhas, polígonos de bacias e geração de heatmaps de atrasos.',
    area: 'Banco de Dados & Geoprocessamento',
    level: 'Intermediário',
    estimatedHours: 20,
    publishingStatus: 'in_review',
    version: '1.1.0',
    enrolledStudentsCount: 6,
    lastUpdatedAt: '2026-10-15',
  },
  {
    id: 'trilha-devsecops-ci-cd',
    title: 'DevSecOps & Deploy Automatizado no Governo Digital',
    shortDescription: 'Pipelines do GitLab CI, análise estática de código com SonarQube e containers seguros.',
    fullDescription:
      'Treinamento sobre segurança em pipelines públicas, governança de dados governamentais e observabilidade com Prometheus e Grafana.',
    area: 'DevOps & Qualidade',
    level: 'Avançado',
    estimatedHours: 30,
    publishingStatus: 'draft',
    version: '0.9.0',
    enrolledStudentsCount: 0,
    lastUpdatedAt: '2026-10-10',
  },
];

const INITIAL_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr-1',
    name: 'Pedro M. Sousa',
    email: 'pedro.sousa@semob.df.gov.br',
    title: 'Estagiário de Engenharia de Software',
    role: 'ALUNO',
    organizationName: 'SEMOB-DF / SUTINF / CODSYS',
    joinedAt: '2026-09-01',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'usr-2',
    name: 'Carlos E. Silveira',
    email: 'carlos.silveira@semob.df.gov.br',
    title: 'Orientador Técnico & Arquiteto Chefe',
    role: 'SUPERVISOR',
    organizationName: 'SUTINF / Coordenação de Sistemas',
    joinedAt: '2022-03-15',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'usr-3',
    name: 'Dra. Helena Barreto',
    email: 'helena.barreto@semob.df.gov.br',
    title: 'Subsecretária de TI & Gestora Pedagógica',
    role: 'ADMIN',
    organizationName: 'Secretaria de Transporte e Mobilidade',
    joinedAt: '2021-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'usr-4',
    name: 'Ana Clara Lima',
    email: 'ana.lima@semob.df.gov.br',
    title: 'Estagiária de Dados & BI',
    role: 'ALUNO',
    organizationName: 'SUTINF / Dados de Mobilidade',
    joinedAt: '2026-09-15',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'usr-5',
    name: 'Lucas Ferreira Costa',
    email: 'lucas.costa@semob.df.gov.br',
    title: 'Estagiário de Backend',
    role: 'ALUNO',
    organizationName: 'SUTINF / Microsserviços SIT',
    joinedAt: '2026-09-01',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
];

export const portalExtensionService = {
  // ==========================================
  // Controle de Papel Ativo (RBAC)
  // ==========================================
  getActiveRole(): UserRole {
    try {
      const saved = localStorage.getItem(USER_ROLE_KEY);
      if (saved === 'ALUNO' || saved === 'SUPERVISOR' || saved === 'ADMIN' || saved === 'DESENVOLVEDOR') {
        return saved as UserRole;
      }
      return 'ALUNO';
    } catch {
      return 'ALUNO';
    }
  },

  setActiveRole(role: UserRole): void {
    try {
      localStorage.setItem(USER_ROLE_KEY, role);
    } catch (e) {
      console.error('Erro ao salvar papel do usuário:', e);
    }
  },

  // ==========================================
  // Fórum & Comunidade (devjourney)
  // ==========================================
  getForumThreads(): ForumThread[] {
    try {
      const raw = localStorage.getItem(FORUM_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(INITIAL_FORUM_THREADS));
        return INITIAL_FORUM_THREADS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_FORUM_THREADS;
    }
  },

  saveForumThreads(threads: ForumThread[]): void {
    try {
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(threads));
    } catch (e) {
      console.error('Erro ao salvar fórum:', e);
    }
  },

  addForumThread(thread: {
    title: string;
    content: string;
    moduleId: string;
    moduleTitle: string;
    tags: string[];
    authorName: string;
  }): ForumThread {
    const threads = this.getForumThreads();
    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      title: thread.title.trim(),
      content: thread.content.trim(),
      moduleId: thread.moduleId,
      moduleTitle: thread.moduleTitle,
      authorName: thread.authorName || 'Desenvolvedor(a) SEMOB',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      createdAt: 'Agora mesmo',
      tags: thread.tags,
      upvotes: 1,
      userHasUpvoted: true,
      solved: false,
      commentsCount: 0,
      comments: [],
    };

    const updated = [newThread, ...threads];
    this.saveForumThreads(updated);
    return newThread;
  },

  toggleUpvoteThread(threadId: string): ForumThread[] {
    const threads = this.getForumThreads();
    const updated = threads.map((t) => {
      if (t.id === threadId) {
        const nextHasUpvoted = !t.userHasUpvoted;
        return {
          ...t,
          userHasUpvoted: nextHasUpvoted,
          upvotes: nextHasUpvoted ? t.upvotes + 1 : Math.max(0, t.upvotes - 1),
        };
      }
      return t;
    });
    this.saveForumThreads(updated);
    return updated;
  },

  addCommentToThread(
    threadId: string,
    content: string,
    authorName: string,
    authorRole: 'Aluno' | 'Monitor' | 'Supervisor' | 'Instrutor' = 'Aluno'
  ): ForumThread[] {
    const threads = this.getForumThreads();
    const updated = threads.map((t) => {
      if (t.id === threadId) {
        const newComment = {
          id: `comm-${Date.now()}`,
          authorName: authorName || 'Desenvolvedor(a) SEMOB',
          authorAvatar:
            authorRole === 'Supervisor'
              ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          authorRole,
          content: content.trim(),
          createdAt: 'Agora mesmo',
        };
        const nextComments = [...t.comments, newComment];
        return {
          ...t,
          commentsCount: nextComments.length,
          comments: nextComments,
        };
      }
      return t;
    });
    this.saveForumThreads(updated);
    return updated;
  },

  getForumFaqs(): ForumFaq[] {
    return MOCK_FAQS;
  },

  // ==========================================
  // Heatmap & Ofensiva de Estudos (devjourney)
  // ==========================================
  getHeatmapData(progress: StudentProgress): {
    heatmapDays: HeatmapDay[];
    currentStreak: number;
    weeklyGoalHours: number;
    completedWeeklyMinutes: number;
  } {
    // Gera as últimas 16 semanas (112 dias) até a data atual
    const totalDays = 16 * 7;
    const now = new Date();
    const days: HeatmapDay[] = [];

    // Base determinística de atividade a partir dos módulos/quizzes concluídos
    const completedCount = progress.completedModules.length + Object.keys(progress.quizScores).length;

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay(); // 0 domingo, 6 sabado

      // Padrão de atividade realista (mais intenso nos dias úteis e nas semanas recentes)
      let count = 0;
      let lessons = 0;
      let minutes = 0;

      const isRecent = i <= 21; // últimas 3 semanas
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

      if (isWeekday && (isRecent || (i % 3 === 0 && completedCount > 0))) {
        const factor = (i * 7 + completedCount * 13) % 5;
        count = Math.min(4, Math.max(1, factor));
        lessons = count;
        minutes = count * 35;
      } else if (i === 0) {
        // Hoje sempre ativo
        count = 3;
        lessons = 2;
        minutes = 75;
      }

      days.push({
        date: iso,
        count,
        lessonsCompleted: lessons,
        minutesSpent: minutes,
      });
    }

    // Calcula minutos da última semana (últimos 7 dias)
    const last7Days = days.slice(-7);
    const completedWeeklyMinutes = last7Days.reduce((acc, curr) => acc + curr.minutesSpent, 0) || 510;
    const currentStreak = Math.max(8, Math.min(24, 10 + completedCount * 2));

    return {
      heatmapDays: days,
      currentStreak,
      weeklyGoalHours: 10,
      completedWeeklyMinutes,
    };
  },

  // ==========================================
  // Mapa de Competências (Skill Radar SVG)
  // ==========================================
  getSkillScores(progress: StudentProgress): SkillScore[] {
    const hasMod1 = progress.completedModules.includes('mod-1-ambiente');
    const hasMod2 = progress.completedModules.includes('mod-2-git');
    const hasMod3 = progress.completedModules.includes('mod-3-banco-dados');
    const hasMod4 = progress.completedModules.includes('mod-4-backend');
    const hasMod5 = progress.completedModules.includes('mod-5-frontend');

    const quizScores = progress.quizScores;
    const q1 = quizScores['mod-1-ambiente']?.percentage || (hasMod1 ? 80 : 30);
    const q2 = quizScores['mod-2-git']?.percentage || (hasMod2 ? 85 : 40);
    const q3 = quizScores['mod-3-banco-dados']?.percentage || (hasMod3 ? 90 : 35);
    const q4 = quizScores['mod-4-backend']?.percentage || (hasMod4 ? 85 : 25);
    const q5 = quizScores['mod-5-frontend']?.percentage || (hasMod5 ? 95 : 20);

    return [
      {
        skill: 'Ambiente & Docker',
        score: Math.min(100, Math.max(20, Math.round(q1))),
        fullMark: 100,
        category: 'Infraestrutura',
        description: 'WSL2, containers Docker Compose, rede interna e variáveis seguras',
      },
      {
        skill: 'Git & DevSecOps',
        score: Math.min(100, Math.max(20, Math.round(q2))),
        fullMark: 100,
        category: 'Engenharia Colaborativa',
        description: 'As 4 zonas do Git, GitLab Flow institucional, MRs e esteiras CI/CD',
      },
      {
        skill: 'SQL & PostGIS',
        score: Math.min(100, Math.max(20, Math.round(q3))),
        fullMark: 100,
        category: 'Dados & Espacial',
        description: 'Consultas analíticas do STPC/DF, joins espaciais e otimização',
      },
      {
        skill: 'Back-end NestJS',
        score: Math.min(100, Math.max(20, Math.round(q4))),
        fullMark: 100,
        category: 'Microsserviços',
        description: 'Arquitetura em 3 camadas (Controller/Service/Repo), TypeORM e DTOs',
      },
      {
        skill: 'Front-end React & A11y',
        score: Math.min(100, Math.max(20, Math.round(q5))),
        fullMark: 100,
        category: 'Aplicações Web',
        description: 'React 18 reativo, TypeScript rígido, regra 50 linhas e acessibilidade',
      },
    ];
  },

  getBadges(progress: StudentProgress): AchievementBadge[] {
    const completedMods = progress.completedModules.length;
    const passedQuizzes = Object.values(progress.quizScores).filter((q) => q.passed).length;
    const hasSqlChallenge = progress.challengeSubmissions?.['challenge-sql-relatorios']?.checklistCompleted;
    const hasCert = !!progress.certificateCode;

    return [
      {
        id: 'badge-1',
        name: 'Primeiro Commit Homologado',
        description: 'Concluiu o módulo oficial de Git e boas práticas no GitLab da SEMOB.',
        icon: 'GitBranch',
        unlocked: completedMods >= 2,
        progressPercent: completedMods >= 2 ? 100 : 50,
      },
      {
        id: 'badge-2',
        name: 'Guardião de Dados STPC',
        description: 'Aprovado na avaliação de modelagem e consultas avançadas SQL.',
        icon: 'Database',
        unlocked: passedQuizzes >= 2,
        progressPercent: Math.min(100, passedQuizzes * 50),
      },
      {
        id: 'badge-3',
        name: 'Detetive das 25 Linhas',
        description: 'Submeteu o checklist completo das consultas do Desafio SQL.',
        icon: 'Terminal',
        unlocked: !!hasSqlChallenge,
        progressPercent: hasSqlChallenge ? 100 : 40,
      },
      {
        id: 'badge-4',
        name: 'Constância Inabalável',
        description: 'Manteve uma sequência ativa de estudos por mais de 7 dias.',
        icon: 'Flame',
        unlocked: true,
        progressPercent: 100,
      },
      {
        id: 'badge-5',
        name: 'Arquiteto de Microsserviços',
        description: 'Implementou entidades, DTOs e serviços NestJS no SISMOB Boilerplate.',
        icon: 'Server',
        unlocked: completedMods >= 4,
        progressPercent: completedMods >= 4 ? 100 : 25,
      },
      {
        id: 'badge-6',
        name: 'Homologação Oficial SEI',
        description: 'Completou a formação de 40h com emissão do certificado com processo SEI.',
        icon: 'Award',
        unlocked: hasCert,
        progressPercent: hasCert ? 100 : Math.round((completedMods / 5) * 80),
      },
    ];
  },

  // ==========================================
  // Painel do Supervisor (plataforma-semob)
  // ==========================================
  getSupervisorSubmissions(): SubmissionReviewItem[] {
    const raw = localStorage.getItem(SUPERVISOR_REVIEWS_KEY);
    const progress = storageService.getProgress();

    const sampleSubmissions: SubmissionReviewItem[] = [
      {
        id: 'sub-sample-1',
        submissionId: 'challenge-sql-relatorios',
        studentName: 'Ana Clara Lima',
        studentEmail: 'ana.lima@semob.df.gov.br',
        challengeId: 'challenge-sql-relatorios',
        challengeTitle: 'Desafio Prático SQL (25 Questões da Linha 0.111 e 0.170)',
        submittedAt: 'Há 3 horas',
        waitingHours: 3,
        repositoryUrl: 'https://gitlab.semob.df.gov.br/estagio-2026/ana-lima-desafio-sql',
        status: 'EM_REVISAO',
        checkedPrItems: [0, 1, 2, 3],
        sqlQueriesCount: 25,
      },
      {
        id: 'sub-sample-2',
        submissionId: 'challenge-backend-api',
        studentName: 'Lucas Ferreira Costa',
        studentEmail: 'lucas.costa@semob.df.gov.br',
        challengeId: 'challenge-backend-api',
        challengeTitle: 'Desafio Back-end: Recurso Veículos no SISMOB Boilerplate',
        submittedAt: 'Ontem às 14:00',
        waitingHours: 24,
        repositoryUrl: 'https://gitlab.semob.df.gov.br/estagio-2026/lucas-backend-veiculos',
        status: 'EM_REVISAO',
        checkedPrItems: [0, 1, 2, 3, 4],
      },
    ];

    // Se o próprio estudante submeteu desafios, inclui na fila!
    if (progress.challengeSubmissions) {
      Object.entries(progress.challengeSubmissions).forEach(([chId, sub]) => {
        if (sub.checklistCompleted && sub.reviewStatus !== 'APROVADO') {
          sampleSubmissions.unshift({
            id: `sub-current-${chId}`,
            submissionId: chId,
            studentName: progress.studentName || 'Estudante Atual (Azimute)',
            studentEmail: progress.studentEmail || 'estudante@semob.df.gov.br',
            challengeId: chId,
            challengeTitle:
              chId === 'challenge-sql-relatorios'
                ? 'Desafio Prático SQL (25 Questões)'
                : chId === 'challenge-backend-api'
                ? 'Desafio Back-end: Recurso Veículos'
                : 'Desafio Front-end: InfoÔnibus',
            submittedAt: sub.completedAt || 'Hoje',
            waitingHours: 1,
            repositoryUrl: sub.repositoryUrl || 'https://gitlab.semob.df.gov.br/estagio-2026/azimute-entrega',
            deployUrl: sub.deployUrl,
            status: sub.reviewStatus || 'EM_REVISAO',
            checkedPrItems: sub.checkedPrItems || [],
            supervisorFeedback: sub.supervisorFeedback,
          });
        }
      });
    }

    if (!raw) {
      localStorage.setItem(SUPERVISOR_REVIEWS_KEY, JSON.stringify(sampleSubmissions));
      return sampleSubmissions;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return sampleSubmissions;
    }
  },

  reviewSubmission(submissionId: string, decision: SupervisorDecision, feedback: string, reviewerName = 'Carlos E. Silveira'): void {
    const list = this.getSupervisorSubmissions();
    const statusMap = {
      aprovada: 'APROVADO' as const,
      aprovada_com_ajustes: 'APROVADO' as const,
      precisa_de_correcao: 'AJUSTES_SOLICITADOS' as const,
    };

    const nextStatus = statusMap[decision];
    const nowIso = new Date().toISOString();

    const updated = list.map((item) => {
      if (item.id === submissionId || item.submissionId === submissionId) {
        return {
          ...item,
          status: nextStatus,
          supervisorFeedback: feedback.trim(),
          reviewedBy: reviewerName,
          reviewedAt: nowIso,
        };
      }
      return item;
    });

    localStorage.setItem(SUPERVISOR_REVIEWS_KEY, JSON.stringify(updated));

    // Se é a submissão do próprio aluno logado, atualiza o progress
    storageService.saveChallengeSubmission(submissionId.replace('sub-current-', ''), {
      reviewStatus: nextStatus,
      supervisorFeedback: feedback.trim(),
      reviewedBy: reviewerName,
      reviewedAt: nowIso,
    });
  },

  getHomologationList(): CertificateHomologationItem[] {
    const progress = storageService.getProgress();
    const isCompleted = progress.completedModules.length >= 5;

    const list: CertificateHomologationItem[] = [
      {
        id: 'homolog-1',
        studentName: 'Lucas Ferreira Costa',
        studentEmail: 'lucas.costa@semob.df.gov.br',
        seiProcessNumber: '00090-00014820/2026-33',
        trackTitle: 'Trilha Oficial de Engenharia & Acolhimento SUTINF',
        workloadHours: 40,
        completedModulesCount: 5,
        totalModulesCount: 5,
        averageScore: 92,
        status: 'ELEGIVEL',
        requestedAt: '2026-10-18',
      },
    ];

    if (isCompleted) {
      list.unshift({
        id: 'homolog-current',
        studentName: progress.studentName || 'Pedro M. Sousa',
        studentEmail: progress.studentEmail || 'pedro.sousa@semob.df.gov.br',
        seiProcessNumber: progress.seiProcessNumber || '00090-00012485/2026-11',
        trackTitle: 'Trilha Oficial de Engenharia & Acolhimento SUTINF',
        workloadHours: 40,
        completedModulesCount: progress.completedModules.length,
        totalModulesCount: 5,
        averageScore: 88,
        status: progress.certificateCode ? 'HOMOLOGADO' : 'ELEGIVEL',
        requestedAt: 'Hoje',
        certificateCode: progress.certificateCode,
      });
    }

    return list;
  },

  homologateCertificate(itemId: string, supervisorName = 'Carlos E. Silveira'): StudentProgress {
    return storageService.issueCertificate(undefined, supervisorName);
  },

  getInternOverviews(): InternProgressOverview[] {
    return [
      {
        id: 'int-1',
        name: 'Pedro M. Sousa',
        email: 'pedro.sousa@semob.df.gov.br',
        area: 'Engenharia de Software (Fullstack)',
        completedSteps: 5,
        totalSteps: 5,
        quizAverage: 88,
        lastAccess: 'Hoje às 10:15',
        status: 'concluido',
      },
      {
        id: 'int-2',
        name: 'Ana Clara Lima',
        email: 'ana.lima@semob.df.gov.br',
        area: 'Dados & Modelagem Espacial',
        completedSteps: 4,
        totalSteps: 5,
        quizAverage: 92,
        lastAccess: 'Hoje às 09:30',
        status: 'revisao_pendente',
      },
      {
        id: 'int-3',
        name: 'Lucas Ferreira Costa',
        email: 'lucas.costa@semob.df.gov.br',
        area: 'Back-end & Microsserviços',
        completedSteps: 5,
        totalSteps: 5,
        quizAverage: 85,
        lastAccess: 'Ontem às 17:00',
        status: 'em_dia',
      },
      {
        id: 'int-4',
        name: 'Gabriel Albuquerque',
        email: 'gabriel.albuquerque@semob.df.gov.br',
        area: 'Front-end & Mobile',
        completedSteps: 2,
        totalSteps: 5,
        quizAverage: 71,
        lastAccess: 'Há 5 dias',
        status: 'atencao',
      },
    ];
  },

  // ==========================================
  // Administração (nexora)
  // ==========================================
  getManagedTracks(): ManagedTrack[] {
    try {
      const raw = localStorage.getItem(MANAGED_TRACKS_KEY);
      if (!raw) {
        localStorage.setItem(MANAGED_TRACKS_KEY, JSON.stringify(INITIAL_MANAGED_TRACKS));
        return INITIAL_MANAGED_TRACKS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_MANAGED_TRACKS;
    }
  },

  saveManagedTrack(track: ManagedTrack): ManagedTrack[] {
    const list = this.getManagedTracks();
    const existingIndex = list.findIndex((t) => t.id === track.id);
    let updated: ManagedTrack[];

    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = { ...track, lastUpdatedAt: new Date().toISOString().split('T')[0] };
    } else {
      updated = [
        ...list,
        {
          ...track,
          id: track.id || `track-${Date.now()}`,
          lastUpdatedAt: new Date().toISOString().split('T')[0],
        },
      ];
    }

    localStorage.setItem(MANAGED_TRACKS_KEY, JSON.stringify(updated));
    return updated;
  },

  getManagedUsers(): ManagedUser[] {
    try {
      const raw = localStorage.getItem(MANAGED_USERS_KEY);
      if (!raw) {
        localStorage.setItem(MANAGED_USERS_KEY, JSON.stringify(INITIAL_MANAGED_USERS));
        return INITIAL_MANAGED_USERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_MANAGED_USERS;
    }
  },

  updateUserRole(userId: string, newRole: UserRole): ManagedUser[] {
    const list = this.getManagedUsers();
    const updated = list.map((u) => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });
    localStorage.setItem(MANAGED_USERS_KEY, JSON.stringify(updated));

    // Se o usuário atual teve o papel alterado, reflete imediatamente
    const currentProgress = storageService.getProgress();
    if (userId === 'usr-1' || currentProgress.studentEmail?.includes('pedro')) {
      this.setActiveRole(newRole);
    }
    return updated;
  },
};
