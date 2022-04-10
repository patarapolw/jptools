// @ts-ignore
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// @ts-ignore
const __IS_GITHUB_PAGES__ = process.env.GH

// https://vitejs.dev/config/
export default defineConfig({
  base: __IS_GITHUB_PAGES__ ? '/jptools/' : '',
  plugins: [vue()],
  define: {
    __IS_GITHUB_PAGES__
  },
  resolve: {
    alias: [{ find: /^@\/(.+)$/, replacement: path.resolve('src', '$1') }]
  }
})
