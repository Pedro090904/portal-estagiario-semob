import { ScreenType } from '../types';

/**
 * Fonte única de verdade para a navegação por URL (Q47).
 * As telas continuam a falar em ScreenType; o App traduz para paths reais.
 */
export const SCREEN_TO_PATH: Record<ScreenType, string> = {
  home: '/',
  roteiro: '/trilha',
  biblioteca: '/biblioteca',
  'modulo-ambiente': '/modulos/mod-1-ambiente',
  'modulo-git': '/modulos/mod-2-git',
  'modulo-sql': '/modulos/mod-3-banco-dados',
  'modulo-gabarito': '/modulos/gabarito-sql',
  'modulo-backend': '/modulos/mod-4-backend',
  'modulo-frontend': '/modulos/mod-5-frontend',
  quizzes: '/quizzes',
  'desafio-sql': '/desafios/sql',
  'desafio-backend': '/desafios/backend',
  'desafio-frontend': '/desafios/frontend',
  'sql-challenge': '/desafios/sql',
  'backend-challenge': '/desafios/backend',
  'frontend-challenge': '/desafios/frontend',
  certificado: '/certificado',
  'validar-certificado': '/certificados/validar',
};

/** Aliases canónicos usados como chave primária quando há mais de um ScreenType por path. */
const CANONICAL_SCREENS: ScreenType[] = [
  'home',
  'roteiro',
  'biblioteca',
  'modulo-ambiente',
  'modulo-git',
  'modulo-sql',
  'modulo-gabarito',
  'modulo-backend',
  'modulo-frontend',
  'quizzes',
  'desafio-sql',
  'desafio-backend',
  'desafio-frontend',
  'certificado',
  'validar-certificado',
];

const PATH_TO_SCREEN: Record<string, ScreenType> = CANONICAL_SCREENS.reduce(
  (acc, screen) => {
    acc[SCREEN_TO_PATH[screen]] = screen;
    return acc;
  },
  {} as Record<string, ScreenType>
);

/** Converte um pathname em ScreenType; retorna null para rotas desconhecidas. */
export function pathToScreen(pathname: string): ScreenType | null {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (normalized.startsWith('/certificados/validar')) {
    return 'validar-certificado';
  }
  return PATH_TO_SCREEN[normalized] ?? null;
}

/** Path de leitura de um módulo pelo ID canónico (ex.: mod-2-git). */
export const modulePath = (moduleId: string) => `/modulos/${moduleId}`;
