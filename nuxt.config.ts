// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Jannchie\'s',
      short_name: 'NuxtVitePWA',
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
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
})
