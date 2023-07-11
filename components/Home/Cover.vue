<script setup>
import { t } from '~/i18n'

const isTop = ref(true)
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    isTop.value = window.scrollY < 20
  })
}
const locale = useRoute().params.locale
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
      <div :class="`opacity-50 ${locale !== 'zh-CN' ? 'ml-8' : 'ml-32'}`">
        {{ t('subtitle') }}
      </div>
    </h1>
    <div class="flex gap-2 children:p-2 leading-0">
      <NuxtLink aria-label="bilibili" data-cursor="block" target="_blank" href="https://space.bilibili.com/1850091">
        <i class="i-tabler-brand-bilibili" />
      </NuxtLink>
      <NuxtLink aria-label="twitter" data-cursor="block" target="_blank" href="https://twitter.com/jannchie">
        <i class="i-tabler-brand-twitter" />
      </NuxtLink>
      <NuxtLink aria-label="github" data-cursor="block" target="_blank" href="https://github.com/Jannchie">
        <i class="i-tabler-brand-github" />
      </NuxtLink>
      <NuxtLink aria-label="stackoverflow" data-cursor="block" target="_blank" href="https://stackoverflow.com/users/8625892/jannchie">
        <i class="i-tabler-brand-stackoverflow" />
      </NuxtLink>
      <NuxtLink aria-label="gmail" data-cursor="block" target="_blank" href="mailto:jannchie@gmail.com">
        <i class="i-tabler-brand-gmail" />
      </NuxtLink>
    </div>
    <div class="m-2 flex gap-2">
      <NuxtLink class="text-fg-3 p-2" aria-label="en" data-cursor="block" to="/en">
        en
      </NuxtLink>
      <NuxtLink class="text-fg-3 p-2" aria-label="zh-CN" data-cursor="block" to="/zh-CN">
        zh-CN
      </NuxtLink>
      <NuxtLink class="text-fg-3 p-2" aria-label="ja" data-cursor="block" to="/ja">
        ja
      </NuxtLink>
    </div>
    <Transition
      class="absolute bottom-0 transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div v-if="isTop" class="absolute animate-bounce flex flex-col items-center bottom-20 text-base">
        More...
        <i
          class="i-tabler-arrow-big-down-lines-filled"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>

</style>
