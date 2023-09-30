<script setup>
import { initRainy } from '@/scripts/rainy'
import '@unocss/reset/tailwind.css'

initRainy()

useSeoMeta({
  title: 'Jannchie\'s Journey as Full Stack Engineer',
  description: 'For heaven and earth, for the people\'s livelihood, for the wisdom of the ancients, for everlasting peace.',
  ogTitle: 'Jannchie\'s Journey as Full Stack Engineer',
  ogDescription: 'For heaven and earth, for the people\'s livelihood, for the wisdom of the ancients, for everlasting peace.',
  ogImage: 'https://jannchie.com/imgs/jannchie.jpg',
  ogUrl: 'https://jannchie.com',
  twitterTitle: 'Jannchie\'s Journey as Full Stack Engineer',
  twitterDescription: 'For heaven and earth, for the people\'s livelihood, for the wisdom of the ancients, for everlasting peace.',
  twitterImage: 'https://jannchie.com/imgs/jannchie.jpg',
  twitterCard: 'summary',
})

const preferredDark = usePreferredDark()

useHead({
  htmlAttrs: {
    'lang': 'en',
    'color-scheme': preferredDark ? 'dark' : 'light',
  },
  meta: {
    name: 'theme-color',
    content: '#000000',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root {
  color-scheme: light dark;
  background: var(--j-bg-3);
  --j-bg-1: #fff;
  --j-bg-2: #f9f9f9;
  --j-bg-3: #f9f9f9;
  --j-fg-1: #161718;
  --j-fg-2: #222;
  --j-fg-3: #2f2f2f;
  --j-bd: #ccc;
  color: var(--j-fg-2);
  font-family: 'HarmonyOS_Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

[color-scheme="dark"] {
  --j-bg-1: #333;
  --j-bg-2: #222;
  --j-bg-3: #161718;
  --j-fg-1: #fff;
  --j-fg-2: #ddd;
  --j-fg-3: #aaa;
  --j-bd: #333;
}

[data-cursor="block"] {
  @apply border border-transparent hover:border-bd rounded-lg transition-all duration-300;
}

::selection {
  @apply bg-bg-1 text-fg-1;
}

.page-enter-active,
.page-leave-active {
  @apply transition-all duration-300;
}
.page-enter-from,
.page-leave-to {
  @apply blur-2xl opacity-0;
}
</style>
