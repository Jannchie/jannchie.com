// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

export default defineNuxtConfig({
  imports: {
    dirs: ['./composables', './utils', './data'],
  },

  devtools: {
    enabled: true,
    timeline: {
      enabled: false,
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    // inlineSSRStyles: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    '@vite-pwa/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt',
  ],

  content: {
    build: {
      pathMeta: {
        slugifyOptions: {
          lower: false,
        },
      },
      markdown: {
        highlight: {
          langs: ['go', 'json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'jsx', 'tsx', 'rust', 'python', 'sql'],
          theme: 'github-dark',
        },
        remarkPlugins: {
          'remark-math': {},
        },
        rehypePlugins: {
          'rehype-katex': {
            output: 'html', // the default value is 'htmlAndMathml'
          },
        },
      },
    },
  },
  mdc: {
    highlight: {
      theme: {
        light: 'material-theme-lighter',
        default: 'material-theme',
        dark: 'material-theme-palenight',
      },
    },
  },
  googleFonts: {
    preload: true,
    prefetch: true,
    families: {
      'My Soul': true,
    },
  },

  appConfig: {
    buildDate: new Date().toISOString(),
  },

  pwa: {
    disable: process.env.NODE_ENV === 'development',
    mode: 'production',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Jannchie\'s',
      short_name: 'Jannchie\'s',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'imgs/jannchie-192.jpg',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'imgs/jannchie-512.jpg',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'imgs/jannchie-512.jpg',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    registerWebManifestInRouteRules: true,
    writePlugin: true,
    workbox: {
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/api\//],
      cleanupOutdatedCaches: true,
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: process.env.NODE_ENV === 'production' ? 3600 : 20,
    },
    devOptions: {
      enabled: false,
      navigateFallback: '/',
    },
  },

  compatibilityDate: '2025-03-28',
})
