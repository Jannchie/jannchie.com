<script setup>
import { useCursor } from 'ipad-cursor/vue'
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
if (typeof window !== 'undefined' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  const { updateCursor } = useCursor({
    enableMouseDownEffect: true,
    enableAutoTextCursor: true,
    enableLighting: true,
  })
  const targetNode = document.body
  const callback = function () {
    updateCursor()
  }
  const observer = new MutationObserver(callback)
  observer.observe(targetNode, { childList: true, subtree: true })
}
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
  --j-main: #23a1c0;
  --j-bg-1: #fff;
  --j-bg-2: #f9f9f9;
  --j-bg-3: #f9f9f9;
  --j-fg-1: #333;
  --j-fg-2: #222;
  --j-fg-3: #161718;
  font-family: 'HarmonyOS_Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

[color-scheme="dark"] {
  --j-bg-1: #333;
  --j-bg-2: #222;
  --j-bg-3: #161718;
  --j-fg-1: #fff;
  --j-fg-2: #fafafa;
  --j-fg-3: #f9f9f9;
}

[data-cursor="block"] {
  @apply border border-transparent hover:border-bg-2 rounded-lg transition-all duration-300;
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
