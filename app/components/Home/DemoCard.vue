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
// once: true keeps the ref latched after the card first appears and
// disconnects the observer, so the entrance animation never replays.
const show = useElementVisibility(target, { once: true })
const transitionDelay = `${Math.random() * 0.2}s`
const style = computed(() => {
  return {
    opacity: show.value ? 1 : 0,
    transform: `translateY(${show.value ? 0 : 100}px)`,
    transitionDelay,
  }
})
// Only fetch the video once the card is in view, so the home page does not
// pull every demo at once.
const videoSrc = computed(() => show.value ? link : undefined)
</script>

<template>
  <NuxtLink
    ref="target"
    :style="style"
    target="_blank"
    :href="href"
    class="inline-block border border-bd bg-bg-base pr-px transition-all duration-1000 hover:bg-bg-variant"
  >
    <video
      autoplay
      loop
      muted
      playsinline
      preload="none"
      class="w-full border-b border-bd"
      controlslist="nodownload"
      :src="videoSrc"
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
