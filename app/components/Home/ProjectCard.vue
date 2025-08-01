<script setup lang="ts">
defineProps<{
  title: string
  description: string
  link: string
  icon: string
}>()
</script>

<template>
  <NuxtLink
    :href="link"
    target="_blank"
    class="w-72 flex flex-col items-center p-2 p-4 text-fg-3 transition-colors hover:border-fg-1 hover:bg-fg-1 hover:text-bg-1"
  >
    <i
      :class="icon"
    />
    <div class="text-base font-bold">
      {{ title }}
    </div>
    <div class="text-sm opacity-75">
      {{ description }}
    </div>
  </NuxtLink>
</template>
