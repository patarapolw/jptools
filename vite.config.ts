import { sync as glob } from 'fast-glob';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join as pathJoin, resolve as pathResolve } from 'path';
import { defineConfig, PluginOption } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueJSX from '@vitejs/plugin-vue-jsx';

let BASE_URL = '/';
if (process.env.GH) {
  BASE_URL = '/jptools/';
}

function cloneIndexHtmlPlugin(routes: string[] = []): PluginOption {
  const name = 'CloneIndexHtmlPlugin';
  const outDir = 'dist'; // config's `build.outDir`
  const src = pathJoin(outDir, 'index.html');

  return {
    name,
    closeBundle: () => {
      const PAGE_EXT = '.vue';
      const PAGE_INDEX = 'index';

      routes.push(
        ...glob(`**/*${PAGE_EXT}`, {
          cwd: 'src/pages',
        })
          .map((p) => {
            p = p.substring(0, p.length - PAGE_EXT.length);
            if (p.endsWith('/' + PAGE_INDEX)) {
              p = p.substring(0, p.length - PAGE_INDEX.length - 1);
            }

            return p;
          })
          .filter((p) => p !== PAGE_INDEX),
      );

      routes.map((p) => {
        const dir = pathResolve(outDir, p);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }

        const dst = pathJoin(outDir, p, 'index.html');

        copyFileSync(src, dst);
        console.log(`${name}: Copied ${src} to ${dst}`);
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE_URL,
  plugins: [vue(), vueJSX(), cloneIndexHtmlPlugin()],
  resolve: {
    alias: [{ find: /^@\/(.+)$/, replacement: pathResolve('src', '$1') }],
  },
  define: {
    __KUROMOJI_API__: JSON.stringify(
      process.env['KUROMOJI_API'] ||
        'https://empty-dew-3935.herokuapp.com/api/tokenizer/kuromoji',
    ),
  },
});
