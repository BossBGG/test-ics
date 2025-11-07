// vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/vite@5.4.10_@types+node@24.0.2_sass@1.80.5/node_modules/vite/dist/node/index.js";
import Vue from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.10_vue@3.5.12/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import generateSitemap from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/vite-ssg-sitemap@0.6.1/node_modules/vite-ssg-sitemap/dist/index.js";
import Layouts from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/vite-plugin-vue-layouts@0.8.0_vite@5.4.10_vue-router@4.4.5_vue@3.5.12/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Components from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@4.24.3_vue@3.5.12/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.1_rollup@4.24.3/node_modules/unplugin-auto-import/dist/vite.js";
import Markdown from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/unplugin-vue-markdown@0.25.2_rollup@4.24.3_vite@5.4.10/node_modules/unplugin-vue-markdown/dist/vite.js";
import VueMacros from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/unplugin-vue-macros@2.13.3_@vueuse+core@10.11.1_esbuild@0.23.1_rollup@4.24.3_typescript@5.6.3_32ilhe3w3m5h5ex3mhpujjczhi/node_modules/unplugin-vue-macros/dist/vite.js";
import VueI18n from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/@intlify+unplugin-vue-i18n@2.0.0_rollup@4.24.3_vue-i18n@9.14.1/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import VueDevTools from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/vite-plugin-vue-devtools@1.0.0-rc.8_pug@3.0.3_rollup@4.24.3_vite@5.4.10/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import LinkAttributes from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/markdown-it-link-attributes@4.0.1/node_modules/markdown-it-link-attributes/index.js";
import Shiki from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/markdown-it-shikiji@0.9.19/node_modules/markdown-it-shikiji/dist/index.mjs";
import WebfontDownload from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/vite-plugin-webfont-dl@3.9.5_vite@5.4.10/node_modules/vite-plugin-webfont-dl/dist/index.mjs";
import VueRouter from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/unplugin-vue-router@0.7.0_rollup@4.24.3_vue-router@4.4.5_vue@3.5.12/node_modules/unplugin-vue-router/dist/vite.mjs";
import { VueRouterAutoImports } from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/unplugin-vue-router@0.7.0_rollup@4.24.3_vue-router@4.4.5_vue@3.5.12/node_modules/unplugin-vue-router/dist/index.mjs";
import { quasar, transformAssetUrls } from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/@quasar+vite-plugin@1.8.0_@vitejs+plugin-vue@5.1.4_quasar@2.17.1_vite@5.4.10_vue@3.5.12/node_modules/@quasar/vite-plugin/src/index.js";
import { QuasarResolver } from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@4.24.3_vue@3.5.12/node_modules/unplugin-vue-components/dist/resolvers.js";
import viteSSR from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/vite-ssr@0.17.2_@vitejs+plugin-vue@5.1.4_@vueuse+head@2.0.0_react@18.3.1_rollup@4.24.3_vite@5_4yrvuddo7cjceihloaqn6ntaqq/node_modules/vite-ssr/plugin.js";
import tailwindcss from "file:///D:/Save%20VS/pea-service-d-ics-y3-frontend/pea-service-d-ics-y3-frontend/node_modules/.pnpm/@tailwindcss+vite@4.1.10_vite@5.4.10/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\Save VS\\pea-service-d-ics-y3-frontend\\pea-service-d-ics-y3-frontend";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`,
      "@scss/": `${path.resolve(__vite_injected_original_dirname, "src")}/styles/scss/`,
      "@style": `${path.resolve(__vite_injected_original_dirname, "src")}/styles/scss/style.scss`,
      "@img": `${path.resolve(__vite_injected_original_dirname, "public")}/assets/images`,
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  define: {
    global: {},
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
      sassVariables: "/src/styles/quasar-variables.scss"
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
    VueDevTools(),
    tailwindcss()
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxTYXZlIFZTXFxcXHBlYS1zZXJ2aWNlLWQtaWNzLXkzLWZyb250ZW5kXFxcXHBlYS1zZXJ2aWNlLWQtaWNzLXkzLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxTYXZlIFZTXFxcXHBlYS1zZXJ2aWNlLWQtaWNzLXkzLWZyb250ZW5kXFxcXHBlYS1zZXJ2aWNlLWQtaWNzLXkzLWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9TYXZlJTIwVlMvcGVhLXNlcnZpY2UtZC1pY3MteTMtZnJvbnRlbmQvcGVhLXNlcnZpY2UtZC1pY3MteTMtZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCBWdWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgZ2VuZXJhdGVTaXRlbWFwIGZyb20gXCJ2aXRlLXNzZy1zaXRlbWFwXCI7XHJcbmltcG9ydCBMYXlvdXRzIGZyb20gXCJ2aXRlLXBsdWdpbi12dWUtbGF5b3V0c1wiO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xyXG5pbXBvcnQgTWFya2Rvd24gZnJvbSBcInVucGx1Z2luLXZ1ZS1tYXJrZG93bi92aXRlXCI7XHJcbmltcG9ydCBWdWVNYWNyb3MgZnJvbSBcInVucGx1Z2luLXZ1ZS1tYWNyb3Mvdml0ZVwiO1xyXG5pbXBvcnQgVnVlSTE4biBmcm9tIFwiQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZVwiO1xyXG5pbXBvcnQgVnVlRGV2VG9vbHMgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29sc1wiO1xyXG5pbXBvcnQgTGlua0F0dHJpYnV0ZXMgZnJvbSBcIm1hcmtkb3duLWl0LWxpbmstYXR0cmlidXRlc1wiO1xyXG5pbXBvcnQgU2hpa2kgZnJvbSBcIm1hcmtkb3duLWl0LXNoaWtpamlcIjtcclxuaW1wb3J0IFdlYmZvbnREb3dubG9hZCBmcm9tIFwidml0ZS1wbHVnaW4td2ViZm9udC1kbFwiO1xyXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gXCJ1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGVcIjtcclxuaW1wb3J0IHsgVnVlUm91dGVyQXV0b0ltcG9ydHMgfSBmcm9tIFwidW5wbHVnaW4tdnVlLXJvdXRlclwiO1xyXG5pbXBvcnQgeyBxdWFzYXIsIHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gXCJAcXVhc2FyL3ZpdGUtcGx1Z2luXCI7XHJcbmltcG9ydCB7IFF1YXNhclJlc29sdmVyIH0gZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVyc1wiO1xyXG5pbXBvcnQgdml0ZVNTUiBmcm9tIFwidml0ZS1zc3IvcGx1Z2luLmpzXCI7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tIFwiQHRhaWx3aW5kY3NzL3ZpdGVcIjtcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIn4vXCI6IGAke3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpfS9gLFxyXG4gICAgICBcIkBzY3NzL1wiOiBgJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKX0vc3R5bGVzL3Njc3MvYCxcclxuICAgICAgXCJAc3R5bGVcIjogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIil9L3N0eWxlcy9zY3NzL3N0eWxlLnNjc3NgLFxyXG4gICAgICBcIkBpbWdcIjogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJwdWJsaWNcIil9L2Fzc2V0cy9pbWFnZXNgLFxyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIGdsb2JhbDoge30sXHJcbiAgICBcInByb2Nlc3MuZW52XCI6IHt9LFxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICBkZWZpbmU6IHtcclxuICAgICAgICBnbG9iYWw6IFwiZ2xvYmFsVGhpc1wiLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZpdGVTU1IoKSxcclxuICAgIHF1YXNhcih7XHJcbiAgICAgIHNhc3NWYXJpYWJsZXM6IFwiL3NyYy9zdHlsZXMvcXVhc2FyLXZhcmlhYmxlcy5zY3NzXCIsXHJcbiAgICB9KSxcclxuICAgIFZ1ZU1hY3Jvcyh7XHJcbiAgICAgIHBsdWdpbnM6IHtcclxuICAgICAgICB2dWU6IFZ1ZSh7XHJcbiAgICAgICAgICB0ZW1wbGF0ZTogeyB0cmFuc2Zvcm1Bc3NldFVybHMgfSxcclxuICAgICAgICAgIHJlYWN0aXZpdHlUcmFuc2Zvcm06IHRydWUsXHJcbiAgICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL10sXHJcbiAgICAgICAgICBzY3JpcHQ6IHtcclxuICAgICAgICAgICAgZGVmaW5lTW9kZWw6IHRydWUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcblxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Bvc3ZhL3VucGx1Z2luLXZ1ZS1yb3V0ZXJcclxuICAgIFZ1ZVJvdXRlcih7XHJcbiAgICAgIGV4dGVuc2lvbnM6IFtcIi52dWVcIiwgXCIubWRcIl0sXHJcbiAgICAgIGR0czogXCJzcmMvdHlwZWQtcm91dGVyLmQudHNcIixcclxuICAgIH0pLFxyXG5cclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Kb2huQ2FtcGlvbkpyL3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzXHJcbiAgICBMYXlvdXRzKCksXHJcblxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0XHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgIFwidnVlXCIsXHJcbiAgICAgICAgXCJ2dWUtaTE4blwiLFxyXG4gICAgICAgIFwiQHZ1ZXVzZS9oZWFkXCIsXHJcbiAgICAgICAgXCJAdnVldXNlL2NvcmVcIixcclxuICAgICAgICBWdWVSb3V0ZXJBdXRvSW1wb3J0cyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAvLyBhZGQgYW55IG90aGVyIGltcG9ydHMgeW91IHdlcmUgcmVseWluZyBvblxyXG4gICAgICAgICAgXCJ2dWUtcm91dGVyL2F1dG9cIjogW1widXNlTGlua1wiXSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBkdHM6IFwic3JjL2F1dG8taW1wb3J0cy5kLnRzXCIsXHJcbiAgICAgIGRpcnM6IFtcInNyYy9jb21wb3NhYmxlc1wiLCBcInNyYy9zdG9yZXNcIl0sXHJcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxyXG4gICAgfSksXHJcblxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbUXVhc2FyUmVzb2x2ZXIoKV0sXHJcbiAgICAgIC8vIGFsbG93IGF1dG8gbG9hZCBtYXJrZG93biBjb21wb25lbnRzIHVuZGVyIGAuL3NyYy9jb21wb25lbnRzL2BcclxuICAgICAgZXh0ZW5zaW9uczogW1widnVlXCIsIFwibWRcIl0sXHJcbiAgICAgIC8vIGFsbG93IGF1dG8gaW1wb3J0IGFuZCByZWdpc3RlciBjb21wb25lbnRzIHVzZWQgaW4gbWFya2Rvd25cclxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvXSxcclxuICAgICAgZHRzOiBcInNyYy9jb21wb25lbnRzLmQudHNcIixcclxuICAgIH0pLFxyXG5cclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bnBsdWdpbi91bnBsdWdpbi12dWUtbWFya2Rvd25cclxuICAgIC8vIERvbid0IG5lZWQgdGhpcz8gVHJ5IHZpdGVzc2UtbGl0ZTogaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGVzc2UtbGl0ZVxyXG4gICAgTWFya2Rvd24oe1xyXG4gICAgICB3cmFwcGVyQ2xhc3NlczogXCJwcm9zZSBwcm9zZS1zbSBtLWF1dG8gdGV4dC1sZWZ0XCIsXHJcbiAgICAgIGhlYWRFbmFibGVkOiB0cnVlLFxyXG4gICAgICBhc3luYyBtYXJrZG93bkl0U2V0dXAobWQpIHtcclxuICAgICAgICBtZC51c2UoTGlua0F0dHJpYnV0ZXMsIHtcclxuICAgICAgICAgIG1hdGNoZXI6IChsaW5rOiBzdHJpbmcpID0+IC9eaHR0cHM/OlxcL1xcLy8udGVzdChsaW5rKSxcclxuICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgIHRhcmdldDogXCJfYmxhbmtcIixcclxuICAgICAgICAgICAgcmVsOiBcIm5vb3BlbmVyXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFNraXAgYnJvd3Nlci1zcGVjaWZpYyBjb2RlIGR1cmluZyB0aGUgYnVpbGQgcHJvY2Vzc1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICBtZC51c2UoXHJcbiAgICAgICAgICAgIGF3YWl0IFNoaWtpKHtcclxuICAgICAgICAgICAgICBkZWZhdWx0Q29sb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRoZW1lczoge1xyXG4gICAgICAgICAgICAgICAgbGlnaHQ6IFwidml0ZXNzZS1saWdodFwiLFxyXG4gICAgICAgICAgICAgICAgZGFyazogXCJ2aXRlc3NlLWRhcmtcIixcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcblxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtcGx1Z2luLXB3YVxyXG5cclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pbnRsaWZ5L2J1bmRsZS10b29scy90cmVlL21haW4vcGFja2FnZXMvdW5wbHVnaW4tdnVlLWkxOG5cclxuICAgIFZ1ZUkxOG4oe1xyXG4gICAgICBydW50aW1lT25seTogdHJ1ZSxcclxuICAgICAgY29tcG9zaXRpb25Pbmx5OiB0cnVlLFxyXG4gICAgICBmdWxsSW5zdGFsbDogdHJ1ZSxcclxuICAgICAgaW5jbHVkZTogW3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwibG9jYWxlcy8qKlwiKV0sXHJcbiAgICB9KSxcclxuXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmVhdC1hZ2VuY3kvdml0ZS1wbHVnaW4td2ViZm9udC1kbFxyXG4gICAgV2ViZm9udERvd25sb2FkKCksXHJcblxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYmZhbnNwbHovdml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzXHJcbiAgICBWdWVEZXZUb29scygpLFxyXG4gICAgdGFpbHdpbmRjc3MoKSxcclxuICBdLFxyXG5cclxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZXN0LWRldi92aXRlc3RcclxuICB0ZXN0OiB7XHJcbiAgICBpbmNsdWRlOiBbXCJ0ZXN0LyoqLyoudGVzdC50c1wiXSxcclxuICAgIGVudmlyb25tZW50OiBcImpzZG9tXCIsXHJcbiAgfSxcclxuXHJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtc3NnXHJcbiAgc3NnT3B0aW9uczoge1xyXG4gICAgc2NyaXB0OiBcImFzeW5jXCIsXHJcbiAgICBmb3JtYXR0aW5nOiBcIm1pbmlmeVwiLFxyXG4gICAgY3JpdHRlcnNPcHRpb25zOiB7XHJcbiAgICAgIHJlZHVjZUlubGluZVN0eWxlczogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgb25GaW5pc2hlZCgpIHtcclxuICAgICAgZ2VuZXJhdGVTaXRlbWFwKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIHNzcjoge1xyXG4gICAgLy8gVE9ETzogd29ya2Fyb3VuZCB1bnRpbCB0aGV5IHN1cHBvcnQgbmF0aXZlIEVTTVxyXG4gICAgbm9FeHRlcm5hbDogW1xyXG4gICAgICBcIndvcmtib3gtd2luZG93XCIsXHJcbiAgICAgIC92dWUtaTE4bi8sXHJcbiAgICAgIFwiQHF1YXNhclwiLFxyXG4gICAgICBcImluc3RhbGwtcXVhc2FyLmpzXCIsXHJcbiAgICAgIFwicXVhc2FyXCIsXHJcbiAgICAgIFwicXVhc2FyL3BsdWdpbnNcIixcclxuICAgICAgXCJxdWFzYXIvcGx1Z2lucy9wbGF0Zm9ybVwiLFxyXG4gICAgICBcIkBkc2Itbm9yZ2UvdnVlLWtleWNsb2FrLWpzXCIsXHJcbiAgICAgIFwiQHF1YXNhci92aXRlLXBsdWdpblwiLFxyXG4gICAgICBcImF4aW9zXCIsXHJcbiAgICBdLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThZLE9BQU8sVUFBVTtBQUMvWixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sY0FBYztBQUNyQixPQUFPLGVBQWU7QUFDdEIsT0FBTyxhQUFhO0FB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
