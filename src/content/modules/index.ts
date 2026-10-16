import { LearningModule } from '../../types';
import { mod01Ambiente } from './mod-01-ambiente';
import { mod02Git } from './mod-02-git';
import { mod03BancoDados } from './mod-03-banco-dados';
import { mod04Backend } from './mod-04-backend';
import { mod05Frontend } from './mod-05-frontend';

export { mod01Ambiente } from './mod-01-ambiente';
export { mod02Git } from './mod-02-git';
export { mod03BancoDados } from './mod-03-banco-dados';
export { mod04Backend } from './mod-04-backend';
export { mod05Frontend } from './mod-05-frontend';

export const MODULES_CATALOG: LearningModule[] = [
  mod01Ambiente,
  mod02Git,
  mod03BancoDados,
  mod04Backend,
  mod05Frontend,
];

export const ALL_MODULES = MODULES_CATALOG;
