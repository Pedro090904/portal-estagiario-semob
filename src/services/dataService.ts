import { ModuleMetadata, QuizBlockData, SqlQuestion } from '../types';

export const MODULES: ModuleMetadata[] = [
  {
    id: 'git',
    screenKey: 'modulo-git',
    title: 'Manual Oficial de Git & Engenharia Colaborativa',
    shortTitle: 'Git & DevSecOps',
    subtitle: 'Do Zero à Produção: GitLab Flow, CI/CD, Políticas de Branches e Segurança Governamental',
    category: 'Fundamental',
    duration: '2h de estudo',
    htmlFile: 'manual-git-guia-completo.html',
    iconName: 'GitBranch',
    quizId: 'quiz-git',
    description: 'Aprenda a mecânica do Git, as 4 zonas, comandos diários, convenções de commits, pipelines CI/CD e a regra de ouro: branch principal é sagrada!',
    topics: ['Arquitetura das 4 Zonas', 'GitLab Flow na SEMOB', 'Merge Requests & Code Review', 'CI/CD Pipelines (.gitlab-ci.yml)', 'Viagem no Tempo e Resolução de Conflitos'],
  },
  {
    id: 'sql',
    screenKey: 'modulo-sql',
    title: 'Manual de Engenharia de Dados & Tutorial SQL',
    shortTitle: 'Bancos de Dados & SQL',
    subtitle: 'PostgreSQL, PostGIS, Ambientes bdg vs. dados_mobilidade e Boas Práticas',
    category: 'Dados',
    duration: '3h de estudo',
    htmlFile: 'manual-banco-dados-semob.html',
    iconName: 'Database',
    quizId: 'quiz-sql',
    description: 'Compreenda a diferença entre o ambiente de homologação (bdg) e produção em tempo real (dados_mobilidade). Domine consultas, filtros, agregações e geometrias espaciais PostGIS.',
    topics: ['Ambientes bdg vs dados_mobilidade', 'Comandos SELECT, WHERE e LIKE %', 'Agrupamentos, Ordenações e Funções de Agregação', 'Dados Espaciais (PostGIS: ST_AsText, ST_Length)', 'Regras de Segurança e Cuidados em Produção'],
  },
  {
    id: 'gabarito-sql',
    screenKey: 'modulo-gabarito',
    title: 'Gabarito Oficial & Análise Lógica — Desafio SQL',
    shortTitle: 'Gabarito Desafio SQL',
    subtitle: 'Resoluções Passo a Passo das 25 Questões Práticas com Foco em Performance',
    category: 'Dados',
    duration: '2h de consulta',
    htmlFile: 'gabarito-desafio-sql-semob.html',
    iconName: 'CheckCircle2',
    quizId: 'quiz-sql',
    description: 'Análise profunda e gabarito comentado das 25 questões do desafio prático (Linha 0.111, Linha 0.170 por sentido e cruzamentos gerais de mobilidade urbana do DF).',
    topics: ['Investigação Detalhada da Linha 0.111', 'Compreensão de Sentidos (Ida/Volta na 0.170)', 'Cruzamentos de Business Intelligence', 'Dicas de Performance e Índices B-Tree/GiST'],
  },
  {
    id: 'backend',
    screenKey: 'modulo-backend',
    title: 'Manual Oficial de Desenvolvimento Back-end (SISMOB)',
    shortTitle: 'Back-end NestJS',
    subtitle: 'Arquitetura em 3 Camadas, TypeORM, DTOs, JWT e Docker',
    category: 'Back-end',
    duration: '4h de estudo',
    htmlFile: 'MANUAL_DESENVOLVIMENTO_BACKEND.html',
    iconName: 'Server',
    quizId: 'quiz-backend',
    description: 'Padrão corporativo SISMOB Boilerplate: Controller -> Service -> Repository. Regra de ouro Entity vs. SQL Nativo Parametrizado ($1, $2) contra SQL Injection.',
    topics: ['Arquitetura em 3 Camadas', 'Entity vs. SQL Nativo Parametrizado', 'Validação com DTOs e class-validator', 'Segurança, Guards e Autenticação JWT', 'Tutorial Prático: Criação de Recurso do Zero em 7 Passos'],
  },
  {
    id: 'frontend',
    screenKey: 'modulo-frontend',
    title: 'Guia Prático de Arquitetura Front-end (React + Vite)',
    shortTitle: 'Front-end React',
    subtitle: 'Separação em 5 Camadas, Regra das 50 Linhas, TypeScript Estrito e Desafio InfoÔnibus',
    category: 'Front-end',
    duration: '4h de estudo',
    htmlFile: 'guia_pratico_arquitetura_frontend.html',
    iconName: 'Layout',
    quizId: 'quiz-frontend',
    description: 'Aprenda o modelo mental de 5 camadas (/screens, /hooks, /services, /components, /types), a analogia do restaurante, a Regra das 50 Linhas e a construção do novo InfoÔnibus.',
    topics: ['Modelo Mental em 5 Camadas', 'Regra das 50 Linhas para Hooks', 'Proibição Absoluta do tipo any', 'Dumb Components vs Smart Components', 'Consumo de APIs Reais com Axios/Fetch e Variáveis VITE_'],
  },
];

