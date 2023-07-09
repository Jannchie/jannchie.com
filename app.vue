<script setup>
import { initCursor } from 'ipad-cursor'

useSeoMeta({
  title: 'Jannchie\'s Full Stack Engineer Journey',
  description: 'For heaven and earth, for the people\'s livelihood, for the wisdom of the ancients, for everlasting peace.',
  ogTitle: 'Jannchie\'s Full Stack Engineer Journey',
  ogDescription: 'For heaven and earth, for the people\'s livelihood, for the wisdom of the ancients, for everlasting peace.',
  ogImage: 'https://jannchie.com/imgs/jannchie.jpg',
  ogUrl: 'https://jannchie.com',
  twitterTitle: 'Jannchie\'s Full Stack Engineer Journey',
  twitterDescription: 'For heaven and earth, for the people\'s livelihood, for the wisdom of the ancients, for everlasting peace.',
  twitterImage: 'https://jannchie.com/imgs/jannchie.jpg',
  twitterCard: 'summary',
})

useHead({
  htmlAttrs: {
    lang: 'en',
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
