import { LearningModule, QuizQuestion, IntegrationStep, QuizBlockData } from '../types';
import { MODULES_CATALOG } from '../content/modules';
import { QUIZZES_DATA, QUIZZES_BLOCKS } from '../content/quizzesCatalog';
import { INTEGRATION_STEPS_DATA } from '../content/integrationTrackCatalog';

// Aliases para total compatibilidade com telas existentes
export const MODULES: LearningModule[] = MODULES_CATALOG;
export const MODULES_DATA: LearningModule[] = MODULES_CATALOG;
export const QUIZZES: QuizBlockData[] = QUIZZES_BLOCKS;
export const INTEGRATION_ROADMAP: IntegrationStep[] = INTEGRATION_STEPS_DATA;

export const getModules = (): LearningModule[] => {
  return [...MODULES_CATALOG].sort((a, b) => a.order - b.order);
};

export const getModuleById = (id: string): LearningModule | undefined => {
  return MODULES_CATALOG.find((mod) => mod.id === id);
};

export const getQuizByModuleId = (moduleId: string): QuizQuestion[] => {
  return QUIZZES_DATA.filter((q) => q.moduleId === moduleId);
};

export const getAllQuizzes = (): QuizQuestion[] => {
  return QUIZZES_DATA;
};

export const getIntegrationSteps = (): IntegrationStep[] => {
  return INTEGRATION_STEPS_DATA;
};
