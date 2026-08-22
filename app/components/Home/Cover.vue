<script setup lang="ts">
import { t } from '~/i18n'

const isTop = ref(true)
if (globalThis.window !== undefined) {
  window.addEventListener('scroll', () => {
    isTop.value = window.scrollY < 20
  }, {
    passive: true,
  })
}
const locale = useRoute('locale').params.locale

const locales = [
  { code: 'en', ariaLabel: 'en', label: 'English' },
  { code: 'zh-CN', ariaLabel: 'zh', label: '中文' },
  { code: 'ja', ariaLabel: 'ja', label: '日本語' },
]
const pages = ['use', 'game', 'anime']
</script>

<template>
  <div class="h-[calc(100vh-3rem)] w-full flex flex-col items-center justify-center">
    <div class="hidden h-16 w-full shrink-0 justify-center border-t border-bd sm:flex">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full flex items-center justify-center border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x" />
    </div>
    <div class="w-full flex justify-center border-t border-bd sm:flex-grow">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full flex items-center justify-center border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x" />
    </div>
    <div class="w-full flex justify-center border-y border-bd">
      <h1 class="mx-4 max-w-[1120px] min-w-0 w-full flex flex-col items-center justify-center border-x-0 border-bd py-16 text-center lg:mx-16 sm:mx-8 sm:border-x sm:py-32">
        <div class="flex items-end">
          <div class="relative text-center text-4xl lg:text-6xl">
            <div
              class="pointer-events-none relative z-1 select-none"
              style="font-family: 'My Soul', cursive;"
            >
              {{ `Jannchie's` }}
            </div>
            <div
              class="pointer-events-none absolute inset-0 select-none blur-3xl"
              style="font-family: 'My Soul', cursive;"
              aria-hidden="true"
            >
              {{ `Jannchie's` }}
            </div>
          </div>
        </div>
        <div class="ml-32 text-fg-3">
          {{ t('subtitle') }}
        </div>
      </h1>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full flex items-center justify-center border-x-0 border-bd text-center lg:mx-16 sm:mx-8 sm:border-x">
        <NuxtLink
          v-for="link in socialLinks"
          :key="link.label"
          :aria-label="link.label"
          target="_blank"
          class="border border-transparent p-3 leading-none transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base"
          :href="link.href"
          :rel="link.rel"
        >
          <i :class="link.iconClass" />
        </NuxtLink>
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full flex items-center justify-center border-x-0 border-bd text-center lg:mx-16 sm:mx-8 sm:border-x">
        <div class="flex gap-2">
          <NuxtLink
            v-for="l in locales"
            :key="l.code"
            :aria-label="l.ariaLabel"
            :to="`/${l.code}`"
            class="border border-transparent p-2 transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base" :class="[
              locale === l.code ? 'text-fg-1' : 'text-fg-3',
            ]"
          >
            {{ l.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full flex items-center justify-center gap-2 border-x-0 border-bd text-center lg:mx-16 sm:mx-8 sm:border-x">
        <NuxtLink
          v-for="page in pages"
          :key="page"
          :to="`/${locale}/${page}`"
          class="border border-transparent p-2 text-fg-3 transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base"
        >
          {{ t(page) }}
        </NuxtLink>
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full flex justify-center border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <HomeBio />
      </div>
    </div>
    <ClientOnly>
      <TransitionFade>
        <div
          v-if="isTop"
          class="absolute bottom-20 flex flex-col animate-bounce items-center text-base"
        >
          <i class="i-tabler-chevron-down" />
        </div>
      </TransitionFade>
    </ClientOnly>
    <div class="hidden h-16 w-full flex-grow justify-center border-bd sm:flex">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full flex items-center justify-center border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x" />
    </div>
  </div>
</template>
