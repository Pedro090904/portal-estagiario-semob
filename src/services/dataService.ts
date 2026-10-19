import { LearningModule, QuizQuestion, IntegrationStep, QuizBlockData } from '../types';
import { MODULES_CATALOG } from '../content/modules';
import { QUIZZES_DATA } from '../content/quizzesCatalog';
import { INTEGRATION_STEPS_DATA } from '../content/integrationTrackCatalog';
import { normalizeModuleId, PASSING_PERCENTAGE } from './progressEngine';

export const MODULES: LearningModule[] = MODULES_CATALOG;

export const getModules = (): LearningModule[] => {
  return [...MODULES_CATALOG].sort((a, b) => a.order - b.order);
};

export const getModuleById = (id: string): LearningModule | undefined => {
  const canonicalId = normalizeModuleId(id);
  return MODULES_CATALOG.find((mod) => mod.id === canonicalId);
};

export const getQuizByModuleId = (moduleId: string): QuizQuestion[] => {
  const canonicalId = normalizeModuleId(moduleId);
  return QUIZZES_DATA.filter((q) => normalizeModuleId(q.moduleId) === canonicalId);
};

/**
 * Embaralha as opções de cada questão mantendo o índice correto atualizado,
 * evitando tentativa e erro mecânica por posição (Decisão Q26).
 */
export const getShuffledQuizByModuleId = (moduleId: string): QuizQuestion[] => {
  const baseQuestions = getQuizByModuleId(moduleId);

  return baseQuestions.map((q) => {
    const indexedOptions = q.options.map((opt, idx) => ({
      opt,
      isCorrect: idx === q.correctOptionIndex,
    }));

    for (let i = indexedOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
    }

    return {
      ...q,
      options: indexedOptions.map((item) => item.opt),
      correctOptionIndex: indexedOptions.findIndex((item) => item.isCorrect),
    };
  });
};

export const getAllQuizzes = (): QuizQuestion[] => {
  return QUIZZES_DATA;
};

export const getIntegrationSteps = (): IntegrationStep[] => {
  return INTEGRATION_STEPS_DATA;
};

export const QUIZZES: QuizBlockData[] = [
  {
    id: 'mod-1-ambiente',
    moduleId: 'mod-1-ambiente',
    title: 'Quiz: Ecossistema SISMOB & Setup Docker',
    subtitle: 'Módulo 01 — Ferramentas, Containers e Ambiente de Engenharia',
    badge: 'Ambiente & Docker',
    description: 'Valide seu domínio sobre Docker Compose, PostGIS, TypeScript e boas práticas de variáveis de ambiente.',
    passingScore: PASSING_PERCENTAGE,
    questions: QUIZZES_DATA.filter((q) => q.moduleId === 'mod-1-ambiente'),
  },
  {
    id: 'mod-2-git',
    moduleId: 'mod-2-git',
    title: 'Quiz: Git & Engenharia Colaborativa',
    subtitle: 'Módulo 02 — 4 Zonas do Git, Conventional Commits e Reversão Segura',
    badge: 'Git & DevSecOps',
    description: 'Valide seu conhecimento em fluxo de branches, git revert vs reset, conventional commits e gestão de contexto.',
    passingScore: PASSING_PERCENTAGE,
    questions: QUIZZES_DATA.filter((q) => q.moduleId === 'mod-2-git'),
  },
  {
    id: 'mod-3-banco-dados',
    moduleId: 'mod-3-banco-dados',
    title: 'Quiz: Engenharia de Dados & SQL',
    subtitle: 'Módulo 03 — PostgreSQL, PostGIS e Modelagem Comparada SEMOB',
    badge: 'SQL & PostGIS',
    description: 'Teste suas habilidades em consultas analíticas com WHERE explícito, funções PostGIS e agregação.',
    passingScore: PASSING_PERCENTAGE,
    questions: QUIZZES_DATA.filter((q) => q.moduleId === 'mod-3-banco-dados'),
  },
  {
    id: 'mod-4-backend',
    moduleId: 'mod-4-backend',
    title: 'Quiz: Arquitetura Back-end NestJS',
    subtitle: 'Módulo 04 — Controllers, Services, Repositories e DTOs',
    badge: 'NestJS Backend',
    description: 'Avalie seu domínio sobre injeção de dependências, prevenção de SQL Injection e validação de DTOs.',
    passingScore: PASSING_PERCENTAGE,
    questions: QUIZZES_DATA.filter((q) => q.moduleId === 'mod-4-backend'),
  },
  {
    id: 'mod-5-frontend',
    moduleId: 'mod-5-frontend',
    title: 'Quiz: Arquitetura Front-end React',
    subtitle: 'Módulo 05 — 5 Camadas Unidirecionais e Dumb Components',
    badge: 'React Frontend',
    description: 'Comprove seu conhecimento no modelo mental de 5 camadas, Custom Hooks e Lazy Loading.',
    passingScore: PASSING_PERCENTAGE,
    questions: QUIZZES_DATA.filter((q) => q.moduleId === 'mod-5-frontend'),
  },
];
