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
    class="rounded-xl hover:bg-bg-2 border-bd !border inline-block max-w-512px bg-bg-3 transition-all duration-1000"
  >
    <video
      autoplay
      muted
      loop
      playsinline
      class="rounded-t-xl border-b border-bd"
      controlslist="nodownload"
      :src="link"
    />
    <div class="p-4">
      <h3 class="font-bold mb-2">
        {{ t(title) }}
      </h3>
      <p class="text-fg-3 text-sm">
        {{ t(desc) }}
      </p>
    </div>
  </NuxtLink>
</template>
