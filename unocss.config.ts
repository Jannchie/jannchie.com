import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind3, transformerDirectives } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: '#03ae67',
      bg: {
        1: 'var(--j-bg-1)',
        2: 'var(--j-bg-2)',
        3: 'var(--j-bg-3)',
      },
      fg: {
        1: 'var(--j-fg-1)',
        2: 'var(--j-fg-2)',
        3: 'var(--j-fg-3)',
      },
      bd: 'var(--j-bd)',
    },
  },
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx?|mdx?|astro|elm|php|phtml|html)($|\?)/],
    },
  },
  shortcuts: [
    ['border-default', 'border-zinc-300 dark:border-zinc-700'],
  ],
  presets: [
    presetWind3({
      dark: {
        dark: '[data-scheme="dark"]',
        light: '[data-scheme="light"]',
      },
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500',
        mono: 'Fira Code',
      },
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],

})
