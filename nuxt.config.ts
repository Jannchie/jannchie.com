import tailwindTypography from '@tailwindcss/typography'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-fonts',
  ],
  eslint: {
    lintOnStart: false,
  },
  tailwindcss: {
    config: {
      plugins: [tailwindTypography],
    },
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
})
