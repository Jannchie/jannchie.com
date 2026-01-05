<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { t } from '@/i18n'

const { title, desc, link } = defineProps<{
  title: string
  desc: string
  link: string
  href: string
}>()

const target = ref()
const isVisiable = useElementVisibility(target)
const alreadyLoaded = ref(false)
watchOnce(isVisiable, () => {
  if (!alreadyLoaded.value) {
    alreadyLoaded.value = true
  }
})
const style = computed(() => {
  const show = isVisiable.value || alreadyLoaded.value
  return {
    opacity: show ? 1 : 0,
    transform: `translateY(${show ? 0 : 100}px)`,
    transitionDelay: `${Math.random() * 0.2}s`,
  }
})
</script>

<template>
  <NuxtLink
    ref="target"
    :style="style"
    target="_blank"
    :href="href"
    class="bg-bg-base hover:bg-bg-variant inline-block border-bd pr-0.3px transition-all duration-1000 !border"
  >
    <video

      autoplay
      loop
      muted
      playsinline
      class="w-full border-b border-bd"
      controlslist="nodownload"
      :src="link"
    />
    <div class="p-4">
      <h3 class="mb-2 font-bold">
        {{ t(title) }}
      </h3>
      <p class="text-sm text-fg-3">
        {{ t(desc) }}
      </p>
    </div>
  </NuxtLink>
</template>
