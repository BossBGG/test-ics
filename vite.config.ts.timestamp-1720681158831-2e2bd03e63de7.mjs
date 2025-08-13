// vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/vite@5.2.10_sass@1.75.0/node_modules/vite/dist/node/index.js";
import Vue from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.2.10_vue@3.4.24/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import generateSitemap from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/vite-ssg-sitemap@0.6.1/node_modules/vite-ssg-sitemap/dist/index.js";
import Layouts from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/vite-plugin-vue-layouts@0.8.0_vite@5.2.10_vue-router@4.3.2_vue@3.4.24/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Components from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@4.16.3_vue@3.4.24/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/unplugin-auto-import@0.17.5_@vueuse+core@10.9.0_rollup@4.16.3/node_modules/unplugin-auto-import/dist/vite.js";
import Markdown from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/unplugin-vue-markdown@0.25.2_rollup@4.16.3_vite@5.2.10/node_modules/unplugin-vue-markdown/dist/vite.js";
import VueMacros from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/unplugin-vue-macros@2.9.1_@vueuse+core@10.9.0_rollup@4.16.3_typescript@5.4.5_vite@5.2.10_vue@3.4.24/node_modules/unplugin-vue-macros/dist/vite.mjs";
import VueI18n from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/@intlify+unplugin-vue-i18n@2.0.0_rollup@4.16.3_vue-i18n@9.13.1/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import VueDevTools from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/vite-plugin-vue-devtools@1.0.0-rc.8_pug@3.0.2_rollup@4.16.3_vite@5.2.10/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import LinkAttributes from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/markdown-it-link-attributes@4.0.1/node_modules/markdown-it-link-attributes/index.js";
import Shiki from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/markdown-it-shikiji@0.9.19/node_modules/markdown-it-shikiji/dist/index.mjs";
import WebfontDownload from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/vite-plugin-webfont-dl@3.9.3_vite@5.2.10/node_modules/vite-plugin-webfont-dl/dist/index.mjs";
import VueRouter from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/unplugin-vue-router@0.7.0_rollup@4.16.3_vue-router@4.3.2_vue@3.4.24/node_modules/unplugin-vue-router/dist/vite.mjs";
import { VueRouterAutoImports } from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/unplugin-vue-router@0.7.0_rollup@4.16.3_vue-router@4.3.2_vue@3.4.24/node_modules/unplugin-vue-router/dist/index.mjs";
import { quasar, transformAssetUrls } from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/@quasar+vite-plugin@1.6.0_@vitejs+plugin-vue@5.0.4_quasar@2.15.3_vite@5.2.10_vue@3.4.24/node_modules/@quasar/vite-plugin/src/index.js";
import { QuasarResolver } from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@4.16.3_vue@3.4.24/node_modules/unplugin-vue-components/dist/resolvers.js";
import viteSSR from "file:///Users/apple/Documents/Merge/Product/ics-y3-fe/node_modules/.pnpm/vite-ssr@0.17.1_@vitejs+plugin-vue@5.0.4_@vueuse+head@2.0.0_react@18.2.0_rollup@4.16.3_vite@5_3mrazww75elpodv6o2nog2qrty/node_modules/vite-ssr/plugin.js";
var __vite_injected_original_dirname = "/Users/apple/Documents/Merge/Product/ics-y3-fe";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`,
      "@scss/": `${path.resolve(__vite_injected_original_dirname, "src")}/styles/scss/`,
      "@style": `${path.resolve(__vite_injected_original_dirname, "src")}/styles/scss/style.scss`,
      "@img": `${path.resolve(__vite_injected_original_dirname, "public")}/assets/images`
    }
  },
  define: {
    "global": {},
    "process.env": {}
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    }
  },
  plugins: [
    viteSSR(),
    quasar({
      sassVariables: "src/styles/quasar-variables.scss"
    }),
    VueMacros({
      plugins: {
        vue: Vue({
          template: { transformAssetUrls },
          reactivityTransform: true,
          include: [/\.vue$/, /\.md$/],
          script: {
            defineModel: true
          }
        })
      }
    }),
    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: [".vue", ".md"],
      dts: "src/typed-router.d.ts"
    }),
    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        "vue",
        "vue-i18n",
        "@vueuse/head",
        "@vueuse/core",
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          "vue-router/auto": ["useLink"]
        }
      ],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/composables", "src/stores"],
      vueTemplate: true
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      resolvers: [QuasarResolver()],
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue", "md"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/components.d.ts"
    }),
    // https://github.com/unplugin/unplugin-vue-markdown
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
    Markdown({
      wrapperClasses: "prose prose-sm m-auto text-left",
      headEnabled: true,
      async markdownItSetup(md) {
        md.use(LinkAttributes, {
          matcher: (link) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener"
          }
        });
        if (typeof window !== "undefined") {
          md.use(
            await Shiki({
              defaultColor: false,
              themes: {
                light: "vitesse-light",
                dark: "vitesse-dark"
              }
            })
          );
        }
      }
    }),
    // https://github.com/antfu/vite-plugin-pwa
    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__vite_injected_original_dirname, "locales/**")]
    }),
    // https://github.com/feat-agency/vite-plugin-webfont-dl
    WebfontDownload(),
    // https://github.com/webfansplz/vite-plugin-vue-devtools
    VueDevTools()
  ],
  // https://github.com/vitest-dev/vitest
  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom"
  },
  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: "async",
    formatting: "minify",
    crittersOptions: {
      reduceInlineStyles: false
    },
    onFinished() {
      generateSitemap();
    }
  },
  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: [
      "workbox-window",
      /vue-i18n/,
      "@quasar",
      "install-quasar.js",
      "quasar",
      "quasar/plugins",
      "quasar/plugins/platform",
      "@dsb-norge/vue-keycloak-js",
      "@quasar/vite-plugin",
      "axios"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXBwbGUvRG9jdW1lbnRzL01lcmdlL1Byb2R1Y3QvaWNzLXkzLWZlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXBwbGUvRG9jdW1lbnRzL01lcmdlL1Byb2R1Y3QvaWNzLXkzLWZlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hcHBsZS9Eb2N1bWVudHMvTWVyZ2UvUHJvZHVjdC9pY3MteTMtZmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgZ2VuZXJhdGVTaXRlbWFwIGZyb20gJ3ZpdGUtc3NnLXNpdGVtYXAnXG5pbXBvcnQgTGF5b3V0cyBmcm9tICd2aXRlLXBsdWdpbi12dWUtbGF5b3V0cydcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IE1hcmtkb3duIGZyb20gJ3VucGx1Z2luLXZ1ZS1tYXJrZG93bi92aXRlJ1xuaW1wb3J0IFZ1ZU1hY3JvcyBmcm9tICd1bnBsdWdpbi12dWUtbWFjcm9zL3ZpdGUnXG5pbXBvcnQgVnVlSTE4biBmcm9tICdAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlJ1xuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcbmltcG9ydCBMaW5rQXR0cmlidXRlcyBmcm9tICdtYXJrZG93bi1pdC1saW5rLWF0dHJpYnV0ZXMnXG5pbXBvcnQgU2hpa2kgZnJvbSAnbWFya2Rvd24taXQtc2hpa2lqaSdcbmltcG9ydCBXZWJmb250RG93bmxvYWQgZnJvbSAndml0ZS1wbHVnaW4td2ViZm9udC1kbCdcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xuaW1wb3J0IHsgVnVlUm91dGVyQXV0b0ltcG9ydHMgfSBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyJ1xuaW1wb3J0IHsgcXVhc2FyLCB0cmFuc2Zvcm1Bc3NldFVybHMgfSBmcm9tICdAcXVhc2FyL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IHsgUXVhc2FyUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgdml0ZVNTUiBmcm9tICd2aXRlLXNzci9wbHVnaW4uanMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ34vJzogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpfS9gLFxuICAgICAgJ0BzY3NzLyc6IGAke3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKX0vc3R5bGVzL3Njc3MvYCxcbiAgICAgICdAc3R5bGUnOiBgJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyl9L3N0eWxlcy9zY3NzL3N0eWxlLnNjc3NgLFxuICAgICAgJ0BpbWcnOiBgJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJyl9L2Fzc2V0cy9pbWFnZXNgLFxuICAgIH0sXG4gIH0sXG4gIGRlZmluZToge1xuICAgICdnbG9iYWwnOiB7fSxcbiAgICAncHJvY2Vzcy5lbnYnOiB7fSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIGRlZmluZToge1xuICAgICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHZpdGVTU1IoKSxcbiAgICBxdWFzYXIoe1xuICAgICAgc2Fzc1ZhcmlhYmxlczogJ3NyYy9zdHlsZXMvcXVhc2FyLXZhcmlhYmxlcy5zY3NzJyxcbiAgICB9KSxcbiAgICBWdWVNYWNyb3Moe1xuICAgICAgcGx1Z2luczoge1xuICAgICAgICB2dWU6IFZ1ZSh7XG4gICAgICAgICAgdGVtcGxhdGU6IHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0sXG4gICAgICAgICAgcmVhY3Rpdml0eVRyYW5zZm9ybTogdHJ1ZSxcbiAgICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL10sXG4gICAgICAgICAgc2NyaXB0OiB7XG4gICAgICAgICAgICBkZWZpbmVNb2RlbDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9zdmEvdW5wbHVnaW4tdnVlLXJvdXRlclxuICAgIFZ1ZVJvdXRlcih7XG4gICAgICBleHRlbnNpb25zOiBbJy52dWUnLCAnLm1kJ10sXG4gICAgICBkdHM6ICdzcmMvdHlwZWQtcm91dGVyLmQudHMnLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0pvaG5DYW1waW9uSnIvdml0ZS1wbHVnaW4tdnVlLWxheW91dHNcbiAgICBMYXlvdXRzKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tYXV0by1pbXBvcnRcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgICd2dWUtaTE4bicsXG4gICAgICAgICdAdnVldXNlL2hlYWQnLFxuICAgICAgICAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgICAgVnVlUm91dGVyQXV0b0ltcG9ydHMsXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBhZGQgYW55IG90aGVyIGltcG9ydHMgeW91IHdlcmUgcmVseWluZyBvblxuICAgICAgICAgICd2dWUtcm91dGVyL2F1dG8nOiBbJ3VzZUxpbmsnXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgZGlyczogWydzcmMvY29tcG9zYWJsZXMnLCAnc3JjL3N0b3JlcyddLFxuICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW1F1YXNhclJlc29sdmVyKCldLFxuICAgICAgLy8gYWxsb3cgYXV0byBsb2FkIG1hcmtkb3duIGNvbXBvbmVudHMgdW5kZXIgYC4vc3JjL2NvbXBvbmVudHMvYFxuICAgICAgZXh0ZW5zaW9uczogWyd2dWUnLCAnbWQnXSxcbiAgICAgIC8vIGFsbG93IGF1dG8gaW1wb3J0IGFuZCByZWdpc3RlciBjb21wb25lbnRzIHVzZWQgaW4gbWFya2Rvd25cbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXG4gICAgICBkdHM6ICdzcmMvY29tcG9uZW50cy5kLnRzJyxcbiAgICB9KSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bnBsdWdpbi91bnBsdWdpbi12dWUtbWFya2Rvd25cbiAgICAvLyBEb24ndCBuZWVkIHRoaXM/IFRyeSB2aXRlc3NlLWxpdGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS92aXRlc3NlLWxpdGVcbiAgICBNYXJrZG93bih7XG4gICAgICB3cmFwcGVyQ2xhc3NlczogJ3Byb3NlIHByb3NlLXNtIG0tYXV0byB0ZXh0LWxlZnQnLFxuICAgICAgaGVhZEVuYWJsZWQ6IHRydWUsXG4gICAgICBhc3luYyBtYXJrZG93bkl0U2V0dXAobWQpIHtcbiAgICAgICAgbWQudXNlKExpbmtBdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgbWF0Y2hlcjogKGxpbms6IHN0cmluZykgPT4gL15odHRwcz86XFwvXFwvLy50ZXN0KGxpbmspLFxuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnLFxuICAgICAgICAgICAgcmVsOiAnbm9vcGVuZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC8vIFNraXAgYnJvd3Nlci1zcGVjaWZpYyBjb2RlIGR1cmluZyB0aGUgYnVpbGQgcHJvY2Vzc1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBtZC51c2UoXG4gICAgICAgICAgICBhd2FpdCBTaGlraSh7XG4gICAgICAgICAgICAgIGRlZmF1bHRDb2xvcjogZmFsc2UsXG4gICAgICAgICAgICAgIHRoZW1lczoge1xuICAgICAgICAgICAgICAgIGxpZ2h0OiAndml0ZXNzZS1saWdodCcsXG4gICAgICAgICAgICAgICAgZGFyazogJ3ZpdGVzc2UtZGFyaycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tcHdhXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaW50bGlmeS9idW5kbGUtdG9vbHMvdHJlZS9tYWluL3BhY2thZ2VzL3VucGx1Z2luLXZ1ZS1pMThuXG4gICAgVnVlSTE4bih7XG4gICAgICBydW50aW1lT25seTogdHJ1ZSxcbiAgICAgIGNvbXBvc2l0aW9uT25seTogdHJ1ZSxcbiAgICAgIGZ1bGxJbnN0YWxsOiB0cnVlLFxuICAgICAgaW5jbHVkZTogW3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdsb2NhbGVzLyoqJyldLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZlYXQtYWdlbmN5L3ZpdGUtcGx1Z2luLXdlYmZvbnQtZGxcbiAgICBXZWJmb250RG93bmxvYWQoKSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJmYW5zcGx6L3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29sc1xuICAgIFZ1ZURldlRvb2xzKCksXG4gIF0sXG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVzdC1kZXYvdml0ZXN0XG4gIHRlc3Q6IHtcbiAgICBpbmNsdWRlOiBbJ3Rlc3QvKiovKi50ZXN0LnRzJ10sXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gIH0sXG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtc3NnXG4gIHNzZ09wdGlvbnM6IHtcbiAgICBzY3JpcHQ6ICdhc3luYycsXG4gICAgZm9ybWF0dGluZzogJ21pbmlmeScsXG4gICAgY3JpdHRlcnNPcHRpb25zOiB7XG4gICAgICByZWR1Y2VJbmxpbmVTdHlsZXM6IGZhbHNlLFxuICAgIH0sXG4gICAgb25GaW5pc2hlZCgpIHtcbiAgICAgIGdlbmVyYXRlU2l0ZW1hcCgpXG4gICAgfSxcbiAgfSxcblxuICBzc3I6IHtcbiAgICAvLyBUT0RPOiB3b3JrYXJvdW5kIHVudGlsIHRoZXkgc3VwcG9ydCBuYXRpdmUgRVNNXG4gICAgbm9FeHRlcm5hbDogW1xuICAgICAgJ3dvcmtib3gtd2luZG93JyxcbiAgICAgIC92dWUtaTE4bi8sXG4gICAgICAnQHF1YXNhcicsXG4gICAgICAnaW5zdGFsbC1xdWFzYXIuanMnLFxuICAgICAgJ3F1YXNhcicsXG4gICAgICAncXVhc2FyL3BsdWdpbnMnLFxuICAgICAgJ3F1YXNhci9wbHVnaW5zL3BsYXRmb3JtJyxcbiAgICAgICdAZHNiLW5vcmdlL3Z1ZS1rZXljbG9hay1qcycsXG4gICAgICAnQHF1YXNhci92aXRlLXBsdWdpbicsXG4gICAgICAnYXhpb3MnLFxuICAgIF0sXG4gIH0sXG59KVxuIl0sCiAg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
