import { IntegrationStep } from '../types';

export const INTEGRATION_STEPS_DATA: IntegrationStep[] = [
  {
    id: 'step-1',
    dayOrPhase: 'Etapa 1 • Onboarding & Setup',
    title: 'Ambiente, Docker Compose e Arquitetura SISMOB',
    description:
      'Configuração da máquina de desenvolvimento, containers PostgreSQL/PostGIS, pgAdmin e boas práticas de variáveis de ambiente (.env).',
    deliverables: [
      'Containers Docker em execução local',
      'Leitura e checklist do Módulo 01 concluídos',
      'Aprovação no Quiz de Ecossistema & Setup (>= 70%)',
    ],
    relatedModuleId: 'mod-1-ambiente',
  },
  {
    id: 'step-2',
    dayOrPhase: 'Etapa 2 • Controlo de Versão',
    title: 'Fluxo Colaborativo com Git, Branches e Conventional Commits',
    description:
      'Domínio das 4 zonas do Git, criação de branches, Merge Requests no GitLab, reversões seguras em produção e tags SemVer.',
    deliverables: [
      'Leitura integral do Manual de Git (Módulo 02)',
      'Aprovação no Quiz de Engenharia Git (>= 70%)',
    ],
    relatedModuleId: 'mod-2-git',
  },
  {
    id: 'step-3',
    dayOrPhase: 'Etapa 3 • Engenharia de Dados',
    title: 'Modelagem Relacional e Desafio Prático SQL (25 Questões)',
    description:
      'Estudo do schema dados_mobilidade (PostgreSQL) vs. DFTRANS (Oracle), junções explícitas via WHERE e resolução das 25 questões oficiais.',
    deliverables: [
      'Leitura do Manual de Banco de Dados (Módulo 03) + Quiz aprovado',
      'Resolução e validação do Desafio SQL (Linhas 0.111, 0.170 e BI)',
    ],
    relatedModuleId: 'mod-3-banco-dados',
  },
  {
    id: 'step-4',
    dayOrPhase: 'Etapa 4 • Engenharia Back-end',
    title: 'API RESTful em Camadas (NestJS, DTOs, TypeORM e SQL Anti-Injection)',
    description:
      'Construção da API de Linhas de Transporte respeitando o isolamento Controller ➔ Service ➔ Repository e validação de entrada.',
    deliverables: [
      'Leitura do Manual Back-end (Módulo 04) + Quiz aprovado',
      'Submissão do repositório GitLab no Desafio Back-end com Checklist de PR',
    ],
    relatedModuleId: 'mod-4-backend',
  },
  {
    id: 'step-5',
    dayOrPhase: 'Etapa 5 • Engenharia Front-end & Homologação',
    title: 'Arquitetura Front-end em 5 Camadas e Projeto InfoÔnibus',
    description:
      'Desenvolvimento da interface reativa em 5 camadas (Types, Services, Hooks, Smart UI e Dumb UI) consumindo a API e emissão do Certificado.',
    deliverables: [
      'Leitura do Guia Front-end (Módulo 05) + Quiz aprovado',
      'Submissão do repositório GitLab do InfoÔnibus e homologação do Certificado SEI',
    ],
    relatedModuleId: 'mod-5-frontend',
  },
];
