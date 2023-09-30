<script setup lang="ts">
import { t } from '~/i18n'

const isTop = ref(true)
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    isTop.value = window.scrollY < 20
  })
}
const locale = useRoute('locale').params.locale
</script>

<template>
  <div class="pt-8 pb-16 h-screen flex flex-col items-center justify-center">
    <h1>
      <div class="flex items-end">
        <div style="font-family: 'My Soul', cursive;" class="relative text-center text-4xl lg:text-6xl">
          <div class="pointer-events-none select-none after:absolute after:top-0 after:filter">
            {{ `Jannchie's` }}
          </div>
          <div class="absolute top-0 filter blur-3xl" aria-hidden="true">
            {{ `Jannchie's` }}
          </div>
        </div>
      </div>
      <div :class="`text-fg-3 ${locale !== 'zh-CN' ? 'ml-8' : 'ml-32'}`">
        {{ t('subtitle') }}
      </div>
    </h1>
    <div class="flex gap-2 children:p-2 leading-0">
      <NuxtLink
        v-for="link in socialLinks" :key="link.label" :aria-label="link.label" data-cursor="block" target="_blank"
        :href="link.href" :rel="link.rel || ''"
      >
        <i :class="link.iconClass" />
      </NuxtLink>
    </div>
    <div class="m-2 flex gap-2">
      <NuxtLink
        :class="`${locale === 'en' ? 'text-fg-1' : 'text-fg-3'} p-2`" aria-label="en" data-cursor="block"
        to="/en"
      >
        English
      </NuxtLink>
      <NuxtLink
        :class="`${locale === 'zh-CN' ? 'text-fg-1' : 'text-fg-3'} p-2`" aria-label="zh" data-cursor="block"
        to="/zh-CN"
      >
        中文
      </NuxtLink>
      <NuxtLink
        :class="`${locale === 'ja' ? 'text-fg-1' : 'text-fg-3'} p-2`" aria-label="ja" data-cursor="block"
        to="/ja"
      >
        日本語
      </NuxtLink>
    </div>
    <HomeBio />
    <TransitionFade>
      <div v-if="isTop" class="bottom-0 absolute animate-bounce flex flex-col items-center bottom-20 text-base">
        <i class="i-tabler-chevron-down" />
      </div>
    </TransitionFade>
  </div>
</template>

<style scoped>

</style>
../../data/links