export const INTEGRATION_ROADMAP = [
  {
    step: 1,
    title: 'Bem-vindo à SEMOB-DF e à SUTINF',
    summary: 'Compreenda a missão institucional da Secretaria de Mobilidade e o papel tecnológico da SUTINF como motor dos transportes da capital.',
    content: `A Secretaria de Mobilidade do Distrito Federal (SEMOB-DF) planeja, gere e fiscaliza todo o sistema de transporte coletivo e mobilidade do DF.
Dentro desse ecossistema, a Subsecretaria de Tecnologia da Informação (SUTINF) atua como o motor tecnológico da pasta, criando soluções para otimizar operações que impactam diariamente milhões de passageiros.`,
    highlights: [
      'SISMOB: Sistema Integrado de Mobilidade (portal unificador central)',
      'INFOMOB: Desdobramento para visualização simplificada e dados abertos ao cidadão',
      'QLIK: Business Intelligence para transformação de grandes massas de dados em decisões estratégicas',
      'Stack Oficial: NestJS + TypeScript, React.js + Vite, PostgreSQL (PostGIS) e Oracle',
    ],
  },
  {
    step: 2,
    title: 'O Padrão de Versionamento (GitLab SEMOB)',
    summary: 'Cultura DevSecOps, esteiras de CI/CD automatizadas e o fluxo de trabalho colaborativo.',
    content: `Por lidarmos com dados governamentais críticos, nosso repositório corporativo é o GitLab interno com pipelines automatizadas de CI/CD executadas por Runners.`,
    rules: [
      'A branch principal é sagrada: NUNCA realize commits diretamente na main ou production.',
      'Merge Requests (MR): Todo código entra via branch isolada de feature/bugfix e passa obrigatoriamente por revisão prévia.',
      'Segurança de Credenciais: O uso de .gitignore é estritamente obrigatório. Jamais envie arquivos .env ou pastas node_modules para o repositório.',
    ],
  },
  {
    step: 3,
    title: 'Bancos de Dados: bdg vs. dados_mobilidade',
    summary: 'A regra de ouro: nunca testamos no escuro e respeitamos o banco de produção.',
    content: `Você terá acesso a dois ambientes principais no PostgreSQL com extensão PostGIS:
1. bdg (Desenvolvimento & Homologação): Laboratório seguro para testes e criação de tabelas.
2. dados_mobilidade (Produção): O coração da operação com injeção em tempo real de posições de GPS e bilhetagem.`,
    quickCheck: [
      {
        question: 'Qual caractere coringa você coloca após SELECT para trazer todas as colunas?',
        answer: 'O asterisco (*), por exemplo: SELECT * FROM linhas_onibus;',
      },
      {
        question: 'Para buscar linhas com "Gama" no nome, qual operador e símbolo são usados?',
        answer: 'Operador LIKE e o símbolo %, por exemplo: WHERE nome_linha LIKE \'%GAMA%\';',
      },
      {
        question: 'Para buscar a maior extensão de linha do DF, qual função e ordenação utilizar?',
        answer: 'Função MAX(extensao) ou ordenar com ORDER BY extensao DESC LIMIT 1;',
      },
      {
        question: 'Como transformar geometrias espaciais do PostGIS em texto legível?',
        answer: 'Utilizando a função PostGIS ST_AsText(geom) ou calcular tamanho com ST_Length(geom).',
      },
    ],
  },
  {
    step: 4,
    title: 'Back-end: SISMOB Boilerplate (NestJS)',
    summary: 'Arquitetura em 3 camadas, Docker Compose, Swagger e as 7 etapas para criar um novo recurso.',
    content: `O SISMOB Boilerplate padroniza o desenvolvimento de APIs REST em NestJS com TypeScript, TypeORM e Docker.`,
    stepsToFeature: [
      'Passo 1: Criar a Entity (src/entity/veiculo.entity.ts)',
      'Passo 2: Criar o DTO (src/dto/create-veiculo.dto.ts) com validações (@IsString, @IsNotEmpty)',
      'Passo 3: Criar o Repository (src/repository/veiculo.repository.ts) com queries parametrizadas ($1, $2)',
      'Passo 4: Criar o Service (src/service/veiculo.service.ts) com as regras de negócio',
      'Passo 5: Criar o Controller (src/controller/veiculo.controller.ts) protegido por @UseGuards(JwtAuthGuard)',
      'Passo 6: Criar o Module (src/module/veiculo.module.ts)',
      'Passo 7: Importar no AppModule (src/app.module.ts)',
    ],
    dockerSetup: 'docker compose up -d (Postgres na 5432, pgAdmin na 5050, Swagger em http://localhost:8097/api/docs)',
  },
  {
    step: 5,
    title: 'Front-end: Arquitetura SUTINF (React + Vite)',
    summary: 'Separação estrita em 5 camadas, Regra das 50 Linhas, TypeScript rígido e o Desafio InfoÔnibus.',
    content: `Construído para funcionar na Web e Mobile (Capacitor) com a mesma base de código.`,
    layers: [
      { folder: '/screens', desc: 'Apenas renderização visual da tela. Proibido chamar APIs diretamente.' },
      { folder: '/hooks', desc: 'Cérebro da aplicação e controle de estado. Regra das 50 Linhas.' },
      { folder: '/services', desc: 'Chamadas HTTP externas com Axios/Fetch. Nenhuma lógica visual.' },
      { folder: '/components', desc: 'Componentes puros e reutilizáveis (Dumb Components).' },
      { folder: '/types', desc: 'Contratos estritos TypeScript. Proibido usar any.' },
    ],
  },
  {
    step: 6,
    title: 'O Desafio Prático: Novo "InfoÔnibus"',
    summary: 'Criação de interface integrada à API real de mobilidade urbana com mapa, paradas e GPS.',
    requirements: [
      'Campo de pesquisa com busca dinâmica de linhas integradas à API',
      'Exibição dos pontos de parada relacionados à linha',
      'Localização em tempo real dos veículos via GPS com atualização periódica',
      'Traçado espacial do itinerário no mapa interativo',
      'Ficha técnica descritiva completa com filtros interativos (empresa, tarifa, sentido)',
    ],
  },
  {
    step: 7,
    title: 'Do Zero a Desenvolvedor Júnior: Trilha de Aprofundamento',
    summary: 'Conceitos essenciais de Engenharia de Software, Dados, Infraestrutura e DevSecOps.',
    topics: [
      'Backend vs Frontend: Separação estrita de responsabilidades e contratos via JSON',
      'Single Page Application (SPA): Renderização no cliente sem recarregamento e Virtual DOM',
      'APIs RESTful e Autenticação JWT: Stateless, Headers Authorization Bearer, expiração e refresh tokens',
      'Data Warehouse vs Transacional: OLTP (bancos transacionais) vs OLAP (Qlik e analítica)',
      'Dados Espaciais (PostGIS): SRID 4326/3857, tipos Point, LineString, Polygon e índices espaciais GiST',
      'Mecânica do Git: Objetos (blob, tree, commit), Staging Area e resolução cirúrgica de conflitos',
      'DevSecOps & Docker: Contêineres imutáveis, OWASP Top 10 e prevenção de SQL Injection e XSS',
    ],
  },
];

