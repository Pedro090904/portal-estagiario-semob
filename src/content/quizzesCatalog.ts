import { QuizQuestion } from '../types';

export const QUIZZES_DATA: QuizQuestion[] = [
  // ==========================================================================
  // MÓDULO 1: ECOSSISTEMA SISMOB, SETUP DOCKER & FERRAMENTAS ('mod-1-ambiente')
  // ==========================================================================
  {
    id: 'q-amb-1',
    moduleId: 'mod-1-ambiente',
    competencyTag: 'Configuração segura de variáveis de ambiente (.env)',
    question: 'Qual é a regra de segurança obrigatória em relação ao ficheiro .env nos projetos da equipa?',
    options: [
      'Comitar o ficheiro .env na branch develop para facilitar o setup dos colegas.',
      'Nunca versionar o .env real no Git; manter apenas o .env.example com chaves ilustrativas sem segredos.',
      'Guardar as senhas do banco diretamente no código TypeScript dentro de src/config/.',
      'Enviar o ficheiro .env num commit separado usando git push --force.',
    ],
    correctOptionIndex: 1,
    explanation:
      'Credenciais de banco e chaves JWT jamais devem ir para o repositório Git. Versionamos apenas o template .env.example e mantemos o .env no .gitignore.',
  },
  {
    id: 'q-amb-2',
    moduleId: 'mod-1-ambiente',
    competencyTag: 'Orquestração de ambiente local com Docker Compose',
    question: 'Qual comando sobe os containers do PostgreSQL/PostGIS e pgAdmin em segundo plano sem bloquear o terminal?',
    options: [
      'docker build --all',
      'docker compose up -d',
      'npm run typecheck',
      'docker ps -a',
    ],
    correctOptionIndex: 1,
    explanation:
      'O comando "docker compose up -d" (detached mode) inicia todos os serviços declarados no docker-compose.yml em segundo plano.',
  },
  {
    id: 'q-amb-3',
    moduleId: 'mod-1-ambiente',
    competencyTag: 'Validação estática de tipos com TypeScript',
    question: 'Qual script do package.json verifica se existem erros de tipagem TypeScript em todo o projeto sem gerar ficheiros de build na pasta dist/?',
    options: [
      'npm run typecheck (tsc --noEmit)',
      'npm start',
      'git status',
      'npm init',
    ],
    correctOptionIndex: 0,
    explanation:
      'A flag --noEmit do compilador TypeScript (tsc) valida todos os contratos e tipos do código sem emitir ficheiros JavaScript.',
  },
  {
    id: 'q-amb-4',
    moduleId: 'mod-1-ambiente',
    competencyTag: 'Compreensão da stack SISMOB',
    question: 'Qual extensão do PostgreSQL é utilizada no ecossistema para armazenar e processar traçados geográficos (geometrias) das linhas de autocarro?',
    options: [
      'PgBouncer',
      'PostGIS',
      'Prisma Client',
      'Redis Geo',
    ],
    correctOptionIndex: 1,
    explanation:
      'O PostGIS adiciona suporte a objetos geográficos (como geometry/linestring e funções ST_AsText) ao PostgreSQL.',
  },

  // ==========================================================================
  // MÓDULO 2: MANUAL COMPLETO DE GIT ('mod-2-git')
  // ==========================================================================
  {
    id: 'q-git-1',
    moduleId: 'mod-2-git',
    competencyTag: 'Domínio das 4 zonas do Git',
    question: 'Na arquitetura das 4 zonas do Git, qual comando move as alterações do Working Directory para a Staging Area (Index)?',
    options: [
      'git commit -m "..."',
      'git push origin main',
      'git add <ficheiro>',
      'git stash pop',
    ],
    correctOptionIndex: 2,
    explanation:
      'O comando git add seleciona as modificações do seu diretório de trabalho e coloca-as no "palco" (Staging Area) para o próximo commit.',
  },
  {
    id: 'q-git-2',
    moduleId: 'mod-2-git',
    competencyTag: 'Reversão segura em produção (git revert vs reset)',
    question: 'Um commit com bug já foi enviado para a branch compartilhada em produção (main). Qual é a forma SEGURA de desfazer essa alteração sem reescrever o histórico dos colegas?',
    options: [
      'git reset --hard HEAD~1 seguido de git push --force',
      'git revert <hash-do-commit> seguido de git push',
      'Apagar a pasta .git e clonar novamente',
      'git restore .',
    ],
    correctOptionIndex: 1,
    explanation:
      'O git revert cria um novo commit inverso preservando todo o histórico auditável, sendo a única abordagem segura para branches públicas/produção.',
  },
  {
    id: 'q-git-3',
    moduleId: 'mod-2-git',
    competencyTag: 'Padronização com Conventional Commits',
    question: 'Segundo o padrão Conventional Commits adotado pela equipa, qual mensagem representa corretamente a criação de um novo endpoint de consulta de horários?',
    options: [
      'ajustes gerais nas rotas',
      'fix(db): apaga tabela antiga',
      'feat(horarios): adiciona endpoint GET de consulta por sentido',
      'WIP: mexendo no controller',
    ],
    correctOptionIndex: 2,
    explanation:
      'O prefixo feat(<escopo>): indica a introdução de uma nova funcionalidade com descrição clara no tempo presente.',
  },
  {
    id: 'q-git-4',
    moduleId: 'mod-2-git',
    competencyTag: 'Gestão de contexto com git stash',
    question: 'Está no meio de uma tarefa com código ainda incompleto que não compila, e precisa de trocar imediatamente de branch para ajudar um colega. Qual sequência deve usar?',
    options: [
      'git reset --hard e depois reescrever tudo',
      'git stash para guardar na gaveta temporária, trocar de branch, e depois git stash pop ao voltar',
      'Fazer um commit quebrado direto na main',
      'git branch -D',
    ],
    correctOptionIndex: 1,
    explanation:
      'O git stash guarda as alterações locais não comitadas numa pilha temporária, limpando o Working Directory para trocar de branch com segurança.',
  },

  // ==========================================================================
  // MÓDULO 3: ENGENHARIA DE DADOS & SQL ('mod-3-banco-dados')
  // ==========================================================================
  {
    id: 'q-sql-1',
    moduleId: 'mod-3-banco-dados',
    competencyTag: 'Junção relacional explícita com WHERE evitando Produto Cartesiano',
    question: 'O que acontece quando declaramos duas tabelas no FROM (ex: tab_linha l, tab_itinerario i) e esquecemos de igualar a Chave Primária com a Estrangeira (l.id_linha = i.id_linha) na cláusula WHERE?',
    options: [
      'O PostgreSQL cria o filtro automaticamente pelo nome da coluna.',
      'Ocorre um Produto Cartesiano, multiplicando todas as linhas da tabela A por todas as linhas da tabela B.',
      'A consulta retorna zero registos.',
      'O banco apaga os registos duplicados.',
    ],
    correctOptionIndex: 1,
    explanation:
      'Sem a condição de vínculo no WHERE, o motor relacional combina cada linha da primeira tabela com todas as linhas da segunda (Produto Cartesiano).',
  },
  {
    id: 'q-sql-2',
    moduleId: 'mod-3-banco-dados',
    competencyTag: 'Diferença entre filtros WHERE e HAVING',
    question: 'Qual é a diferença fundamental entre as cláusulas WHERE e HAVING numa consulta SQL analítica?',
    options: [
      'Não há diferença; ambas podem ser usadas em qualquer ordem.',
      'WHERE filtra linhas individuais ANTES do agrupamento (GROUP BY), enquanto HAVING filtra os grupos DEPOIS das funções agregadas (COUNT, SUM, AVG).',
      'HAVING só funciona no Oracle e WHERE só funciona no PostgreSQL.',
      'WHERE serve apenas para texto e HAVING apenas para números.',
    ],
    correctOptionIndex: 1,
    explanation:
      'O WHERE atua como peneira nas linhas brutas antes do GROUP BY; o HAVING filtra o resultado consolidado das funções matemáticas de agregação.',
  },
  {
    id: 'q-sql-3',
    moduleId: 'mod-3-banco-dados',
    competencyTag: 'Consultas espaciais PostGIS e busca textual ILIKE',
    question: 'No PostgreSQL (dados_mobilidade), qual combinação permite converter uma geometria binária PostGIS em texto legível (WKT) e buscar um nome de linha ignorando maiúsculas/minúsculas?',
    options: [
      'TO_CHAR(geo) e LIKE',
      'public.ST_AsText(geo_linhas_lin) e operador ILIKE',
      'CAST(geo AS VARCHAR) e EQUALS',
      'JSON_EXTRACT e MATCH',
    ],
    correctOptionIndex: 1,
    explanation:
      'ST_AsText converte a geometria espacial para o formato textual WKT e o operador ILIKE realiza busca case-insensitive no PostgreSQL.',
  },
  {
    id: 'q-sql-4',
    moduleId: 'mod-3-banco-dados',
    competencyTag: 'Modelagem comparada PostgreSQL vs Oracle na SEMOB',
    question: 'Ao comparar o banco PostgreSQL (dados_mobilidade) com o Oracle (DFTRANS), onde reside o valor da tarifa de uma linha no PostgreSQL?',
    options: [
      'Diretamente na coluna vl_tarifa da tabela tab_linha (modelo operacional desnormalizado).',
      'Exige navegar obrigatoriamente por 4 tabelas até FAIXAS_TARIFARIAS.',
      'Fica guardado num ficheiro JSON externo fora do banco.',
      'Na tabela tab_itinerario_descritivo.',
    ],
    correctOptionIndex: 0,
    explanation:
      'No PostgreSQL operacional da SEMOB, vl_tarifa está diretamente em tab_linha para agilizar APIs, enquanto no Oracle regulatório exige junção de 4 tabelas.',
  },

  // ==========================================================================
  // MÓDULO 4: DESENVOLVIMENTO BACK-END ('mod-4-backend')
  // ==========================================================================
  {
    id: 'q-back-1',
    moduleId: 'mod-4-backend',
    competencyTag: 'Isolamento estrito em camadas (Controller, Service, Repository)',
    question: 'Na arquitetura em camadas do backend SISMOB (NestJS), qual é a responsabilidade exclusiva da camada Service?',
    options: [
      'Manipular diretamente os objetos req e res do Express e configurar cabeçalhos HTTP.',
      'Conter 100% das regras de negócio, validar restrições de domínio, lançar exceções semânticas e orquestrar repositórios.',
      'Concatenar strings SQL manualmente sem parâmetros.',
      'Renderizar componentes visuais React.',
    ],
    correctOptionIndex: 1,
    explanation:
      'O Controller cuida do transporte HTTP, o Repository isola o acesso a dados (SQL/TypeORM) e o Service concentra todas as decisões e regras de negócio.',
  },
  {
    id: 'q-back-2',
    moduleId: 'mod-4-backend',
    competencyTag: 'Prevenção de SQL Injection com queries parametrizadas',
    question: 'Ao escrever uma consulta SQL nativa dinâmica no Repository com TypeORM (PostgreSQL), como os filtros enviados pelo utilizador devem ser passados?',
    options: [
      'Concatenando diretamente na string com + ou template literal ${filtro}.',
      'Usando placeholders parametrizados ($1, $2) na cláusula WHERE e passando os valores num array separado para this.dataSource.query(sql, params).',
      'Enviando a query SQL pronta a partir do frontend.',
      'Desativando o ValidationPipe.',
    ],
    correctOptionIndex: 1,
    explanation:
      'Queries parametrizadas ($1, $2) garantem que o driver do PostgreSQL trate os valores com escape seguro, blindando a API contra SQL Injection.',
  },
  {
    id: 'q-back-3',
    moduleId: 'mod-4-backend',
    competencyTag: 'Validação de entrada com DTOs e ValidationPipe',
    question: 'Qual configuração do ValidationPipe global no NestJS rejeita automaticamente com HTTP 400 qualquer propriedade extra enviada no JSON que não esteja declarada no DTO?',
    options: [
      'whitelist: true combinado com forbidNonWhitelisted: true',
      'synchronize: true',
      'allowAny: true',
      'skipMissingProperties: true',
    ],
    correctOptionIndex: 0,
    explanation:
      'whitelist remove campos estranhos e forbidNonWhitelisted bloqueia a requisição com 400 Bad Request, prevenindo vulnerabilidades de Mass Assignment.',
  },
  {
    id: 'q-back-4',
    moduleId: 'mod-4-backend',
    competencyTag: 'Hierarquia de exceções de domínio e Status Codes HTTP',
    question: 'Quando um cliente tenta registar um veículo cuja placa já existe no banco de dados, qual exceção de domínio e respetivo Status Code HTTP devem ser retornados?',
    options: [
      'EntityNotFoundException (404 Not Found)',
      'EntityAlreadyExistsException (409 Conflict)',
      'UnauthorizedException (401 Unauthorized)',
      'InternalServerErrorException (500)',
    ],
    correctOptionIndex: 1,
    explanation:
      'Conflitos de unicidade (placa, prefixo ou código já registado) são representados semanticamente por EntityAlreadyExistsException (HTTP 409 Conflict).',
  },

  // ==========================================================================
  // MÓDULO 5: ARQUITETURA FRONT-END ('mod-5-frontend')
  // ==========================================================================
  {
    id: 'q-front-1',
    moduleId: 'mod-5-frontend',
    competencyTag: 'Separação nas 5 camadas unidirecionais Front-end',
    question: 'Na arquitetura Front-end em 5 camadas (Types, Services, Hooks, Smart UI, Dumb UI), onde devem ficar as chamadas HTTP (axios/fetch) e onde deve ficar o estado reativo (useState/useEffect)?',
    options: [
      'Ambos ficam misturados dentro do componente visual em components/Card.tsx.',
      'As chamadas HTTP ficam isoladas em services/ e o estado reativo/orquestração fica no Custom Hook em hooks/.',
      'As chamadas HTTP ficam no ficheiro types/ e o useState fica no index.html.',
      'As chamadas HTTP são feitas diretamente no onClick do botão JSX.',
    ],
    correctOptionIndex: 1,
    explanation:
      'Os Services são mensageiros HTTP puros (sem React), enquanto os Custom Hooks são o cérebro que gere estados de loading, erro e dados para a tela.',
  },
  {
    id: 'q-front-2',
    moduleId: 'mod-5-frontend',
    competencyTag: 'Construção de Dumb Components puros',
    question: 'O que caracteriza um "Dumb Component" (Componente Puro/Operário) dentro da pasta components/ de uma funcionalidade?',
    options: [
      'Acede diretamente ao localStorage e importa o axios para buscar dados.',
      'Recebe dados e callbacks exclusivamente via props tipadas, focando apenas na renderização visual e acessibilidade.',
      'Declara todas as rotas da aplicação.',
      'Usa o tipo any em todas as propriedades para evitar erros.',
    ],
    correctOptionIndex: 1,
    explanation:
      'Dumb Components não sabem de onde os dados vieram; apenas renderizam a UI a partir das props e notificam interações do utilizador para o componente pai.',
  },
  {
    id: 'q-front-3',
    moduleId: 'mod-5-frontend',
    competencyTag: 'Prevenção de regressões e tratamento de estados de UI',
    question: 'Ao submeter um formulário ou carregar uma listagem no Front-end, qual prática evita cliques duplicados e falhas silenciosas?',
    options: [
      'Deixar o bloco catch {} vazio para não assustar o utilizador.',
      'Controlar a flag isLoading no Hook (desabilitando o botão de submit durante o envio) e exibir feedback claro de erro na UI caso a Promise falhe.',
      'Recarregar a página inteira com window.location.reload() a cada clique.',
      'Remover o try/catch.',
    ],
    correctOptionIndex: 1,
    explanation:
      'Desabilitar o botão com disabled={isLoading} impede envios duplicados, e tratar o catch com estado de erro evita que o utilizador fique sem resposta.',
  },
  {
    id: 'q-front-4',
    moduleId: 'mod-5-frontend',
    competencyTag: 'Otimização de bundle com Lazy Loading',
    question: 'Para que serve a declaração const TarefasIndex = lazy(() => import(...)) no registo de rotas da aplicação React?',
    options: [
      'Para atrasar propositadamente as requisições SQL.',
      'Para aplicar Code-Splitting, carregando o código daquela tela sob demanda apenas quando o utilizador aceder à rota.',
      'Para substituir a necessidade de TypeScript.',
      'Para apagar o cache do navegador.',
    ],
    correctOptionIndex: 1,
    explanation:
      'O lazy loading divide o bundle JavaScript, garantindo que a primeira tela carregue rápido mesmo em redes móveis 4G (meta de desempenho Q49/Q73).',
  },
];
