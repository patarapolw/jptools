import { existsSync, mkdirSync, copyFileSync } from 'fs'
import { resolve as pathResolve, join as pathJoin } from 'path'

import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { sync as glob } from 'fast-glob'

let BASE_URL = '/'
if (process.env.GH) {
  BASE_URL = '/jptools/'
}

function cloneIndexHtmlPlugin(routes: string[] = []): PluginOption {
  const name = 'CloneIndexHtmlPlugin'
  const outDir = 'dist' // config's `build.outDir`
  const src = pathJoin(outDir, 'index.html')

  return {
    name,
    closeBundle: () => {
      const PAGE_EXT = '.vue'
      const PAGE_INDEX = 'index'

      routes.push(
        ...glob(`**/*${PAGE_EXT}`, {
          cwd: 'src/pages',
        })
          .map((p) => {
            p = p.substring(0, p.length - PAGE_EXT.length)
            if (p.endsWith('/' + PAGE_INDEX)) {
              p = p.substring(0, p.length - PAGE_INDEX.length - 1)
            }

            return p
          })
          .filter((p) => p !== PAGE_INDEX),
      )

      routes.map((p) => {
        const dir = pathResolve(outDir, p)
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true })
        }

        const dst = pathJoin(outDir, p, 'index.html')

        copyFileSync(src, dst)
        console.log(`${name}: Copied ${src} to ${dst}`)
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE_URL,
  plugins: [vue(), cloneIndexHtmlPlugin()],
  resolve: {
    alias: [{ find: /^@\/(.+)$/, replacement: pathResolve('src', '$1') }],
  },
})
