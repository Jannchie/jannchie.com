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
    data-cursor="block"
    :href="link"
    target="_blank"
    class="p-4 w-72 rounded-xl flex flex-col items-center"
  >
    <i
      :class="icon"
      class="opacity-75"
    />
    <div class="font-bold text-base">
      {{ title }}
    </div>
    <div class="opacity-50 text-sm">
      {{ description }}
    </div>
  </NuxtLink>
</template>
