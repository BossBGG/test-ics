import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import LinkAttributes from 'markdown-it-link-attributes'
import Shiki from 'markdown-it-shikiji'
import WebfontDownload from 'vite-plugin-webfont-dl'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { QuasarResolver } from 'unplugin-vue-components/resolvers'
import viteSSR from 'vite-ssr/plugin.js'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@scss/': `${path.resolve(__dirname, 'src')}/styles/scss/`,
      '@style': `${path.resolve(__dirname, 'src')}/styles/scss/style.scss`,
      '@img': `${path.resolve(__dirname, 'public')}/assets/images`,
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'global': {},
    'process.env': {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  plugins: [
    viteSSR(),
    quasar({
      sassVariables: '/src/styles/quasar-variables.scss',
    }),
    VueMacros({
      plugins: {
        vue: Vue({
          template: { transformAssetUrls },
          reactivityTransform: true,
          include: [/\.vue$/, /\.md$/],
          script: {
            defineModel: true,
          },
        }),
      },
    }),

    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: ['.vue', '.md'],
      dts: 'src/typed-router.d.ts',
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-i18n',
        '@vueuse/head',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink'],
          'quasar': ['useQuasar', 'date'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables', 'src/stores'],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      resolvers: [QuasarResolver()],
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),

    // https://github.com/unplugin/unplugin-vue-markdown
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
    Markdown({
      wrapperClasses: 'prose prose-sm m-auto text-left',
      headEnabled: true,
      async markdownItSetup(md) {
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
        // Skip browser-specific code during the build process
        if (typeof window !== 'undefined') {
          md.use(
            await Shiki({
              defaultColor: false,
              themes: {
                light: 'vitesse-light',
                dark: 'vitesse-dark',
              },
            }),
          )
        }
      },
    }),

    // https://github.com/antfu/vite-plugin-pwa

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/feat-agency/vite-plugin-webfont-dl
    WebfontDownload(),

    // https://github.com/webfansplz/vite-plugin-vue-devtools
    VueDevTools(),
    tailwindcss(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      reduceInlineStyles: false,
    },
    onFinished() {
      generateSitemap()
    },
  },

  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: [
      'workbox-window',
      /vue-i18n/,
      '@quasar',
      'install-quasar.js',
      'quasar',
      'quasar/plugins',
      'quasar/plugins/platform',
      '@dsb-norge/vue-keycloak-js',
      '@quasar/vite-plugin',
      'axios',
    ],
  },
})
