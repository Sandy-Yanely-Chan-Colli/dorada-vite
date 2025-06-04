/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_API_TIMEOUT: string;
  // Añade aquí cualquier otra variable de tu .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}