import { IntegrationStep } from '../types';

export const INTEGRATION_STEPS_DATA: IntegrationStep[] = [
  {
    step: 1,
    title: 'Bem-vindo à SEMOB-DF e à SUTINF',
    summary:
      'Compreenda a missão institucional da Secretaria de Mobilidade e o papel tecnológico da SUTINF como motor dos transportes da capital.',
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
        answer: "Operador LIKE e o símbolo %, por exemplo: WHERE nome_linha LIKE '%GAMA%';",
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
    dockerSetup:
      'docker compose up -d (Postgres na 5432, pgAdmin na 5050, Swagger em http://localhost:8097/api/docs)',
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
