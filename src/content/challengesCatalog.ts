import { ChallengeCategory, ChallengeDefinition } from '../types';

export const CHALLENGES_CATALOG: Record<ChallengeCategory, ChallengeDefinition> = {
  sql: {
    id: 'challenge-sql-relatorios',
    slug: 'sql',
    title: 'Desafio Prático de SQL e Relatórios Operacionais',
    subtitle: 'Consultas analíticas, filtros seguros com WHERE, agregações e auditoria de dados',
    badgeText: '🗄️ Engenharia de Dados & SQL',
    estimatedTime: '2 a 3 horas',
    difficulty: 'Intermediário',
    scenarioDescription:
      'Você recebeu uma demanda da equipe de inteligência de dados para extrair indicadores operacionais do banco relacional. Todas as consultas de leitura, atualização ou remoção devem utilizar filtros explícitos com cláusula WHERE para garantir segurança e performance.',
    architectureOrSchemaCode: {
      title: 'DDL de Referência — Tabelas Principais',
      language: 'sql',
      code: `CREATE TABLE linhas_transporte (
  id_linha INT PRIMARY KEY,
  codigo_linha VARCHAR(15) NOT NULL,
  descricao VARCHAR(120) NOT NULL,
  tarifa NUMERIC(10,2) NOT NULL,
  ativa CHAR(1) DEFAULT 'S'
);

CREATE TABLE viagens_realizadas (
  id_viagem BIGINT PRIMARY KEY,
  id_linha INT REFERENCES linhas_transporte(id_linha),
  data_viagem TIMESTAMP NOT NULL,
  qtd_passageiros INT NOT NULL,
  km_percorrido NUMERIC(8,2) NOT NULL
);`,
    },
    tasks: [
      {
        id: 'sql-1',
        title: '1. Listagem filtrada de linhas ativas por faixa tarifária',
        description:
          'Escreva uma consulta que retorne o código, descrição e tarifa das linhas ativas (ativa = \'S\') cuja tarifa seja superior a R$ 3,50, ordenando da maior para a menor tarifa.',
        codeSnippet: `SELECT codigo_linha, descricao, tarifa\nFROM linhas_transporte\nWHERE ativa = 'S' AND tarifa > 3.50\nORDER BY tarifa DESC;`,
      },
      {
        id: 'sql-2',
        title: '2. Total de passageiros e média por linha com JOIN e WHERE',
        description:
          'Relacione as tabelas linhas_transporte e viagens_realizadas utilizando INNER JOIN e filtre com WHERE apenas as viagens do período solicitado, agrupando por linha.',
      },
      {
        id: 'sql-3',
        title: '3. Atualização segura de cadastro com cláusula WHERE obrigatória',
        description:
          'Elabore o comando UPDATE para corrigir a tarifa de uma linha específica garantindo o uso estrito da chave primária na cláusula WHERE.',
      },
    ],
    prChecklist: [
      'Todas as queries de consulta, UPDATE e DELETE possuem cláusula WHERE explícita?',
      'Evitei o uso de SELECT * especificando apenas as colunas necessárias?',
      'Utilizei aliases claros nas tabelas (ex: lt para linhas_transporte)?',
      'Testei os agrupamentos (GROUP BY) e filtros de agregação (HAVING) sem erros de sintaxe?',
    ],
    referenceGuideUrl: '/manual-banco-dados-semob.html',
    referenceSolutionUrl: '/gabarito-desafio-sql-semob.html',
  },

  backend: {
    id: 'challenge-backend-api',
    slug: 'backend',
    title: 'Desafio de Arquitetura Backend & API REST',
    subtitle: 'Construção de endpoints modulares em camadas (Controller, Service, DTO e Validação)',
    badgeText: '⚙️ Engenharia Backend (NestJS / Node)',
    estimatedTime: '4 a 6 horas',
    difficulty: 'Intermediário',
    scenarioDescription:
      'Construa um módulo de API RESTful seguindo o padrão arquitetural em camadas (Controller -> Service -> Repository/ORM). O foco é garantir isolamento de regras de negócio, validação de dados de entrada via DTOs e tratamento padronizado de exceções HTTP.',
    architectureOrSchemaCode: {
      title: 'Estrutura Esperada do Módulo Backend',
      language: 'text',
      code: `src/modules/linhas/
 ├── dto/
 │    ├── create-linha.dto.ts
 │    └── filter-linha.dto.ts
 ├── entities/
 │    └── linha.entity.ts
 ├── linhas.controller.ts   # Apenas roteamento HTTP e status codes
 ├── linhas.service.ts      # Regras de negócio e validações de domínio
 └── linhas.module.ts`,
    },
    tasks: [
      {
        id: 'back-1',
        title: '1. Modelagem de DTOs com validação de entrada',
        description:
          'Crie os DTOs de criação e listagem aplicando decoradores do class-validator (@IsString, @IsNotEmpty, @IsNumber, @Min) para impedir dados inválidos antes de chegar ao Service.',
      },
      {
        id: 'back-2',
        title: '2. Separação entre Controller e Service',
        description:
          'Implemente as rotas GET (com paginação/filtro), POST, PATCH e DELETE no Controller, delegando 100% da lógica de negócio e verificação de existência ao Service.',
      },
      {
        id: 'back-3',
        title: '3. Tratamento de Erros e Documentação Swagger',
        description:
          'Retorne NotFoundException (404) quando o registro não existir, BadRequestException (400) para conflitos de regra e documente os endpoints com @ApiTags e @ApiOperation.',
      },
    ],
    prChecklist: [
      'A camada de Controller está livre de regras de negócio ou chamadas diretas ao banco?',
      'Todos os dados de entrada (Body, Params, Query) possuem validação com DTO?',
      'O arquivo .env não foi comitado (existe um .env.example documentado)?',
      'As queries de banco de dados executadas pelo serviço utilizam cláusula WHERE segura?',
      'O projeto compila sem erros ao rodar npm run build?',
    ],
    referenceGuideUrl: '/MANUAL_DESENVOLVIMENTO_BACKEND.html',
  },

  frontend: {
    id: 'challenge-frontend-ui',
    slug: 'frontend',
    title: 'Desafio de Arquitetura Frontend & Componentização',
    subtitle: 'Consumo de API, gerenciamento de estados de interface (Loading, Empty, Error) e tipagem',
    badgeText: '🎨 Engenharia Frontend (React + TS)',
    estimatedTime: '3 a 5 horas',
    difficulty: 'Intermediário',
    scenarioDescription:
      'Desenvolva uma tela de listagem, filtragem e cadastro consumindo a API Backend. O objetivo é separar a camada de comunicação HTTP (services), hooks customizados de estado e componentes visuais reutilizáveis e responsivos.',
    architectureOrSchemaCode: {
      title: 'Padrão de Organização Frontend',
      language: 'text',
      code: `src/features/linhas/
 ├── components/
 │    ├── LinhaFilterBar.tsx
 │    ├── LinhaTable.tsx
 │    └── LinhaModalForm.tsx
 ├── hooks/
 │    └── useLinhasData.ts
 ├── services/
 │    └── linhasApi.ts
 └── types.ts`,
    },
    tasks: [
      {
        id: 'front-1',
        title: '1. Tipagem estrita e Serviço de API isolado',
        description:
          'Defina as interfaces TypeScript (sem usar any) e crie o serviço de busca isolado dos componentes visuais.',
      },
      {
        id: 'front-2',
        title: '2. Tratamento dos 4 Estados de UI',
        description:
          'A tela deve apresentar feedback visual claro para: Carregando (Skeleton/Spinner), Erro de requisição (com botão de tentar novamente), Lista Vazia (Empty State) e Sucesso.',
      },
      {
        id: 'front-3',
        title: '3. Filtro com Debounce/Controle e Responsividade',
        description:
          'Implemente a barra de busca por código ou descrição mantendo boa usabilidade tanto em monitores desktop quanto em telas menores.',
      },
    ],
    prChecklist: [
      'O código TypeScript está 100% livre do tipo "any" nas props e respostas de API?',
      'Os estados de Loading, Erro e Lista Vazia estão tratados na interface?',
      'A chamada de API foi isolada em um service/hook fora do JSX do componente?',
      'Os formulários possuem validação e bloqueiam duplo clique durante o envio?',
    ],
    referenceGuideUrl: '/guia_pratico_arquitetura_frontend.html',
  },

  arquitetura: {
    id: 'challenge-arquitetura-geral',
    slug: 'arquitetura',
    title: 'Desafio de Arquitetura Integrada e Boas Práticas',
    subtitle: 'Alinhamento corporativo, microsserviços, cache e segurança de software',
    badgeText: '🏛️ Arquitetura de Software',
    estimatedTime: '3 a 4 horas',
    difficulty: 'Avançado',
    scenarioDescription:
      'Avalie a integração completa entre serviços, políticas de cache em Redis/banco de dados e práticas de segurança e auditoria exigidas para sistemas em produção.',
    tasks: [
      {
        id: 'arq-1',
        title: '1. Mapeamento de Dependências e Contratos de API',
        description:
          'Documente o fluxo de dados entre microfrontends e microserviços garantindo contratos de comunicação imutáveis e idempotência.',
      },
      {
        id: 'arq-2',
        title: '2. Políticas de Segurança e Tratamento de Dados Sensíveis',
        description:
          'Assegure que nenhum dado de autenticação sensível trafegue sem criptografia ou permaneça em logs de auditoria.',
      },
    ],
    prChecklist: [
      'Os contratos de API estão documentados e versionados?',
      'Existe tratamento de resiliência e circuit-breaking?',
      'A arquitetura cumpre as normas de conformidade institucional?',
    ],
    referenceGuideUrl: '/DOCUMENTACAO_ARQUITETURA.md',
  },
};
