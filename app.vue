<script setup>
import '@unocss/reset/tailwind.css'

useSeoMeta({
  title: 'Jannchie\'s Home',
  description: 'If there were more time…'
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
}, { mode: 'server' })
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
  --j-fg-1: #100F0F;
  --j-fg-2: #222;
  --j-fg-3: #2f2f2f;
  --j-bd: #ccc;
  color: var(--j-fg-2);
}

[lang="ja"] *:not(.font-mono):not(.font-mono *){
  font-family: 'HarmonyOS Sans JP', 'Yu Gothic UI', 'Segoe UI', 'Inter', system-ui, sans-serif;
}

[lang="zh-CN"] *:not(.font-mono):not(.font-mono *) {
  font-family: 'HarmonyOS Sans SC', 'Microsoft YaHei UI', 'Segoe UI', 'Inter', system-ui, sans-serif;
}

*:not(.font-mono):not(.font-mono *) {
  font-family: 'Oxygen', 'Segoe UI', 'Inter', system-ui, sans-serif;
}

[data-scheme="dark"] {
  --j-bg-1: #333;
  --j-bg-2: #222;
  --j-bg-3: #100F0F;
  --j-fg-1: #fff;
  --j-fg-2: #ddd;
  --j-fg-3: #aaa;
  --j-bd: #333;
}

[data-cursor="block"] {
  @apply border border-transparent hover:border-bd px-2 md:px-4 py-2 transition-all duration-300;
}

::selection {
  @apply bg-bg-1 text-fg-1;
}

</style>
