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
</script>

<template>
  <div>
    <VitePwaManifest />
    <ReloadPrompt />
    <div
      v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
      class="pwa-toast"
      role="alert"
    >
      <div class="message">
        <span>
          Install PWA
        </span>
      </div>
      <button @click="$pwa.install()">
        Install
      </button>
      <button @click="$pwa.cancelInstall()">
        Cancel
      </button>
    </div>
    <NuxtPage />
  </div>
</template>

<style>
:root {
  color-scheme: light dark;
}

::selection {
  background-color: #444; /* 设置选中背景颜色 */
}
</style>
