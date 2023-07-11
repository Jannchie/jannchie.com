// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
    typedPages: true,
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-fonts',
    '@vite-pwa/nuxt',
    '@unocss/nuxt',
  ],
  eslint: {
    lintOnStart: false,
  },
  content: {
    highlight: {
      theme: 'github-dark',
    },
    markdown: {
      remarkPlugins: [
        'remark-math',
      ],
      rehypePlugins: {
        'rehype-katex': {
          output: 'html', // the default value is 'htmlAndMathml'
        },
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
})
