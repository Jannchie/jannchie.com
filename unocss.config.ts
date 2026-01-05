import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind3, transformerDirectives } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: '#03ae67',
      bg: {
        base: 'var(--j-bg-base)',
        variant: 'var(--j-bg-variant)',
      },
      fg: {
        1: 'var(--j-fg-1)',
        2: 'var(--j-fg-2)',
        3: 'var(--j-fg-3)',
      },
      bd: 'var(--j-border)',
    },
  },
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx?|mdx?|astro|elm|php|phtml|html)($|\?)/],
    },
  },
  shortcuts: [
    ['border-default', 'border-[var(--j-border)]'],
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
