import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno, presetWebFonts, transformerDirectives } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: '#03ae67',
    },
  },
  presets: [
    presetUno(),
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
