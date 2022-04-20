# Multiple page Vite on Github Pages with HTML5 History Mode

Indeed, one of the way is simply [pre-render](https://vitejs.dev/guide/ssr.html) (e.g. with [vite-plugin-ssr](https://vite-plugin-ssr.com/)).

Nonetheless, it is possible to enable fallback (without redirect settings, which doesn't exist in Github Pages), if you don't want to pre-render, and sacrifice JavaScript-ness yet. The way is, to clone `dist/index.html` to `dist/sub/route/index.html`. (SSG's also have multple `**/index.html`.)

```ts
import { existsSync, mkdirSync, copyFileSync } from 'fs'
import { resolve as pathResolve, join as pathJoin } from 'path'

function cloneIndexHtmlPlugin(routes: string[] = []): PluginOption {
  const name = 'CloneIndexHtmlPlugin'
  const outDir = 'dist' // config's `build.outDir`
  const src = pathJoin(outDir, 'index.html')

  return {
    name,
    closeBundle: () => {
      // routes.push(...)

      routes.map((p) => {
        const dir = pathResolve(outDir, p)
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true })
        }

        const dst = pathJoin(outDir, p, 'index.html')

        // It is possible to edit HTML here, too.
        copyFileSync(src, dst)
        console.log(`${name}: Copied ${src} to ${dst}`)
      })
    },
  }
}
```

And put the plugin in `vite.config.ts`

```js
// https://vitejs.dev/config/
export default {
  base: `/${GITHUB_REPO_NAME}/`
  plugins: [cloneIndexHtmlPlugin()],
}
```

## Integrating with Vue 3 and Vue Router 4

`VueRouter` makes navigating easier, without full page reload; however, it does need a little extra config - `baseURL`.

```ts
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Define your routes here
  ],
})
```

[Route names can be glob](https://vitejs.dev/guide/features.html#glob-import) dynamically with `import.meta.glob`.

```ts
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Does not allow string templating - `${PAGE_DIR}/**/*${PAGE_EXT}` does not work.
    ...Object.entries(import.meta.glob('../pages/**/*.vue')).map(
      ([p, component]) => {
        const PAGE_DIR = '../pages'
        const PAGE_EXT = '.vue'
        const PAGE_INDEX = 'index'

        let path = p.substring(PAGE_DIR.length, p.length - PAGE_EXT.length)
        if (path.endsWith(PAGE_INDEX)) {
          path = path.substring(0, path.length - PAGE_INDEX.length - 1)
        }
        if (!path) {
          path = '/'
        }

        return {
          path,
          component,
        }
      },
    ),
  ],
})
```

`cloneIndexHtmlPlugin` should also glob - `fast-glob` is what `import.meta.glob` uses, so copy it.

```ts
import { sync as glob } from 'fast-glob'

// ...

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
```