export const QUIZZES: QuizBlockData[] = [
  {
    id: 'quiz-git',
    moduleId: 'git',
    title: 'Teste de Conhecimentos: Git & Engenharia Colaborativa',
    subtitle: 'Módulo 01 — Cultura DevSecOps, GitLab Flow e Boas Práticas',
    badge: 'Git & DevSecOps',
    description: 'Valide seu domínio sobre o fluxo de branches da SEMOB, merge requests, CI/CD runners e prevenção de desastres em repositórios.',
    passingScore: 75,
    questions: [
      {
        id: 'git-q1',
        category: 'Políticas de Branches',
        question: 'De acordo com as boas práticas da SEMOB/SUTINF, qual é a conduta correta em relação à branch principal (main/production)?',
        options: [
          { id: 'a', text: 'Desenvolvedores podem enviar commits diretos caso seja uma correção urgente de emergência.' },
          { id: 'b', text: 'A branch principal é sagrada; nunca se comita direto nela. Todo desenvolvimento é feito em branches isoladas e integrado via Merge Requests revisados.' },
          { id: 'c', text: 'Apenas estagiários precisam abrir MR; desenvolvedores efetivos podem realizar git push origin main.' },
          { id: 'd', text: 'Os commits devem ser feitos diretamente na production e depois mesclados para a branch staging.' },
        ],
        correctOptionId: 'b',
        explanation: 'Na SEMOB, a estabilidade e auditoria de sistemas públicos exigem que a branch principal seja protegida. Qualquer alteração deve passar obrigatoriamente por uma branch isolada (feature/ ou fix/) e ser aprovada via Merge Request (MR) com pipelines de validação.',
      },
      {
        id: 'git-q2',
        category: 'Segurança de Credenciais',
        question: 'Qual dos seguintes arquivos ou pastas NUNCA deve ser incluído em um commit ou enviado ao repositório remoto?',
        options: [
          { id: 'a', text: 'package.json e tsconfig.json' },
          { id: 'b', text: '.gitlab-ci.yml e Dockerfile' },
          { id: 'c', text: '.env (contendo senhas e chaves privadas) e a pasta node_modules/' },
          { id: 'd', text: 'README.md e arquivos de testes *.spec.ts' },
        ],
        correctOptionId: 'c',
        explanation: 'Arquivos .env contêm segredos, senhas de banco de dados e credenciais que jamais devem vazar em repositórios. A pasta node_modules/ contém dependências pesadas que devem ser gerenciadas via package-lock.json e instaladas via npm install.',
      },
      {
        id: 'git-q3',
        category: 'Arquitetura do Git',
        question: 'Quando você executa o comando `git add .`, para qual zona de trabalho seus arquivos são movidos?',
        options: [
          { id: 'a', text: 'Working Directory (Diretório de Trabalho)' },
          { id: 'b', text: 'Staging Area (ou Index)' },
          { id: 'c', text: 'Local Repository (.git commit history)' },
          { id: 'd', text: 'Remote Repository (GitLab da SEMOB)' },
        ],
        correctOptionId: 'b',
        explanation: 'O comando `git add` prepara as alterações e as move da área de trabalho (Working Directory) para a Staging Area (ou Index), aguardando serem seladas em um commit definitivo.',
      },
      {
        id: 'git-q4',
        category: 'CI/CD e Automação',
        question: 'No ecossistema GitLab da SEMOB, quem é responsável por automatizar a execução de testes, validações de linter e compilação do código a cada push?',
        options: [
          { id: 'a', text: 'O desenvolvedor manualmente via terminal do servidor SSH.' },
          { id: 'b', text: 'As Pipelines de CI/CD gerenciadas pelo arquivo .gitlab-ci.yml e executadas por GitLab Runners.' },
          { id: 'c', text: 'O pgAdmin conectado diretamente ao banco de dados.' },
          { id: 'd', text: 'O navegador do usuário durante a renderização no Swagger.' },
        ],
        correctOptionId: 'b',
        explanation: 'O arquivo `.gitlab-ci.yml` define as etapas do pipeline (build, test, security, deploy), que são orquestradas e executadas de forma autônoma por GitLab Runners nos servidores da secretaria.',
      },
      {
        id: 'git-q5',
        category: 'Resolução de Conflitos',
        question: 'Você precisa sincronizar sua branch de funcionalidade local com as atualizações recentes da branch remota `homologacao`. Qual é o fluxo correto?',
        options: [
          { id: 'a', text: 'Deletar a pasta local e clonar o repositório novamente do zero.' },
          { id: 'b', text: 'Executar git fetch e mesclar (git merge origin/homologacao), resolvendo eventuais conflitos antes de subir seu código.' },
          { id: 'c', text: 'Usar git push --force para sobrepor as mudanças dos outros colegas.' },
          { id: 'd', text: 'Comitar na main para forçar a atualização remota.' },
        ],
        correctOptionId: 'b',
        explanation: 'O fluxo saudável e colaborativo é buscar os dados remotos com `git fetch`, incorporar as mudanças da branch base (merge ou rebase) e testar a resolução de conflitos antes de submeter o Merge Request.',
      },
    ],
  },
  {
    id: 'quiz-sql',
    moduleId: 'sql',
    title: 'Teste de Conhecimentos: Engenharia de Dados & SQL',
    subtitle: 'Módulo 02 — PostgreSQL, PostGIS e Boas Práticas em Mobilidade Urbana',
    badge: 'SQL & PostGIS',
    description: 'Teste seus conhecimentos sobre queries, diferenças entre bancos de dev e produção, operadores de texto e manipulação de geometrias espaciais.',
    passingScore: 75,
    questions: [
      {
        id: 'sql-q1',
        category: 'Ambientes de Banco de Dados',
        question: 'Qual é a diferença fundamental entre o banco `bdg` e o banco `dados_mobilidade` na SEMOB-DF?',
        options: [
          { id: 'a', text: 'O bdg é Oracle e o dados_mobilidade é MongoDB.' },
          { id: 'b', text: 'O bdg é o ambiente de desenvolvimento e testes com dados estáticos, enquanto o dados_mobilidade é o banco de produção com injeção em tempo real de telemetria/GPS.' },
          { id: 'c', text: 'Não há diferença; ambos são usados indistintamente para testes pesados e DROP TABLE.' },
          { id: 'd', text: 'O dados_mobilidade serve apenas para salvar senhas de usuários e o bdg guarda os trajetos.' },
        ],
        correctOptionId: 'b',
        explanation: 'O `bdg` é o laboratório seguro da equipe para modelagem e homologação. Já o `dados_mobilidade` é o banco vivo de produção. Consultas não indexadas ou sem filtros nele podem comprometer os serviços de transporte em tempo real do DF!',
      },
      {
        id: 'sql-q2',
        category: 'Filtros com LIKE',
        question: 'Para buscar todas as linhas cujo nome contenha a palavra "Gama", independentemente de estar no início, meio ou fim, qual cláusula WHERE está correta no PostgreSQL?',
        options: [
          { id: 'a', text: "WHERE nome_linha = '*GAMA*'" },
          { id: 'b', text: "WHERE nome_linha LIKE '%GAMA%' (ou ILIKE para case-insensitive)" },
          { id: 'c', text: "WHERE nome_linha CONTAINS 'GAMA'" },
          { id: 'd', text: "WHERE nome_linha IN ('GAMA')" },
        ],
        correctOptionId: 'b',
        explanation: 'O operador `LIKE` com `%` antes e depois procura o padrão em qualquer posição da string. No PostgreSQL, `ILIKE` realiza a busca ignorando maiúsculas e minúsculas.',
      },
      {
        id: 'sql-q3',
        category: 'Dados Espaciais (PostGIS)',
        question: 'Ao consultar colunas do tipo geometry (como traçado de linhas e paradas), por que utilizamos funções como ST_AsText(geom) ou ST_Length(geom)?',
        options: [
          { id: 'a', text: 'Porque o banco de dados armazena geometrias em formato binário compacto (WKB), necessitando dessas funções para converter em texto legível (WKT) ou calcular métricas.' },
          { id: 'b', text: 'Porque o PostgreSQL não suporta SQL padrão sem essas funções.' },
          { id: 'c', text: 'Porque elas servem unicamente para criptografar as coordenadas geográficas contra ataques.' },
          { id: 'd', text: 'Porque o PostGIS só funciona se você transformar tudo em números inteiros.' },
        ],
        correctOptionId: 'a',
        explanation: 'O PostGIS armazena as geometrias em WKB (Well-Known Binary) para alta performance espacial. Funções como ST_AsText convertem para formato legível (LINESTRING, POINT) e ST_Length calcula a extensão geométrica real.',
      },
      {
        id: 'sql-q4',
        category: 'Ordenação e Limite',
        question: 'Qual consulta retorna com precisão a linha com a maior extensão cadastrada no sistema?',
        options: [
          { id: 'a', text: 'SELECT * FROM linhas WHERE extensao = MAX(extensao);' },
          { id: 'b', text: 'SELECT numero_linha, nome_linha, extensao FROM linhas ORDER BY extensao DESC LIMIT 1;' },
          { id: 'c', text: 'SELECT numero_linha, nome_linha, extensao FROM linhas ORDER BY extensao ASC;' },
          { id: 'd', text: 'SELECT AVG(extensao) FROM linhas GROUP BY numero_linha;' },
        ],
        correctOptionId: 'b',
        explanation: 'Ordenar por `extensao DESC` coloca as maiores extensões no topo, e `LIMIT 1` restringe o retorno ao primeiro registro da lista (o maior). Usar WHERE extensao = MAX(extensao) diretamente é sintaxe inválida no SQL (exige subquery).',
      },
      {
        id: 'sql-q5',
        category: 'Agrupamentos e Contagens',
        question: 'Como descobrir quantas linhas possuem mais de uma empresa permissionária operando em conjunto (operação compartilhada)?',
        options: [
          { id: 'a', text: 'SELECT numero_linha, COUNT(DISTINCT operadora) FROM linhas_operacao GROUP BY numero_linha HAVING COUNT(DISTINCT operadora) > 1;' },
          { id: 'b', text: 'SELECT numero_linha FROM linhas_operacao WHERE operadora > 1;' },
          { id: 'c', text: 'SELECT COUNT(*) FROM linhas_operacao WHERE DISTINCT = true;' },
          { id: 'd', text: 'SELECT operadora, SUM(linhas) FROM operadoras WHERE linhas >= 2;' },
        ],
        correctOptionId: 'a',
        explanation: 'Para filtrar o resultado de uma função de agregação como COUNT, deve-se agrupar por linha (`GROUP BY`) e utilizar a cláusula `HAVING COUNT(DISTINCT operadora) > 1`. O WHERE não filtra agregações pós-agrupamento.',
      },
    ],
  },
  {
    id: 'quiz-backend',
    moduleId: 'backend',
    title: 'Teste de Conhecimentos: Back-end NestJS (SISMOB)',
    subtitle: 'Módulo 03 — Arquitetura em Camadas, DTOs, Injeção e Segurança JWT',
    badge: 'NestJS & TypeORM',
    description: 'Comprove seu conhecimento sobre o SISMOB Boilerplate, a regra Entity vs. SQL Nativo Parametrizado, e o fluxo Controller -> Service -> Repository.',
    passingScore: 75,
    questions: [
      {
        id: 'back-q1',
        category: 'Arquitetura em Camadas',
        question: 'No padrão de arquitetura do SISMOB Boilerplate, qual das seguintes regras de responsabilidade é uma REGRA DE OURO obrigatória?',
        options: [
          { id: 'a', text: 'O Controller pode executar comandos SQL diretamente no banco caso a query seja simples.' },
          { id: 'b', text: 'O Controller apenas recebe requisições HTTP e repassa ao Service; NUNCA acessa o banco de dados diretamente.' },
          { id: 'c', text: 'O Repository deve conter as validações de interface com o usuário e retornar códigos HTTP 404.' },
          { id: 'd', text: 'O Service deve processar chamadas diretamente do navegador sem passar por rotas do Controller.' },
        ],
        correctOptionId: 'b',
        explanation: 'A arquitetura em 3 camadas exige separação estrita: Controller cuida de rotas/HTTP, Service concentra as regras de negócio, e Repository é o único autorizado a se comunicar com a persistência (banco de dados).',
      },
      {
        id: 'back-q2',
        category: 'Decisão Arquitetural: Entity vs SQL Nativo',
        question: 'Segundo o manual da SEMOB, quando se deve utilizar SQL Nativo Parametrizado em vez das entidades do ORM (TypeORM)?',
        options: [
          { id: 'a', text: 'Sempre, pois ORMs são proibidos na SUTINF.' },
          { id: 'b', text: 'Apenas quando o banco de dados estiver fora do ar.' },
          { id: 'c', text: 'Para consultas complexas, relatórios pesados, múltiplos JOINs ou agregações analíticas de alta performance.' },
          { id: 'd', text: 'Apenas para cadastrar novos usuários no sistema.' },
        ],
        correctOptionId: 'c',
        explanation: 'Usamos Entities do ORM para operações simples de CRUD em tabelas únicas. Para relatórios com múltiplos JOINs, consultas espaciais e agregações de alta performance, adota-se SQL Nativo Parametrizado no Repository para total controle de performance.',
      },
      {
        id: 'back-q3',
        category: 'Segurança contra SQL Injection',
        question: 'Qual é a forma segura e obrigatória de passar parâmetros em consultas nativas no Repository?',
        options: [
          { id: 'a', text: "Concatenação direta de strings: `SELECT * FROM veiculo WHERE placa = '` + placa + `'`" },
          { id: 'b', text: 'Template strings: `SELECT * FROM veiculo WHERE placa = ${placa}`' },
          { id: 'c', text: 'Queries parametrizadas com placeholders nativos: `query("SELECT * FROM veiculo WHERE placa = $1", [placa])`' },
          { id: 'd', text: 'Armazenar os parâmetros em variáveis globais antes de rodar o comando.' },
        ],
        correctOptionId: 'c',
        explanation: 'A passagem de parâmetros via placeholders ($1, $2 no PostgreSQL) delega a sanitização ao driver do banco, blindando completamente o sistema contra ataques devastadores de SQL Injection.',
      },
      {
        id: 'back-q4',
        category: 'Autenticação e Proteção de Rotas',
        question: 'Como um endpoint no NestJS é protegido para exigir que o cliente forneça um Bearer Token JWT válido no cabeçalho Authorization?',
        options: [
          { id: 'a', text: 'Adicionando `@UseGuards(JwtAuthGuard)` sobre a classe ou método do Controller.' },
          { id: 'b', text: 'Definindo `const token = true` no arquivo package.json.' },
          { id: 'c', text: 'Colocando uma senha pública no Swagger OpenAPI.' },
          { id: 'd', text: 'Utilizando a anotação `@PublicRoute()` no Service.' },
        ],
        correctOptionId: 'a',
        explanation: 'No NestJS, `@UseGuards(JwtAuthGuard)` intercepta a requisição HTTP antes do método do Controller, decodifica e valida a assinatura do JWT. Se inválido ou ausente, devolve automaticamente HTTP 401 Unauthorized.',
      },
      {
        id: 'back-q5',
        category: 'Fluxo das 7 Etapas',
        question: 'Ao criar um novo recurso (ex: Veículos) no SISMOB Boilerplate, qual é a ordem cronológica oficial do fluxo de desenvolvimento?',
        options: [
          { id: 'a', text: 'Controller -> DTO -> AppModule -> Module -> Repository -> Service -> Entity' },
          { id: 'b', text: 'Entity -> DTO -> Repository -> Service -> Controller -> Module -> Registro no AppModule' },
          { id: 'c', text: 'AppModule -> Docker -> Swagger -> Service -> Controller' },
          { id: 'd', text: 'DTO -> Controller -> Testes -> Entity -> Service' },
        ],
        correctOptionId: 'b',
        explanation: 'A ordem oficial constrói a base sólida primeiro: Entidade (tabela) -> DTOs (contratos de validação) -> Repositório (banco) -> Serviço (regras) -> Controller (rotas e guards) -> Módulo -> Registro no AppModule.',
      },
    ],
  },
  {
    id: 'quiz-frontend',
    moduleId: 'frontend',
    title: 'Teste de Conhecimentos: Front-end React & Arquitetura SUTINF',
    subtitle: 'Módulo 04 — As 5 Camadas, Regra das 50 Linhas, TypeScript e Desafio InfoÔnibus',
    badge: 'React & Vite SUTINF',
    description: 'Valide seu entendimento sobre a separação de responsabilidades no front-end, custom hooks, componentes desacoplados e consumo de APIs.',
    passingScore: 75,
    questions: [
      {
        id: 'front-q1',
        category: 'Modelo Mental em 5 Camadas',
        question: 'Em nossa arquitetura front-end oficial, uma tela (Screen dentro de `/screens`) tem permissão para fazer chamadas diretas de API via fetch ou axios?',
        options: [
          { id: 'a', text: 'Sim, telas são livres para buscar dados onde for mais rápido.' },
          { id: 'b', text: 'NÃO! Telas focam exclusivamente na renderização da interface (UI). Requisições externas são exclusividade da camada `/services`, consumidas pelo Custom Hook (`/hooks`).' },
          { id: 'c', text: 'Apenas telas que possuem formulários de login podem chamar a API diretamente.' },
          { id: 'd', text: 'Sim, desde que a chamada tenha menos de 3 linhas de código.' },
        ],
        correctOptionId: 'b',
        explanation: 'Na analogia do restaurante SUTINF: a Screen é o Salão do Restaurante. Ela recebe os pratos prontos do Garçom (Hook) e exibe aos clientes. Ela nunca entra na cozinha nem vai à feira buscar ingredientes (API)!',
      },
      {
        id: 'front-q2',
        category: 'Regra das 50 Linhas',
        question: 'O que dita a famosa "Regra das 50 Linhas" adotada no padrão front-end da SEMOB?',
        options: [
          { id: 'a', text: 'Nenhum arquivo do projeto pode ultrapassar 50 caracteres.' },
          { id: 'b', text: 'Se uma tela acumular mais de 50 linhas concentradas em lógica de estado/negócio, essa complexidade deve ser extraída imediatamente para um Custom Hook.' },
          { id: 'c', text: 'Todo componente React deve conter exatamente 50 linhas de código CSS embutido.' },
          { id: 'd', text: 'O backend não aceita respostas com mais de 50 linhas JSON.' },
        ],
        correctOptionId: 'b',
        explanation: 'A regra das 50 linhas preserva a legibilidade e manutenibilidade das telas, isolando o cérebro (estado, efeitos, filtros, cálculos) em um Hook desacoplado e reutilizável.',
      },
      {
        id: 'front-q3',
        category: 'Tipagem Estrita TypeScript',
        question: 'Qual é a diretriz oficial da SEMOB sobre o uso do tipo `any` no TypeScript?',
        options: [
          { id: 'a', text: 'O uso de `any` é terminantemente proibido para trafegar dados entre o Front e o Back; devem ser criadas interfaces em `/types`.' },
          { id: 'b', text: 'O tipo `any` é recomendado para evitar perda de tempo digitando interfaces.' },
          { id: 'c', text: 'O uso de `any` é obrigatório em todos os Custom Hooks.' },
          { id: 'd', text: 'É permitido usar `any` desde que haja um comentário explicando o motivo.' },
        ],
        correctOptionId: 'a',
        explanation: 'O uso de `any` anula os benefícios de segurança do TypeScript e esconde quebras de contrato de API. Toda resposta, entidade e prop deve ser rigorosamente tipada.',
      },
      {
        id: 'front-q4',
        category: 'Variáveis de Ambiente no Vite',
        question: 'Para que uma variável de ambiente definida no arquivo `.env` seja acessível no código front-end com Vite, qual prefixo é estritamente obrigatório?',
        options: [
          { id: 'a', text: 'REACT_APP_' },
          { id: 'b', text: 'NEXT_PUBLIC_' },
          { id: 'c', text: 'VITE_' },
          { id: 'd', text: 'SEMOB_API_' },
        ],
        correctOptionId: 'c',
        explanation: 'No Vite, apenas variáveis iniciadas com o prefixo `VITE_` (ex: `VITE_API_URL`) são expostas ao código do cliente através do objeto `import.meta.env`.',
      },
      {
        id: 'front-q5',
        category: 'Componentes Reutilizáveis',
        question: 'Qual é a principal característica de um "Dumb Component" (Componente Burro ou de Apresentação) dentro da pasta `/components`?',
        options: [
          { id: 'a', text: 'Ele acessa o banco de dados via SQL diretamente no navegador.' },
          { id: 'b', text: 'Ele é isolado, previsível e sem efeitos colaterais: recebe dados via props e emite eventos via callbacks.' },
          { id: 'c', text: 'Ele não pode receber propriedades (props).' },
          { id: 'd', text: 'Ele só pode ser renderizado em dispositivos mobile com Capacitor.' },
        ],
        correctOptionId: 'b',
        explanation: 'Dumb Components são peças de lego: não conhecem a regra de negócio global, não fazem requisições à rede e renderizam estritamente aquilo que recebem via props, facilitando testes e reuso.',
      },
    ],
  },
  {
    id: 'quiz-fundamentos',
    moduleId: 'fundamentos',
    title: 'Teste de Conhecimentos: Engenharia de Software & DevOps',
    subtitle: 'Módulo 05 — Do Zero a Desenvolvedor Júnior',
    badge: 'Engenharia & DevOps',
    description: 'Avalie seus conhecimentos conceituais sobre SPA, RESTful APIs, OLAP vs OLTP, contêineres Docker e segurança DevSecOps.',
    passingScore: 75,
    questions: [
      {
        id: 'fund-q1',
        category: 'Arquitetura Web',
        question: 'O que define uma Single Page Application (SPA) em comparação com aplicações web tradicionais baseadas em SSR (Server Side Rendering)?',
        options: [
          { id: 'a', text: 'Uma SPA tem apenas um arquivo HTML e nunca muda de tela.' },
          { id: 'b', text: 'Uma SPA carrega uma única página HTML inicial e atualiza dinamicamente o conteúdo via JavaScript/DOM sem necessidade de recarregar o navegador a cada navegação.' },
          { id: 'c', text: 'SPAs funcionam apenas offline sem conexão à internet.' },
          { id: 'd', text: 'SPAs não podem usar CSS ou imagens.' },
        ],
        correctOptionId: 'b',
        explanation: 'Em uma SPA, o roteamento e a renderização acontecem no navegador do usuário, proporcionando uma experiência instantânea, similar a um aplicativo nativo desktop ou mobile.',
      },
      {
        id: 'fund-q2',
        category: 'Bancos de Dados Analíticos vs Transacionais',
        question: 'Qual é a diferença conceitual entre sistemas OLTP (bancos transacionais) e OLAP (Data Warehouse / BI como o Qlik)?',
        options: [
          { id: 'a', text: 'OLTP é otimizado para operações rápidas e concorrentes de escrita/leitura pontual (ex: registro de viagens de ônibus); OLAP é otimizado para consultas analíticas pesadas e agregações históricas complexas.' },
          { id: 'b', text: 'OLTP armazena imagens e OLAP armazena texto.' },
          { id: 'c', text: 'OLAP é usado no front-end e OLTP no back-end.' },
          { id: 'd', text: 'Não há diferença conceitual.' },
        ],
        correctOptionId: 'a',
        explanation: 'OLTP (Online Transaction Processing) atende às transações imediatas do dia a dia da secretaria sem engargalar. OLAP (Online Analytical Processing) consolida dados em massa para dashboards e inteligência no Qlik.',
      },
      {
        id: 'fund-q3',
        category: 'Containerização Docker',
        question: 'Qual é a principal vantagem de empacotar o banco PostgreSQL e pgAdmin usando o `docker-compose.yml` no projeto?',
        options: [
          { id: 'a', text: 'Garantir que o ambiente de desenvolvimento seja idêntico para todos os estagiários e desenvolvedores, evitando problemas de versão de sistema operacional ("na minha máquina funciona").' },
          { id: 'b', text: 'Aumentar o consumo de memória RAM do computador.' },
          { id: 'c', text: 'Impedir que o código TypeScript seja compilado.' },
          { id: 'd', text: 'Permitir rodar código sem ter o Node.js instalado.' },
        ],
        correctOptionId: 'a',
        explanation: 'Contêineres Docker isolam o ambiente e garantem reprodutibilidade perfeita: mesma versão do PostgreSQL (15), mesmas portas, mesmas extensões PostGIS e pgAdmin prontos em um único comando.',
      },
      {
        id: 'fund-q4',
        category: 'Mobile Híbrido com Capacitor',
        question: 'Como o Capacitor (utilizado nos projetos mobile da SEMOB) permite transformar uma aplicação React web em um aplicativo móvel Android/iOS?',
        options: [
          { id: 'a', text: 'Ele reescreve todo o código JavaScript em linguagem Assembly.' },
          { id: 'b', text: 'Ele empacota o código web dentro de uma WebView nativa ultrarrápida e fornece pontes (bridges) para acessar recursos nativos de hardware como GPS, câmera e armazenamento.' },
          { id: 'c', text: 'Ele apenas tira prints da tela e envia para as lojas de aplicativos.' },
          { id: 'd', text: 'Ele obriga o usuário a abrir o Google Chrome no celular manualmente.' },
        ],
        correctOptionId: 'b',
        explanation: 'O Capacitor conecta o ecossistema Web (React/Vite) ao sistema operacional móvel, viabilizando o uso de uma única base de código tanto para navegadores quanto para celulares de fiscais e cidadãos.',
      },
    ],
  },
];

