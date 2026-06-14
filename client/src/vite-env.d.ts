/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_PREFIX: string;
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_SERVER_MAIN_HOST: string;
  readonly VITE_SERVER_MAIN_PORT: string;
  readonly VITE_SERVER_MAIN_URL: string;
  readonly VITE_SERVER_BUSINESS_HOST: string;
  readonly VITE_SERVER_BUSINESS_PORT: string;
  readonly VITE_SERVER_BUSINESS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
