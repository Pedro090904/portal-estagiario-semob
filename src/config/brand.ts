export interface BrandConfig {
  id: 'azimute' | 'semob';
  productName: string;
  shortName: string;
  tagline: string;
  organizationName: string;
  departmentName: string;
  certificatePrefix: string;
  storageKeyPrefix: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  footerDisclaimer: string;
  isCommercialDemo: boolean;
}

const AZIMUTE_BRAND: BrandConfig = {
  id: 'azimute',
  productName: 'Azimute Dev',
  shortName: 'AZIMUTE',
  tagline: 'A direção exata da sua engenharia: do onboarding ao código em produção',
  organizationName: 'Azimute Tech',
  departmentName: 'Aceleração Técnica & Engenharia de Software',
  certificatePrefix: 'AZM',
  storageKeyPrefix: 'azimute_dev_portal',
  heroBadge: '🧭 Rota Técnica & Onboarding Guiado',
  heroTitle: 'Defina o seu azimute e evolua com direção técnica real.',
  heroSubtitle:
    'Trilhas imersivas de engenharia de software com arquitetura de microsserviços, modelagem de banco de dados, fluxos rigorosos de Git e desafios práticos de código.',
  footerDisclaimer:
    'Azimute Dev — Plataforma modular de aceleração técnica, governança de código e onboarding de equipes de tecnologia.',
  isCommercialDemo: true,
};

const SEMOB_BRAND: BrandConfig = {
  id: 'semob',
  productName: 'Portal do Estagiário — SEMOB',
  shortName: 'SEMOB DEV',
  tagline: 'Capacitação Técnica e Onboarding de Engenharia',
  organizationName: 'Secretaria de Transporte e Mobilidade (SEMOB/DF)',
  departmentName: 'Subsecretaria de Tecnologia da Informação',
  certificatePrefix: 'SEMOB',
  storageKeyPrefix: 'semob_intern_portal',
  heroBadge: '🚀 Trilha de Integração Técnica',
  heroTitle: 'Bem-vindo à equipe de desenvolvimento.',
  heroSubtitle:
    'Domine o fluxo de trabalho com Git, arquitetura de APIs, frontend moderno e modelagem de dados através de guias práticos e desafios reais.',
  footerDisclaimer:
    'Ambiente interno de capacitação técnica. Os certificados emitidos destinam-se ao controle interno de mentoria e acompanhamento.',
  isCommercialDemo: false,
};

/**
 * Define o modo ativo. Por padrão roda como Azimute.
 * Pode ser alternado via variável de ambiente VITE_BRAND_MODE=semob no .env
 */
const activeBrandMode = import.meta.env.VITE_BRAND_MODE || 'azimute';

export const brandConfig: BrandConfig =
  activeBrandMode === 'semob' ? SEMOB_BRAND : AZIMUTE_BRAND;
