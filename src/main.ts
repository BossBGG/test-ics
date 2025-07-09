import viteSSR from 'vite-ssr'
import { setupLayouts } from 'virtual:generated-layouts'

// import Previewer from 'virtual:vue-component-preview'
import { routes } from 'vue-router/auto/routes'
import App from './App.vue'
import type { UserModule } from './types'

import './styles/main.css'
import '@scss/_reset.scss'
import '@scss/style.scss'

// const routes = setupLayouts(generatedRoutes)
const xRoutes = routes.map(r => {
  if (r.path === '/createbp') {
    const firstChild = r.children[0]
    r.children?.push({ ...firstChild, path: '', name: '/createbp' })
  }
  if (r.path === '/application') {
    const firstChild = r.children[0]
    r.children?.push({ ...firstChild, path: '', name: '/application' })
  }
  return r
})

// console.log(xRoutes);

import { installKeycloak } from './keycloak'

export default viteSSR(App, { routes: setupLayouts(xRoutes) }, async (ctx) => {

  await installKeycloak(ctx)

  Object.values(
    import.meta.glob<{ install: UserModule }>('./modules/*.ts', {
      eager: true,
    }),
  ).forEach((i) => {
    i.install?.(ctx)
  })

})
