<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'

const { title, desc, link } = defineProps<{
  title: string
  desc: string
  link: string
  href: string
}>()

const target = ref()
const isVisiable = useElementVisibility(target)
const style = computed(() => {
  return {
    opacity: isVisiable.value ? 1 : 0,
    transform: `translateY(${isVisiable.value ? 0 : 100}px) scale(${isVisiable.value ? 1 : 1.2})`,
    transitionDelay: `${Math.random() * 0.2}s`,
  }
})
</script>

<template>
  <NuxtLink ref="target" :style="style" target="_blank" :href="href" class="rounded-xl hover:bg-bg-2 border-bd !border inline-block max-w-512px bg-bg-3 transition-all duration-1000">
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
        {{ title }}
      </h3>
      <p class="text-fg-3 text-sm">
        {{ desc }}
      </p>
    </div>
  </NuxtLink>
</template>
