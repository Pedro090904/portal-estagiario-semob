import { LearningModule } from '../../types';

export const mod01Ambiente: LearningModule = {
  id: 'mod-1-ambiente',
  order: 1,
  title: 'Ecossistema SISMOB, Setup Docker & Ferramentas',
  category: 'fundamentos',
  estimatedTime: '45 min',
  description:
    'Configuração completa do ambiente de desenvolvimento local, containers Docker (PostgreSQL, PostGIS e pgAdmin), variáveis de ambiente e ferramentas de engenharia.',
  objectives: [
    'Compreender a stack oficial (Node.js LTS, TypeScript, NestJS, React, PostgreSQL/PostGIS e Oracle)',
    'Subir o banco de dados local e pgAdmin utilizando Docker Compose',
    'Configurar variáveis de ambiente (.env) com segurança sem vazar credenciais',
  ],
  sections: [
    {
      heading: '1. Visão Geral do Ecossistema e Stack Tecnológico',
      body: 'O ecossistema de mobilidade urbana foi concebido para atender a operações de transporte público com alta confiabilidade, concorrência massiva, blindagem de segurança contra injeção de código e estrita aderência a contratos de API RESTful e interfaces reativas.',
      tables: [
        {
          headers: ['Camada / Função', 'Tecnologia Adotada', 'Justificativa Técnica'],
          rows: [
            [
              'Linguagem Base',
              'TypeScript 5.7+ sobre Node.js 20+ / 22 LTS',
              'Tipagem estática rigorosa em tempo de compilação, prevenção de bugs de runtime e autocompletion avançado.',
            ],
            [
              'Backend Framework',
              'NestJS 11 (@nestjs/core, Express)',
              'Arquitetura corporativa opinionada baseada em Injeção de Dependências (IoC), módulos independentes e ciclo de vida padronizado.',
            ],
            [
              'Frontend Library',
              'React + TypeScript + Vite + Tailwind CSS',
              'Componentização desacoplada em 5 camadas (Types, Services, Hooks, Smart UI e Dumb UI).',
            ],
            [
              'Banco de Dados Relacional',
              'PostgreSQL 15 (com PostGIS) / Oracle Database',
              'Confiabilidade ACID, suporte a indexação geográfica (traçados de linhas/GPS) e compatibilidade com legados corporativos.',
            ],
            [
              'Validação & Contratos',
              'class-validator + class-transformer + Swagger',
              'Validação declarativa por anotações em runtime com sanitização de campos desconhecidos (whitelist) e documentação OpenAPI.',
            ],
            [
              'Containerização',
              'Docker, Docker Compose e Kubernetes (K8s)',
              'Portabilidade total de desenvolvimento e deploy declarativo com escalabilidade horizontal em produção.',
            ],
          ],
        },
      ],
    },
    {
      heading: '2. Setup do Ambiente Local (Docker Compose vs. Nativo)',
      body: 'Para evitar o clássico problema "na minha máquina funciona", padronizamos os serviços de infraestrutura (banco de dados PostgreSQL, extensão espacial PostGIS e cliente visual pgAdmin) através do Docker Compose.',
      codeBlocks: [
        {
          title: 'Opção A: Execução da Infraestrutura com Docker Compose (Recomendado)',
          language: 'bash',
          code: `# 1. Subir os serviços de banco de dados em segundo plano:
docker compose up -d

# 2. Verificar se os containers estão saudáveis e em execução:
docker compose ps

# 3. Acessar a interface visual pgAdmin no navegador:
# URL: http://localhost:5050
# Utilizador: admin@sismob.com | Senha: admin
# Conexão no Postgres: Host "sismob-db" (ou localhost), Porta 5432, User/Pass definidos no .env`,
        },
        {
          title: 'Opção B: Execução da Aplicação Node/NestJS na Máquina Host',
          language: 'bash',
          code: `# 1. Instalar as dependências exatas do projeto:
npm install

# 2. Configurar o ficheiro de variáveis de ambiente (.env):
# Copie o template .env.example para .env e aponte para localhost:5432

# 3. Iniciar em modo de desenvolvimento (hot-reload ativado):
npm run start:dev`,
        },
      ],
      callouts: [
        {
          type: 'danger',
          title: '🚨 Regra de Segurança de Credenciais (.env)',
          content:
            'Jamais suba o ficheiro .env real contendo senhas de banco ou chaves JWT para o Git. Versione apenas o ficheiro .env.example com valores ilustrativos.',
        },
      ],
    },
    {
      heading: '3. Guia de Comandos NPM Essenciais da Equipa',
      body: 'Estes são os scripts padronizados presentes nos nossos projetos que utilizará diariamente para programar, validar código e correr baterias de testes:',
      tables: [
        {
          headers: ['Comando NPM', 'Descrição da Ação'],
          rows: [
            ['npm run dev / npm run start:dev', 'Inicia o servidor local com monitorização de ficheiros em tempo real (watch mode).'],
            ['npm run build', 'Compila o código TypeScript para JavaScript otimizado na pasta dist/.'],
            ['npm run typecheck', 'Executa o compilador TypeScript (tsc --noEmit) para validar tipos sem gerar ficheiros.'],
            ['npm run lint', 'Executa o ESLint para verificar padronização de código e boas práticas.'],
            ['npm test', 'Executa a bateria de testes unitários automatizados (Vitest / Jest).'],
            ['npm run test:e2e', 'Executa a bateria de testes de ponta a ponta (End-to-End).'],
          ],
        },
      ],
    },
  ],
  checklist: [
    'Instalei o Node.js LTS (v20 ou v22), o Git e o VS Code na minha máquina',
    'Validei a execução do Docker Compose subindo o PostgreSQL + PostGIS e o pgAdmin',
    'Configurei o ficheiro .env local a partir do .env.example sem versionar segredos',
    'Executei npm install e npm run dev com sucesso',
  ],
};
