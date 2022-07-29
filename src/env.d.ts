/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_NODE_API: string;
  readonly VITE_KUROMOJI_API: string;

  readonly VITE_PYTHON_API?: string;
  readonly VITE_GO_API?: string;
  readonly VITE_JVM_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
