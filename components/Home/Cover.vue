<script setup lang="ts">
import { t } from '~/i18n'

const isTop = ref(true)
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    isTop.value = window.scrollY < 20
  }, {
    passive: true,
  })
}
const locale = useRoute('locale').params.locale
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center pb-16 pt-8">
    <h1>
      <div class="flex items-end">
        <div
          class="relative text-center text-4xl lg:text-6xl"
        >
          <div
            style="font-family: 'My Soul', cursive;"
            class="pointer-events-none select-none after:absolute after:top-0 after:filter"
          >
            {{ `Jannchie's` }}
          </div>
          <div
            class="absolute top-0 blur-3xl filter"
            style="font-family: 'My Soul', cursive;"
            aria-hidden="true"
          >
            {{ `Jannchie's` }}
          </div>
        </div>
      </div>
      <div :class="`text-fg-3 ${locale !== 'zh-CN' ? 'ml-8' : 'ml-32'}`">
        {{ t('subtitle') }}
      </div>
    </h1>
    <div class="flex gap-2 py-4 leading-0 children:p-2">
      <NuxtLink
        v-for="link in socialLinks"
        :key="link.label"
        :aria-label="link.label"
        data-cursor="block"
        target="_blank"
        :href="link.href"
        :rel="link.rel || ''"
      >
        <i :class="link.iconClass" />
      </NuxtLink>
    </div>
    <div class="m-2 flex gap-2">
      <NuxtLink
        :class="`${locale === 'en' ? 'text-fg-1' : 'text-fg-3'} p-2`"
        aria-label="en"
        data-cursor="block"
        to="/en"
      >
        English
      </NuxtLink>
      <NuxtLink
        :class="`${locale === 'zh-CN' ? 'text-fg-1' : 'text-fg-3'} p-2`"
        aria-label="zh"
        data-cursor="block"
        to="/zh-CN"
      >
        中文
      </NuxtLink>
      <NuxtLink
        :class="`${locale === 'ja' ? 'text-fg-1' : 'text-fg-3'} p-2`"
        aria-label="ja"
        data-cursor="block"
        to="/ja"
      >
        日本語
      </NuxtLink>
    </div>
    <HomeBio />
    <ClientOnly>
      <TransitionFade>
        <div
          v-if="isTop"
          class="absolute bottom-0 bottom-20 flex flex-col animate-bounce items-center text-base"
        >
          <i class="i-tabler-chevron-down" />
        </div>
      </TransitionFade>
    </ClientOnly>
  </div>
</template>

<style scoped>

</style>
../../data/links
