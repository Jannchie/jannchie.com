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
    <div class="hidden h-16 w-full shrink-0 justify-center border-t border-zinc-200 sm:flex dark:border-zinc-600">
      <div class="mx-16 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-zinc-200 sm:border-x dark:border-zinc-600" />
    </div>
    <div class="w-full flex flex-grow justify-center border-t border-zinc-200 dark:border-zinc-600">
      <div class="mx-16 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-zinc-200 sm:border-x dark:border-zinc-600" />
    </div>
    <div class="w-full flex justify-center border-y border-zinc-200 dark:border-zinc-600">
      <h1 class="mx-16 max-w-[1120px] w-full flex flex-col items-center justify-center border-x-0 border-zinc-200 py-32 text-center sm:border-x dark:border-zinc-600">
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
    <div class="w-full flex justify-center border-b border-zinc-200 dark:border-zinc-600">
      <div class="mx-16 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-zinc-200 text-center sm:border-x dark:border-zinc-600">
        <NuxtLink
          v-for="link in socialLinks"
          :key="link.label"
          :aria-label="link.label"
          target="_blank"
          class="p-3 leading-0 transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-1"
          :href="link.href"
          :rel="link.rel || ''"
        >
          <i :class="link.iconClass" />
        </NuxtLink>
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-zinc-200 dark:border-zinc-600">
      <div class="mx-16 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-zinc-200 text-center sm:border-x dark:border-zinc-600">
        <div class="flex gap-2">
          <NuxtLink
            :class="`${locale === 'en' ? 'text-fg-1' : 'text-fg-3'} p-2`"
            aria-label="en"
            to="/en"
            class="transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-1"
          >
            English
          </NuxtLink>
          <NuxtLink
            :class="`${locale === 'zh-CN' ? 'text-fg-1' : 'text-fg-3'} p-2`"
            aria-label="zh"
            to="/zh-CN"
            class="transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-1"
          >
            中文
          </NuxtLink>
          <NuxtLink
            :class="`${locale === 'ja' ? 'text-fg-1' : 'text-fg-3'} p-2`"
            aria-label="ja"
            to="/ja"
            class="transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-1"
          >
            日本語
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-zinc-200 dark:border-zinc-600">
      <div class="max-w-[1120px] w-full flex justify-center border-x-0 border-zinc-200 sm:mx-16 sm:border-x dark:border-zinc-600">
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
    <div class="hidden h-16 w-full flex-grow justify-center border-zinc-200 sm:flex dark:border-zinc-600">
      <div class="mx-16 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-zinc-200 sm:border-x dark:border-zinc-600" />
    </div>
  </div>
</template>
