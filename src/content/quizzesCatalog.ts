import { QuizBlockData, QuizQuestion } from '../types';

export const QUIZZES_BLOCKS: QuizBlockData[] = [
  {
    id: 'quiz-git',
    moduleId: 'git',
    title: 'Teste de Conhecimentos: Git & Engenharia Colaborativa',
    subtitle: 'Módulo 01 — Cultura DevSecOps, GitLab Flow e Boas Práticas',
    badge: 'Git & DevSecOps',
    description:
      'Valide seu domínio sobre o fluxo de branches da SEMOB, merge requests, CI/CD runners e prevenção de desastres em repositórios.',
    passingScore: 75,
    questions: [
      {
        id: 'git-q1',
        moduleId: 'git',
        category: 'Políticas de Branches',
        question:
          'De acordo com as boas práticas da SEMOB/SUTINF, qual é a conduta correta em relação à branch principal (main/production)?',
        options: [
          { id: 'a', text: 'Desenvolvedores podem enviar commits diretos caso seja uma correção urgente de emergência.' },
          {
            id: 'b',
            text: 'A branch principal é sagrada; nunca se comita direto nela. Todo desenvolvimento é feito em branches isoladas e integrado via Merge Requests revisados.',
          },
          { id: 'c', text: 'Apenas estagiários precisam abrir MR; desenvolvedores efetivos podem realizar git push origin main.' },
          { id: 'd', text: 'Os commits devem ser feitos diretamente na production e depois mesclados para a branch staging.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'Na SEMOB, a estabilidade e auditoria de sistemas públicos exigem que a branch principal seja protegida. Qualquer alteração deve passar obrigatoriamente por uma branch isolada (feature/ ou fix/) e ser aprovada via Merge Request (MR) com pipelines de validação.',
      },
      {
        id: 'git-q2',
        moduleId: 'git',
        category: 'Segurança de Credenciais',
        question:
          'Qual dos seguintes arquivos ou pastas NUNCA deve ser incluído em um commit ou enviado ao repositório remoto?',
        options: [
          { id: 'a', text: 'package.json e tsconfig.json' },
          { id: 'b', text: '.gitlab-ci.yml e Dockerfile' },
          { id: 'c', text: '.env (contendo senhas e chaves privadas) e a pasta node_modules/' },
          { id: 'd', text: 'README.md e arquivos de testes *.spec.ts' },
        ],
        correctOptionId: 'c',
        correctOptionIndex: 2,
        explanation:
          'Arquivos .env contêm segredos, senhas de banco de dados e credenciais que jamais devem vazar em repositórios. A pasta node_modules/ contém dependências pesadas que devem ser gerenciadas via package-lock.json e instaladas via npm install.',
      },
      {
        id: 'git-q3',
        moduleId: 'git',
        category: 'Arquitetura do Git',
        question:
          'Quando você executa o comando `git add .`, para qual zona de trabalho seus arquivos são movidos?',
        options: [
          { id: 'a', text: 'Working Directory (Diretório de Trabalho)' },
          { id: 'b', text: 'Staging Area (ou Index)' },
          { id: 'c', text: 'Local Repository (.git commit history)' },
          { id: 'd', text: 'Remote Repository (GitLab da SEMOB)' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'O comando `git add` prepara as alterações e as move da área de trabalho (Working Directory) para a Staging Area (ou Index), aguardando serem seladas em um commit definitivo.',
      },
      {
        id: 'git-q4',
        moduleId: 'git',
        category: 'CI/CD e Automação',
        question:
          'No ecossistema GitLab da SEMOB, quem é responsável por automatizar a execução de testes, validações de linter e compilação do código a cada push?',
        options: [
          { id: 'a', text: 'O desenvolvedor manualmente via terminal do servidor SSH.' },
          {
            id: 'b',
            text: 'As Pipelines de CI/CD gerenciadas pelo arquivo .gitlab-ci.yml e executadas por GitLab Runners.',
          },
          { id: 'c', text: 'O pgAdmin conectado diretamente ao banco de dados.' },
          { id: 'd', text: 'O navegador do usuário durante a renderização no Swagger.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'O arquivo `.gitlab-ci.yml` define as etapas do pipeline (build, test, security, deploy), que são orquestradas e executadas de forma autônoma por GitLab Runners nos servidores da secretaria.',
      },
      {
        id: 'git-q5',
        moduleId: 'git',
        category: 'Resolução de Conflitos',
        question:
          'Você precisa sincronizar sua branch de funcionalidade local com as atualizações recentes da branch remota `homologacao`. Qual é o fluxo correto?',
        options: [
          { id: 'a', text: 'Deletar a pasta local e clonar o repositório novamente do zero.' },
          {
            id: 'b',
            text: 'Executar git fetch e mesclar (git merge origin/homologacao), resolvendo eventuais conflitos antes de subir seu código.',
          },
          { id: 'c', text: 'Usar git push --force para sobrepor as mudanças dos outros colegas.' },
          { id: 'd', text: 'Comitar na main para forçar a atualização remota.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'O fluxo saudável e colaborativo é buscar os dados remotos com `git fetch`, incorporar as mudanças da branch base (merge ou rebase) e testar a resolução de conflitos antes de submeter o Merge Request.',
      },
    ],
  },
  {
    id: 'quiz-sql',
    moduleId: 'sql',
    title: 'Teste de Conhecimentos: Engenharia de Dados & SQL',
    subtitle: 'Módulo 02 — PostgreSQL, PostGIS e Boas Práticas em Mobilidade Urbana',
    badge: 'SQL & PostGIS',
    description:
      'Teste seus conhecimentos sobre queries, diferenças entre bancos de dev e produção, operadores de texto e manipulação de geometrias espaciais.',
    passingScore: 75,
    questions: [
      {
        id: 'sql-q1',
        moduleId: 'sql',
        category: 'Ambientes de Banco de Dados',
        question:
          'Qual é a diferença fundamental entre o banco `bdg` e o banco `dados_mobilidade` na SEMOB-DF?',
        options: [
          { id: 'a', text: 'O bdg é Oracle e o dados_mobilidade é MongoDB.' },
          {
            id: 'b',
            text: 'O bdg é o ambiente de desenvolvimento e testes com dados estáticos, enquanto o dados_mobilidade é o banco de produção com injeção em tempo real de telemetria/GPS.',
          },
          { id: 'c', text: 'Não há diferença; ambos são usados indistintamente para testes pesados e DROP TABLE.' },
          { id: 'd', text: 'O dados_mobilidade serve apenas para salvar senhas de usuários e o bdg guarda os trajetos.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'O `bdg` é o laboratório seguro da equipe para modelagem e homologação. Já o `dados_mobilidade` é o banco vivo de produção. Consultas não indexadas ou sem filtros nele podem comprometer os serviços de transporte em tempo real do DF!',
      },
      {
        id: 'sql-q2',
        moduleId: 'sql',
        category: 'Filtros com LIKE',
        question:
          'Para buscar todas as linhas cujo nome contenha a palavra "Gama", independentemente de estar no início, meio ou fim, qual cláusula WHERE está correta no PostgreSQL?',
        options: [
          { id: 'a', text: "WHERE nome_linha = '*GAMA*'" },
          { id: 'b', text: "WHERE nome_linha LIKE '%GAMA%' (ou ILIKE para case-insensitive)" },
          { id: 'c', text: "WHERE nome_linha CONTAINS 'GAMA'" },
          { id: 'd', text: "WHERE nome_linha IN ('GAMA')" },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'O operador `LIKE` com `%` antes e depois procura o padrão em qualquer posição da string. No PostgreSQL, `ILIKE` realiza a busca ignorando maiúsculas e minúsculas.',
      },
      {
        id: 'sql-q3',
        moduleId: 'sql',
        category: 'Dados Espaciais (PostGIS)',
        question:
          'Ao consultar colunas do tipo geometry (como traçado de linhas e paradas), por que utilizamos funções como ST_AsText(geom) ou ST_Length(geom)?',
        options: [
          {
            id: 'a',
            text: 'Porque o banco de dados armazena geometrias em formato binário compacto (WKB), necessitando dessas funções para converter em texto legível (WKT) ou calcular métricas.',
          },
          { id: 'b', text: 'Porque o PostgreSQL não suporta SQL padrão sem essas funções.' },
          { id: 'c', text: 'Porque elas servem unicamente para criptografar as coordenadas geográficas contra ataques.' },
          { id: 'd', text: 'Porque o PostGIS só funciona se você transformar tudo em números inteiros.' },
        ],
        correctOptionId: 'a',
        correctOptionIndex: 0,
        explanation:
          'O PostGIS armazena as geometrias em WKB (Well-Known Binary) para alta performance espacial. Funções como ST_AsText convertem para formato legível (LINESTRING, POINT) e ST_Length calcula a extensão geométrica real.',
      },
      {
        id: 'sql-q4',
        moduleId: 'sql',
        category: 'Ordenação e Limite',
        question:
          'Qual consulta retorna com precisão a linha com a maior extensão cadastrada no sistema?',
        options: [
          { id: 'a', text: 'SELECT * FROM linhas WHERE extensao = MAX(extensao);' },
          { id: 'b', text: 'SELECT numero_linha, nome_linha, extensao FROM linhas ORDER BY extensao DESC LIMIT 1;' },
          { id: 'c', text: 'SELECT numero_linha, nome_linha, extensao FROM linhas ORDER BY extensao ASC;' },
          { id: 'd', text: 'SELECT AVG(extensao) FROM linhas GROUP BY numero_linha;' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'Ordenar por `extensao DESC` coloca as maiores extensões no topo, e `LIMIT 1` restringe o retorno ao primeiro registro da lista (o maior). Usar WHERE extensao = MAX(extensao) diretamente é sintaxe inválida no SQL (exige subquery).',
      },
      {
        id: 'sql-q5',
        moduleId: 'sql',
        category: 'Agrupamentos e Contagens',
        question:
          'Como descobrir quantas linhas possuem mais de uma empresa permissionária operando em conjunto (operação compartilhada)?',
        options: [
          {
            id: 'a',
            text: 'SELECT numero_linha, COUNT(DISTINCT operadora) FROM linhas_operacao GROUP BY numero_linha HAVING COUNT(DISTINCT operadora) > 1;',
          },
          { id: 'b', text: 'SELECT numero_linha FROM linhas_operacao WHERE operadora > 1;' },
          { id: 'c', text: 'SELECT COUNT(*) FROM linhas_operacao WHERE DISTINCT = true;' },
          { id: 'd', text: 'SELECT operadora, SUM(linhas) FROM operadoras WHERE linhas >= 2;' },
        ],
        correctOptionId: 'a',
        correctOptionIndex: 0,
        explanation:
          'Para filtrar o resultado de uma função de agregação como COUNT, deve-se agrupar por linha (`GROUP BY`) e utilizar a cláusula `HAVING COUNT(DISTINCT operadora) > 1`. O WHERE não filtra agregações pós-agrupamento.',
      },
    ],
  },
  {
    id: 'quiz-backend',
    moduleId: 'backend',
    title: 'Teste de Conhecimentos: Back-end NestJS (SISMOB)',
    subtitle: 'Módulo 03 — Arquitetura em Camadas, DTOs, Injeção e Segurança JWT',
    badge: 'NestJS & TypeORM',
    description:
      'Comprove seu conhecimento sobre o SISMOB Boilerplate, a regra Entity vs. SQL Nativo Parametrizado, e o fluxo Controller -> Service -> Repository.',
    passingScore: 75,
    questions: [
      {
        id: 'back-q1',
        moduleId: 'backend',
        category: 'Arquitetura em Camadas',
        question:
          'No padrão de arquitetura do SISMOB Boilerplate, qual das seguintes regras de responsabilidade é uma REGRA DE OURO obrigatória?',
        options: [
          { id: 'a', text: 'O Controller pode executar comandos SQL diretamente no banco caso a query seja simples.' },
          {
            id: 'b',
            text: 'O Controller apenas recebe requisições HTTP e repassa ao Service; NUNCA acessa o banco de dados diretamente.',
          },
          { id: 'c', text: 'O Repository deve conter as validações de interface com o usuário e retornar códigos HTTP 404.' },
          { id: 'd', text: 'O Service deve processar chamadas diretamente do navegador sem passar por rotas do Controller.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'A arquitetura em 3 camadas exige separação estrita: Controller cuida de rotas/HTTP, Service concentra as regras de negócio, e Repository é o único autorizado a se comunicar com a persistência (banco de dados).',
      },
      {
        id: 'back-q2',
        moduleId: 'backend',
        category: 'Decisão Arquitetural: Entity vs SQL Nativo',
        question:
          'Segundo o manual da SEMOB, quando se deve utilizar SQL Nativo Parametrizado em vez das entidades do ORM (TypeORM)?',
        options: [
          { id: 'a', text: 'Sempre, pois ORMs são proibidos na SUTINF.' },
          { id: 'b', text: 'Apenas quando o banco de dados estiver fora do ar.' },
          {
            id: 'c',
            text: 'Para consultas complexas, relatórios pesados, múltiplos JOINs ou agregações analíticas de alta performance.',
          },
          { id: 'd', text: 'Apenas para cadastrar novos usuários no sistema.' },
        ],
        correctOptionId: 'c',
        correctOptionIndex: 2,
        explanation:
          'Usamos Entities do ORM para operações simples de CRUD em tabelas únicas. Para relatórios com múltiplos JOINs, consultas espaciais e agregações de alta performance, adota-se SQL Nativo Parametrizado no Repository para total controle de performance.',
      },
      {
        id: 'back-q3',
        moduleId: 'backend',
        category: 'Segurança contra SQL Injection',
        question:
          'Qual é a forma segura e obrigatória de passar parâmetros em consultas nativas no Repository?',
        options: [
          { id: 'a', text: "Concatenação direta de strings: `SELECT * FROM veiculo WHERE placa = '` + placa + `'`" },
          { id: 'b', text: 'Template strings: `SELECT * FROM veiculo WHERE placa = ${placa}`' },
          {
            id: 'c',
            text: 'Queries parametrizadas com placeholders nativos: `query("SELECT * FROM veiculo WHERE placa = $1", [placa])`',
          },
          { id: 'd', text: 'Armazenar os parâmetros em variáveis globais antes de rodar o comando.' },
        ],
        correctOptionId: 'c',
        correctOptionIndex: 2,
        explanation:
          'A passagem de parâmetros via placeholders ($1, $2 no PostgreSQL) delega a sanitização ao driver do banco, blindando completamente o sistema contra ataques devastadores de SQL Injection.',
      },
      {
        id: 'back-q4',
        moduleId: 'backend',
        category: 'Autenticação e Proteção de Rotas',
        question:
          'Como um endpoint no NestJS é protegido para exigir que o cliente forneça um Bearer Token JWT válido no cabeçalho Authorization?',
        options: [
          { id: 'a', text: 'Adicionando `@UseGuards(JwtAuthGuard)` sobre a classe ou método do Controller.' },
          { id: 'b', text: 'Definindo `const token = true` no arquivo package.json.' },
          { id: 'c', text: 'Colocando uma senha pública no Swagger OpenAPI.' },
          { id: 'd', text: 'Utilizando a anotação `@PublicRoute()` no Service.' },
        ],
        correctOptionId: 'a',
        correctOptionIndex: 0,
        explanation:
          'No NestJS, `@UseGuards(JwtAuthGuard)` intercepta a requisição HTTP antes do método do Controller, decodifica e valida a assinatura do JWT. Se inválido ou ausente, devolve automaticamente HTTP 401 Unauthorized.',
      },
      {
        id: 'back-q5',
        moduleId: 'backend',
        category: 'Fluxo das 7 Etapas',
        question:
          'Ao criar um novo recurso (ex: Veículos) no SISMOB Boilerplate, qual é a ordem cronológica oficial do fluxo de desenvolvimento?',
        options: [
          { id: 'a', text: 'Controller -> DTO -> AppModule -> Module -> Repository -> Service -> Entity' },
          {
            id: 'b',
            text: 'Entity -> DTO -> Repository -> Service -> Controller -> Module -> Registro no AppModule',
          },
          { id: 'c', text: 'AppModule -> Docker -> Swagger -> Service -> Controller' },
          { id: 'd', text: 'DTO -> Controller -> Testes -> Entity -> Service' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'A ordem oficial constrói a base sólida primeiro: Entidade (tabela) -> DTOs (contratos de validação) -> Repositório (banco) -> Serviço (regras) -> Controller (rotas e guards) -> Módulo -> Registro no AppModule.',
      },
    ],
  },
  {
    id: 'quiz-frontend',
    moduleId: 'frontend',
    title: 'Teste de Conhecimentos: Front-end React & Arquitetura SUTINF',
    subtitle: 'Módulo 04 — As 5 Camadas, Regra das 50 Linhas, TypeScript e Desafio InfoÔnibus',
    badge: 'React & Vite SUTINF',
    description:
      'Valide seu entendimento sobre a separação de responsabilidades no front-end, custom hooks, componentes desacoplados e consumo de APIs.',
    passingScore: 75,
    questions: [
      {
        id: 'front-q1',
        moduleId: 'frontend',
        category: 'Modelo Mental em 5 Camadas',
        question:
          'Em nossa arquitetura front-end oficial, uma tela (Screen dentro de `/screens`) tem permissão para fazer chamadas diretas de API via fetch ou axios?',
        options: [
          { id: 'a', text: 'Sim, telas são livres para buscar dados onde for mais rápido.' },
          {
            id: 'b',
            text: 'NÃO! Telas focam exclusivamente na renderização da interface (UI). Requisições externas são exclusividade da camada `/services`, consumidas pelo Custom Hook (`/hooks`).',
          },
          { id: 'c', text: 'Apenas telas que possuem formulários de login podem chamar a API diretamente.' },
          { id: 'd', text: 'Sim, desde que a chamada tenha menos de 3 linhas de código.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'Na analogia do restaurante SUTINF: a Screen é o Salão do Restaurante. Ela recebe os pratos prontos do Garçom (Hook) e exibe aos clientes. Ela nunca entra na cozinha nem vai à feira buscar ingredientes (API)!',
      },
      {
        id: 'front-q2',
        moduleId: 'frontend',
        category: 'Regra das 50 Linhas',
        question:
          'O que dita a famosa "Regra das 50 Linhas" adotada no padrão front-end da SEMOB?',
        options: [
          { id: 'a', text: 'Nenhum arquivo do projeto pode ultrapassar 50 caracteres.' },
          {
            id: 'b',
            text: 'Se uma tela acumular mais de 50 linhas concentradas em lógica de estado/negócio, essa complexidade deve ser extraída imediatamente para um Custom Hook.',
          },
          { id: 'c', text: 'Todo componente React deve conter exatamente 50 linhas de código CSS embutido.' },
          { id: 'd', text: 'O backend não aceita respostas com mais de 50 linhas JSON.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'A regra das 50 linhas preserva a legibilidade e manutenibilidade das telas, isolando o cérebro (estado, efeitos, filtros, cálculos) em um Hook desacoplado e reutilizável.',
      },
      {
        id: 'front-q3',
        moduleId: 'frontend',
        category: 'Tipagem Estrita TypeScript',
        question:
          'Qual é a diretriz oficial da SEMOB sobre o uso do tipo `any` no TypeScript?',
        options: [
          {
            id: 'a',
            text: 'O uso de `any` é terminantemente proibido para trafegar dados entre o Front e o Back; devem ser criadas interfaces em `/types`.',
          },
          { id: 'b', text: 'O tipo `any` é recomendado para evitar perda de tempo digitando interfaces.' },
          { id: 'c', text: 'O uso de `any` é obrigatório em todos os Custom Hooks.' },
          { id: 'd', text: 'É permitido usar `any` desde que haja um comentário explicando o motivo.' },
        ],
        correctOptionId: 'a',
        correctOptionIndex: 0,
        explanation:
          'O uso de `any` anula os benefícios de segurança do TypeScript e esconde quebras de contrato de API. Toda resposta, entidade e prop deve ser rigorosamente tipada.',
      },
      {
        id: 'front-q4',
        moduleId: 'frontend',
        category: 'Variáveis de Ambiente no Vite',
        question:
          'Para que uma variável de ambiente definida no arquivo `.env` seja acessível no código front-end com Vite, qual prefixo é estritamente obrigatório?',
        options: [
          { id: 'a', text: 'REACT_APP_' },
          { id: 'b', text: 'NEXT_PUBLIC_' },
          { id: 'c', text: 'VITE_' },
          { id: 'd', text: 'SEMOB_API_' },
        ],
        correctOptionId: 'c',
        correctOptionIndex: 2,
        explanation:
          'No Vite, apenas variáveis iniciadas com o prefixo `VITE_` (ex: `VITE_API_URL`) são expostas ao código do cliente através do objeto `import.meta.env`.',
      },
      {
        id: 'front-q5',
        moduleId: 'frontend',
        category: 'Componentes Reutilizáveis',
        question:
          'Qual é a principal característica de um "Dumb Component" (Componente Burro ou de Apresentação) dentro da pasta `/components`?',
        options: [
          { id: 'a', text: 'Ele acessa o banco de dados via SQL diretamente no navegador.' },
          {
            id: 'b',
            text: 'Ele é isolado, previsível e sem efeitos colaterais: recebe dados via props e emite eventos via callbacks.',
          },
          { id: 'c', text: 'Ele não pode receber propriedades (props).' },
          { id: 'd', text: 'Ele só pode ser renderizado em dispositivos mobile com Capacitor.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'Dumb Components são peças de lego: não conhecem a regra de negócio global, não fazem requisições à rede e renderizam estritamente aquilo que recebem via props, facilitando testes e reuso.',
      },
    ],
  },
  {
    id: 'quiz-fundamentos',
    moduleId: 'fundamentos',
    title: 'Teste de Conhecimentos: Engenharia de Software & DevOps',
    subtitle: 'Módulo 05 — Do Zero a Desenvolvedor Júnior',
    badge: 'Engenharia & DevOps',
    description:
      'Avalie seus conhecimentos conceituais sobre SPA, RESTful APIs, OLAP vs OLTP, contêineres Docker e segurança DevSecOps.',
    passingScore: 75,
    questions: [
      {
        id: 'fund-q1',
        moduleId: 'fundamentos',
        category: 'Arquitetura Web',
        question:
          'O que define uma Single Page Application (SPA) em comparação com aplicações web tradicionais baseadas em SSR (Server Side Rendering)?',
        options: [
          { id: 'a', text: 'Uma SPA tem apenas um arquivo HTML e nunca muda de tela.' },
          {
            id: 'b',
            text: 'Uma SPA carrega uma única página HTML inicial e atualiza dinamicamente o conteúdo via JavaScript/DOM sem necessidade de recarregar o navegador a cada navegação.',
          },
          { id: 'c', text: 'SPAs funcionam apenas offline sem conexão à internet.' },
          { id: 'd', text: 'SPAs não podem usar CSS ou imagens.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'Em uma SPA, o roteamento e a renderização acontecem no navegador do usuário, proporcionando uma experiência instantânea, similar a um aplicativo nativo desktop ou mobile.',
      },
      {
        id: 'fund-q2',
        moduleId: 'fundamentos',
        category: 'Bancos de Dados Analíticos vs Transacionais',
        question:
          'Qual é a diferença conceitual entre sistemas OLTP (bancos transacionais) e OLAP (Data Warehouse / BI como o Qlik)?',
        options: [
          {
            id: 'a',
            text: 'OLTP é otimizado para operações rápidas e concorrentes de escrita/leitura pontual (ex: registro de viagens de ônibus); OLAP é otimizado para consultas analíticas pesadas e agregações históricas complexas.',
          },
          { id: 'b', text: 'OLTP armazena imagens e OLAP armazena texto.' },
          { id: 'c', text: 'OLAP é usado no front-end e OLTP no back-end.' },
          { id: 'd', text: 'Não há diferença conceitual.' },
        ],
        correctOptionId: 'a',
        correctOptionIndex: 0,
        explanation:
          'OLTP (Online Transaction Processing) atende às transações imediatas do dia a dia da secretaria sem engargalar. OLAP (Online Analytical Processing) consolida dados em massa para dashboards e inteligência no Qlik.',
      },
      {
        id: 'fund-q3',
        moduleId: 'fundamentos',
        category: 'Containerização Docker',
        question:
          'Qual é a principal vantagem de empacotar o banco PostgreSQL e pgAdmin usando o `docker-compose.yml` no projeto?',
        options: [
          {
            id: 'a',
            text: 'Garantir que o ambiente de desenvolvimento seja idêntico para todos os estagiários e desenvolvedores, evitando problemas de versão de sistema operacional ("na minha máquina funciona").',
          },
          { id: 'b', text: 'Aumentar o consumo de memória RAM do computador.' },
          { id: 'c', text: 'Impedir que o código TypeScript seja compilado.' },
          { id: 'd', text: 'Permitir rodar código sem ter o Node.js instalado.' },
        ],
        correctOptionId: 'a',
        correctOptionIndex: 0,
        explanation:
          'Contêineres Docker isolam o ambiente e garantem reprodutibilidade perfeita: mesma versão do PostgreSQL (15), mesmas portas, mesmas extensões PostGIS e pgAdmin prontos em um único comando.',
      },
      {
        id: 'fund-q4',
        moduleId: 'fundamentos',
        category: 'Mobile Híbrido com Capacitor',
        question:
          'Como o Capacitor (utilizado nos projetos mobile da SEMOB) permite transformar uma aplicação React web em um aplicativo móvel Android/iOS?',
        options: [
          { id: 'a', text: 'Ele reescreve todo o código JavaScript em linguagem Assembly.' },
          {
            id: 'b',
            text: 'Ele empacota o código web dentro de uma WebView nativa ultrarrápida e fornece pontes (bridges) para acessar recursos nativos de hardware como GPS, câmera e armazenamento.',
          },
          { id: 'c', text: 'Ele apenas tira prints da tela e envia para as lojas de aplicativos.' },
          { id: 'd', text: 'Ele obriga o usuário a abrir o Google Chrome no celular manualmente.' },
        ],
        correctOptionId: 'b',
        correctOptionIndex: 1,
        explanation:
          'O Capacitor conecta o ecossistema Web (React/Vite) ao sistema operacional móvel, viabilizando o uso de uma única base de código tanto para navegadores quanto para celulares de fiscais e cidadãos.',
      },
    ],
  },
];

// Flat array de todas as questões para consultas rápidas
export const QUIZZES_DATA: QuizQuestion[] = QUIZZES_BLOCKS.flatMap((block) => block.questions);
