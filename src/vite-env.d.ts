/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Ajoute ici d'autres variables VITE_ si besoin, ex:
  // readonly VITE_ANOTHER_VAR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}