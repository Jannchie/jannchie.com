<script setup>
import { initCursor } from 'ipad-cursor'
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

useHead({
  htmlAttrs: {
    lang: 'en',
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

if (typeof window !== 'undefined') {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  if (!isMobile)
    initCursor({ enableAutoTextCursor: true, enableLighting: true })
}

const isClient = typeof window !== 'undefined'
</script>

<template>
  <div>
    <VitePwaManifest />
    <ReloadPrompt v-if="isClient" />
    <NuxtPage v-if="isClient" />
  </div>
</template>

<style>
:root {
  color-scheme: light dark;
  --j-bg-1: #fff;
  --j-bg-2: #ddd;
  --j-bg-3: #aaa;
  --j-fg-1: #333;
  --j-fg-2: #222;
  --j-fg-3: #111;
}

/* if preferred theme is dark: */
@media (prefers-color-scheme: dark) {
  :root {
    --j-bg-1: #333;
    --j-bg-2: #222;
    --j-bg-3: #111;
    --j-fg-1: #fff;
    --j-fg-2: #ddd;
    --j-fg-3: #aaa;
  }
}

::selection {
  background-color: #444; /* 设置选中背景颜色 */
}
</style>
