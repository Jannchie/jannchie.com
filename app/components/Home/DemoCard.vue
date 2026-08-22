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
const show = computed(() => isVisiable.value || alreadyLoaded.value)
const style = computed(() => {
  return {
    opacity: show.value ? 1 : 0,
    transform: `translateY(${show.value ? 0 : 100}px)`,
    transitionDelay: `${Math.random() * 0.2}s`,
  }
})
// 只在卡片进入视口后才加载视频，避免首页 10 个 demo 同时拉取/播放
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
