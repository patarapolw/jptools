import { existsSync, mkdirSync, copyFileSync } from 'fs'
import { resolve as pathResolve, join as pathJoin } from 'path'

import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { sync as glob } from 'fast-glob'

let BASE_URL = '/'
if (process.env.GH) {
  BASE_URL = '/jptools/'
}

function cloneIndexHtmlPlugin(): PluginOption {
  const name = 'CloneIndexHtmlPlugin'

  return {
    name,
    closeBundle: () => {
      glob('**/*.vue', {
        cwd: 'src/pages',
      }).map((p) => {
        const path = p.replace(/\.vue$/, '').replace(/\/index/, '')
        if (path !== 'index') {
          const dir = pathResolve('dist', path)
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
          }

          const src = 'dist/index.html'
          const dst = pathJoin('dist', path + '/index.html')

          copyFileSync(src, dst)
          console.log(`${name}: Copied ${src} to ${dst}`)
        }
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
