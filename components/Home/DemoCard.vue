<script setup lang="ts">
const { title, desc, link } = defineProps<{
  title: string
  desc: string
  link: string
}>()
</script>

<template>
  <div class="rounded-xl border-bg-1 border inline-block bg-bg-3 w-[512px]">
    <video
      autoplay muted loop
      class="rounded-t-xl border-b border-bg-1"
      controlslist="nodownload"
      :src="link"
    />
    <div class="p-4">
      <h3 class="font-bold mb-2">
        {{ title }}
      </h3>
      <p class="text-fg-3">
        {{ desc }}
      </p>
    </div>
  </div>
</template>
