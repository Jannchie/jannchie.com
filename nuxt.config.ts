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
  },
})
