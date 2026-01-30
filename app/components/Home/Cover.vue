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
</script>

<template>
  <div class="h-screen w-full flex flex-col items-center justify-center">
    <div class="hidden h-16 w-full shrink-0 justify-center border-t border-bd sm:flex">
      <div class="mx-4 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x" />
    </div>
    <div class="w-full flex flex-grow justify-center border-t border-bd">
      <div class="mx-4 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x" />
    </div>
    <div class="w-full flex justify-center border-y border-bd">
      <h1 class="mx-4 max-w-[1120px] w-full flex flex-col items-center justify-center border-x-0 border-bd py-32 text-center lg:mx-16 sm:mx-8 sm:border-x">
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
        <div :class="`text-fg-3 ${'ml-32'}`">
          {{ t('subtitle') }}
        </div>
      </h1>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-bd text-center lg:mx-16 sm:mx-8 sm:border-x">
        <NuxtLink
          v-for="link in socialLinks"
          :key="link.label"
          :aria-label="link.label"
          target="_blank"
          class="p-3 leading-0 transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base"
          :href="link.href"
          :rel="link.rel || ''"
        >
          <i :class="link.iconClass" />
        </NuxtLink>
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-bd text-center lg:mx-16 sm:mx-8 sm:border-x">
        <div class="flex gap-2">
          <NuxtLink
            :class="`${locale === 'en' ? 'text-fg-1' : 'text-fg-3'} p-2`"
            aria-label="en"
            to="/en"
            class="transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base"
          >
            English
          </NuxtLink>
          <NuxtLink
            :class="`${locale === 'zh-CN' ? 'text-fg-1' : 'text-fg-3'} p-2`"
            aria-label="zh"
            to="/zh-CN"
            class="transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base"
          >
            中文
          </NuxtLink>
          <NuxtLink
            :class="`${locale === 'ja' ? 'text-fg-1' : 'text-fg-3'} p-2`"
            aria-label="ja"
            to="/ja"
            class="transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base"
          >
            日本語
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full flex items-center justify-center gap-2 border-x-0 border-bd text-center lg:mx-16 sm:mx-8 sm:border-x">
        <NuxtLink
          :to="`/${locale}/use`"
          class="p-2 text-fg-3 transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base"
        >
          {{ t('use') }}
        </NuxtLink>
        <NuxtLink
          :to="`/${locale}/game`"
          class="p-2 text-fg-3 transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base"
        >
          {{ t('game') }}
        </NuxtLink>
        <NuxtLink
          :to="`/${locale}/anime`"
          class="p-2 text-fg-3 transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-base"
        >
          {{ t('anime') }}
        </NuxtLink>
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full flex justify-center border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <HomeBio />
      </div>
    </div>
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
    <div class="hidden h-16 w-full flex-grow justify-center border-bd sm:flex">
      <div class="mx-4 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x" />
    </div>
  </div>
</template>