export const SQL_CHALLENGE_QUESTIONS: SqlQuestion[] = [
  // PARTE I: LINHA 0.111
  {
    id: 'sql-a',
    letter: 'a',
    category: 'Parte I: Linha 0.111',
    difficulty: 'Fácil',
    title: 'Listagem de Linhas Disponíveis',
    objective: 'Liste as linhas de ônibus disponíveis, trazendo apenas o nome e o número da linha.',
    officialQuery: `SELECT numero_linha, nome_linha
FROM linhas_onibus
ORDER BY numero_linha ASC;`,
    logicExplanation: 'Uso de projeção explícita de colunas (em vez de SELECT *), ordenando crescentemente pelo número da linha para apresentação organizada.',
    trapsAndTips: 'Evite SELECT * em tabelas grandes. Trazer apenas os campos necessários reduz tráfego de rede e melhora tempo de resposta da API.',
  },
  {
    id: 'sql-b',
    letter: 'b',
    category: 'Parte I: Linha 0.111',
    difficulty: 'Fácil',
    title: 'Dados Específicos da Linha 0.111',
    objective: 'Apresente o nome, código e extensão especificamente da linha 0.111.',
    officialQuery: `SELECT id_linha, numero_linha, nome_linha, extensao_km
FROM linhas_onibus
WHERE numero_linha = '0.111';`,
    logicExplanation: 'Filtro pontual exato utilizando igualdade no WHERE. Como numero_linha é VARCHAR (pode conter pontos ou letras), o valor deve estar entre aspas simples.',
    trapsAndTips: 'Se numero_linha estiver indexado por B-Tree, essa consulta é executada em submilissegundos via Index Scan.',
  },
  {
    id: 'sql-c',
    letter: 'c',
    category: 'Parte I: Linha 0.111',
    difficulty: 'Fácil',
    title: 'Extensão Total da Linha 0.111',
    objective: 'Qual é a extensão total da linha 0.111?',
    officialQuery: `SELECT numero_linha, SUM(extensao_km) AS extensao_total_km
FROM linhas_trajetos
WHERE numero_linha = '0.111'
GROUP BY numero_linha;`,
    logicExplanation: 'Caso a linha possua múltiplos sentidos ou variantes, a extensão total é a somatória (SUM) dos segmentos individuais.',
    trapsAndTips: 'Verifique se a extensão na sua tabela já é a soma dos sentidos ou se está fragmentada por itinerário.',
  },
  {
    id: 'sql-d',
    letter: 'd',
    category: 'Parte I: Linha 0.111',
    difficulty: 'Médio',
    title: 'Traçado Espacial (Geometria) PostGIS',
    objective: 'Qual o traçado espacial (geometria) da linha 0.111?',
    officialQuery: `SELECT numero_linha, ST_AsText(geometria) AS wkt_tracado, ST_Length(geometria::geography) / 1000.0 AS extensao_calculada_km
FROM linhas_geometria
WHERE numero_linha = '0.111';`,
    logicExplanation: 'Uso da função PostGIS ST_AsText para converter o formato binário (WKB) em texto legível (WKT - Well-Known Text), permitindo exportar em GeoJSON ou visualizar no QGIS/Leaflet.',
    trapsAndTips: 'Para calcular comprimentos em metros/km com precisão na superfície da Terra, converta a geometria para geography (WGS84).',
  },
  {
    id: 'sql-e',
    letter: 'e',
    category: 'Parte I: Linha 0.111',
    difficulty: 'Fácil',
    title: 'Itinerário Descritivo em Formato de Texto',
    objective: 'Qual é o itinerário em formato de texto descritivo da linha 0.111?',
    officialQuery: `SELECT numero_linha, itinerario_descricao
FROM linhas_itinerarios
WHERE numero_linha = '0.111';`,
    logicExplanation: 'Recupera o texto cadastrado com a sequência de vias e pontos de referência (ex: "Terminal Asa Sul / W3 Sul / W3 Norte / Terminal Asa Norte").',
    trapsAndTips: 'Textos longos podem conter quebras de linha (\\n) que devem ser tratadas adequadamente no front-end.',
  },
  {
    id: 'sql-f',
    letter: 'f',
    category: 'Parte I: Linha 0.111',
    difficulty: 'Fácil',
    title: 'Valor Atual da Tarifa',
    objective: 'Qual o valor atual da tarifa da linha 0.111?',
    officialQuery: `SELECT l.numero_linha, t.valor_tarifa, t.data_vigencia
FROM linhas_onibus l
INNER JOIN tarifas t ON l.codigo_tarifa = t.codigo_tarifa
WHERE l.numero_linha = '0.111'
  AND t.ativo = TRUE
ORDER BY t.data_vigencia DESC
LIMIT 1;`,
    logicExplanation: 'Junção com a tabela de tarifas vigentes, garantindo que o valor obtido seja o ativo na data corrente.',
    trapsAndTips: 'Cuidado ao consultar tarifas sem filtrar pela data de vigência ativa, para não retornar valores legados desatualizados.',
  },
  {
    id: 'sql-g',
    letter: 'g',
    category: 'Parte I: Linha 0.111',
    difficulty: 'Médio',
    title: 'Horários de Operação Detalhados',
    objective: 'Quais são os horários de operação da linha 0.111, detalhados por dia da semana e ordem de partida?',
    officialQuery: `SELECT dia_semana, ordem_partida, horario_saida
FROM quadro_horarios
WHERE numero_linha = '0.111'
ORDER BY 
  CASE dia_semana 
    WHEN 'DIAS ÚTEIS' THEN 1 
    WHEN 'SÁBADO' THEN 2 
    WHEN 'DOMINGO' THEN 3 
    ELSE 4 
  END,
  horario_saida ASC;`,
    logicExplanation: 'Uso de ordenação customizada via CASE WHEN para agrupar primeiro dias úteis, seguidos de sábados e domingos/feriados.',
    trapsAndTips: 'Ordenar strings de dias da semana em ordem alfabética quebra a coerência do calendário. Sempre use mapeamento numérico!',
  },
  {
    id: 'sql-h',
    letter: 'h',
    category: 'Parte I: Linha 0.111',
    difficulty: 'Fácil',
    title: 'Empresa Permissionária Operadora',
    objective: 'Qual empresa permissionária opera a linha 0.111?',
    officialQuery: `SELECT l.numero_linha, e.nome_fantasia AS empresa_operadora, e.cnpj
FROM linhas_onibus l
INNER JOIN operadoras e ON l.id_operadora = e.id_operadora
WHERE l.numero_linha = '0.111';`,
    logicExplanation: 'Junção relacional entre a linha e a tabela de operadoras/bacias concessionárias do Distrito Federal.',
    trapsAndTips: 'No DF, linhas podem ter operação compartilhada entre bacias distintas. Sempre cheque se há mais de um registro retornado.',
  },

  // PARTE II: SENTIDOS (LINHA 0.170)
  {
    id: 'sql-i',
    letter: 'i',
    category: 'Parte II: Sentidos 0.170',
    difficulty: 'Fácil',
    title: 'Dados Gerais da Linha 0.170',
    objective: 'Apresente o nome, código e extensão da linha 0.170.',
    officialQuery: `SELECT id_linha, numero_linha, nome_linha, extensao_km
FROM linhas_onibus
WHERE numero_linha = '0.170';`,
    logicExplanation: 'Consulta pontual na tabela cadastral principal.',
    trapsAndTips: 'A linha 0.170 liga regiões populosas de alta demanda; analise se a extensão reflete a média ou o percurso completo.',
  },
  {
    id: 'sql-j',
    letter: 'j',
    category: 'Parte II: Sentidos 0.170',
    difficulty: 'Médio',
    title: 'Extensão Separada por Sentido (Ida/Volta)',
    objective: 'Qual a extensão da linha 0.170, separada por sentido (ida/volta)?',
    officialQuery: `SELECT sentido, extensao_km
FROM trajetos_linha
WHERE numero_linha = '0.170'
ORDER BY sentido ASC;`,
    logicExplanation: 'Diferenciação clara entre ida (ex: Sentido 1) e volta (ex: Sentido 2), pois raramente ambos os percursos possuem quilometragem idêntica.',
    trapsAndTips: 'Muitas linhas urbanas adotam anéis viários distintos na ida e na volta, gerando diferenças significativas de extensão.',
  },
  {
    id: 'sql-k',
    letter: 'k',
    category: 'Parte II: Sentidos 0.170',
    difficulty: 'Avançado',
    title: 'Traçado Espacial Segmentado por Sentido',
    objective: 'Qual o traçado espacial da linha 0.170, segmentado por sentido?',
    officialQuery: `SELECT sentido, ST_AsText(geometria) AS wkt_tracado, ST_Length(geometria::geography) AS distancia_metros
FROM trajetos_espaciais
WHERE numero_linha = '0.170'
ORDER BY sentido;`,
    logicExplanation: 'Extração das geometrias LINESTRING específicas de ida e volta para plotagem com cores diferenciadas no mapa do InfoÔnibus.',
    trapsAndTips: 'Ao renderizar no mapa, garanta que cada sentido possua uma cor visual distinta (ex: Azul para Ida e Laranja para Volta).',
  },
  {
    id: 'sql-l',
    letter: 'l',
    category: 'Parte II: Sentidos 0.170',
    difficulty: 'Fácil',
    title: 'Itinerário Descritivo por Sentido',
    objective: 'Qual o itinerário em formato de texto da linha 0.170, por sentido?',
    officialQuery: `SELECT sentido, itinerario_texto
FROM trajetos_linha
WHERE numero_linha = '0.170'
ORDER BY sentido;`,
    logicExplanation: 'Apresenta a listagem descritiva de avenidas, terminais e referências para cada direção.',
    trapsAndTips: 'Esses textos alimentam as placas frontais dos veículos e a busca por vias no portal público.',
  },
  {
    id: 'sql-m',
    letter: 'm',
    category: 'Parte II: Sentidos 0.170',
    difficulty: 'Fácil',
    title: 'Tarifa da Linha 0.170',
    objective: 'Qual o valor da tarifa da linha 0.170?',
    officialQuery: `SELECT valor_tarifa
FROM linhas_onibus l
JOIN tarifas t ON l.codigo_tarifa = t.codigo_tarifa
WHERE l.numero_linha = '0.170' AND t.ativo = TRUE;`,
    logicExplanation: 'Identificação da faixa tarifária integrada do STPC/DF (ex: R$ 5,50 para linhas de longa distância).',
    trapsAndTips: 'O DF possui faixas tarifárias padronizadas: circular interna, ligação curta e integração metropolitana.',
  },
  {
    id: 'sql-n',
    letter: 'n',
    category: 'Parte II: Sentidos 0.170',
    difficulty: 'Médio',
    title: 'Horários Agrupados por Sentido',
    objective: 'Quais são os horários (por dia da semana e ordem de partida) da linha 0.170, agrupados por sentido?',
    officialQuery: `SELECT sentido, dia_semana, ordem_partida, horario_partida
FROM quadro_horarios
WHERE numero_linha = '0.170'
ORDER BY sentido, dia_semana, horario_partida ASC;`,
    logicExplanation: 'Agrupamento e ordenação permitindo identificar os picos de partidas na ida (manhã) e na volta (fim de tarde).',
    trapsAndTips: 'Cruzar horários com o sentido é vital para dimensionar frota e fiscalizar cumprimento de tabela operacional.',
  },
  {
    id: 'sql-o',
    letter: 'o',
    category: 'Parte II: Sentidos 0.170',
    difficulty: 'Fácil',
    title: 'Empresa Operadora da Linha 0.170',
    objective: 'Qual empresa opera a linha 0.170?',
    officialQuery: `SELECT e.nome_fantasia, e.bacia_operacional
FROM linhas_onibus l
JOIN operadoras e ON l.id_operadora = e.id_operadora
WHERE l.numero_linha = '0.170';`,
    logicExplanation: 'Retorna a concessionária da respectiva Bacia Operacional do DF.',
    trapsAndTips: 'Cada bacia do DF cobre regiões administrativas específicas (Piracicabana, Pioneira, Urbi, Marechal, São José).',
  },

  // PARTE III: CRUZAMENTOS GERAIS
  {
    id: 'sql-p',
    letter: 'p',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Médio',
    title: 'Linhas com Extensão Superior a 70 km',
    objective: 'Quais linhas do sistema possuem uma extensão superior a 70 km?',
    officialQuery: `SELECT numero_linha, nome_linha, extensao_km
FROM linhas_onibus
WHERE extensao_km > 70
ORDER BY extensao_km DESC;`,
    logicExplanation: 'Filtro numérico simples com ordenação decrescente para identificar trajetos inter-regionais longos.',
    trapsAndTips: 'Essas linhas normalmente ligam regiões satélites extremas (ex: Planaltina, Brazlândia, Santa Maria) ao Plano Piloto.',
  },
  {
    id: 'sql-q',
    letter: 'q',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Médio',
    title: 'Linha Mais Curta de Todo o Sistema',
    objective: 'Qual é a linha de ônibus mais curta de todo o sistema?',
    officialQuery: `SELECT numero_linha, nome_linha, extensao_km
FROM linhas_onibus
WHERE extensao_km > 0
ORDER BY extensao_km ASC
LIMIT 1;`,
    logicExplanation: 'Ordenação crescente filtrando extensões nulas ou inválidas (extensao_km > 0) para achar a linha mais curta.',
    trapsAndTips: 'Sempre adicione WHERE extensao_km > 0 para evitar falsos positivos com dados incompletos ou em cadastro.',
  },
  {
    id: 'sql-r',
    letter: 'r',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Médio',
    title: 'Linha Mais Longa de Todo o Sistema',
    objective: 'Qual é a linha de ônibus mais longa do sistema?',
    officialQuery: `SELECT numero_linha, nome_linha, extensao_km
FROM linhas_onibus
ORDER BY extensao_km DESC
LIMIT 1;`,
    logicExplanation: 'Ordenação decrescente com LIMIT 1.',
    trapsAndTips: 'Essa consulta responde diretamente a demandas estratégicas da diretoria de transporte.',
  },
  {
    id: 'sql-s',
    letter: 's',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Fácil',
    title: 'Quantidade Total de Linhas Circulares',
    objective: 'Quantas linhas no total operam no formato "circular"?',
    officialQuery: `SELECT COUNT(*) AS total_linhas_circulares
FROM linhas_onibus
WHERE LOWER(tipo_servico) = 'circular' OR LOWER(nome_linha) LIKE '%circular%';`,
    logicExplanation: 'Função de contagem COUNT(*) combinada com padronização de caixa (LOWER) para capturar variações cadastrais.',
    trapsAndTips: 'Linhas circulares não possuem ponto terminal de retorno separado; operam em circuito contínuo.',
  },
  {
    id: 'sql-t',
    letter: 't',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Médio',
    title: 'Linha Circular com Maior Extensão',
    objective: 'Dentre as linhas de sentido circular, qual possui a maior extensão?',
    officialQuery: `SELECT numero_linha, nome_linha, extensao_km
FROM linhas_onibus
WHERE LOWER(tipo_servico) = 'circular' OR LOWER(nome_linha) LIKE '%circular%'
ORDER BY extensao_km DESC
LIMIT 1;`,
    logicExplanation: 'Combinação de filtro específico para o tipo de serviço circular com ordenação decrescente de quilometragem.',
    trapsAndTips: 'Diferencie circulares locais de bairro (curtas) de grandes anéis alimentadores do metrô/BRT.',
  },
  {
    id: 'sql-u',
    letter: 'u',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Fácil',
    title: 'Linhas com Tarifa Exata de R$ 5,50',
    objective: 'Quais linhas possuem a tarifa exata de R$ 5,50?',
    officialQuery: `SELECT l.numero_linha, l.nome_linha, t.valor_tarifa
FROM linhas_onibus l
JOIN tarifas t ON l.codigo_tarifa = t.codigo_tarifa
WHERE t.valor_tarifa = 5.50 AND t.ativo = TRUE
ORDER BY l.numero_linha;`,
    logicExplanation: 'Filtro pela faixa tarifária metropolitana máxima do DF.',
    trapsAndTips: 'Em colunas monetárias (DECIMAL/NUMERIC), evite comparar floats imprecisos; utilize valores com precisão decimal exata.',
  },
  {
    id: 'sql-v',
    letter: 'v',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Fácil',
    title: 'Linhas Operadas pela "Piracicabana"',
    objective: 'Quais linhas são operadas especificamente pela empresa "Piracicabana"?',
    officialQuery: `SELECT l.numero_linha, l.nome_linha, e.nome_fantasia
FROM linhas_onibus l
JOIN operadoras e ON l.id_operadora = e.id_operadora
WHERE e.nome_fantasia ILIKE '%Piracicabana%'
ORDER BY l.numero_linha;`,
    logicExplanation: 'Junção com filtro por nome da concessionária usando ILIKE para segurança contra variações de maiúsculas/minúsculas.',
    trapsAndTips: 'A Bacia 1 cobre a Asa Sul, Asa Norte, Sobradinho, Planaltina e áreas centrais de Brasília.',
  },
  {
    id: 'sql-w',
    letter: 'w',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Fácil',
    title: 'Linhas com a Palavra "Gama" na Nomenclatura',
    objective: 'Quais linhas contêm a palavra "Gama" em sua nomenclatura?',
    officialQuery: `SELECT numero_linha, nome_linha
FROM linhas_onibus
WHERE nome_linha ILIKE '%Gama%'
ORDER BY numero_linha;`,
    logicExplanation: 'Busca textual flexível com wildcards (%) e operador insensível a caixa ILIKE.',
    trapsAndTips: 'Útil para alimentar filtros rápidos de cidades/regiões administrativas em portais de atendimento ao cidadão.',
  },
  {
    id: 'sql-x',
    letter: 'x',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Avançado',
    title: 'Linhas com Operação Compartilhada (Múltiplas Empresas)',
    objective: 'Quais linhas do sistema possuem operação compartilhada (mais de uma empresa operando)?',
    officialQuery: `SELECT numero_linha, COUNT(DISTINCT id_operadora) AS total_operadoras
FROM linhas_operacao
GROUP BY numero_linha
HAVING COUNT(DISTINCT id_operadora) > 1
ORDER BY total_operadoras DESC, numero_linha ASC;`,
    logicExplanation: 'Uso de GROUP BY acompanhado de HAVING com contagem distinta (COUNT DISTINCT) para detectar linhas com mais de uma concessionária.',
    trapsAndTips: 'Excelente exemplo para demonstrar a diferença entre WHERE (filtro de linhas brutas) e HAVING (filtro de grupos agregados).',
  },
  {
    id: 'sql-y',
    letter: 'y',
    category: 'Parte III: Cruzamentos Gerais',
    difficulty: 'Médio',
    title: 'Linhas do Sistema Noturno (Madrugada: 00h00 às 04h00)',
    objective: 'Quais linhas compõem o sistema noturno e operam de madrugada (com partidas entre 00h00 e 04h00)?',
    officialQuery: `SELECT DISTINCT l.numero_linha, l.nome_linha
FROM linhas_onibus l
JOIN quadro_horarios q ON l.numero_linha = q.numero_linha
WHERE q.horario_partida >= '00:00:00' AND q.horario_partida <= '04:00:00'
ORDER BY l.numero_linha;`,
    logicExplanation: 'Filtro por faixa temporal com DISTINCT para listar cada linha apenas uma vez, mesmo tendo várias partidas de madrugada.',
    trapsAndTips: 'Usar DISTINCT ou GROUP BY é fundamental para que a linha não apareça dezenas de vezes se tiver muitos horários no período.',
  },
];
