/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAND_MODE?: 'azimute' | 'semob' | string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
