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
    class="w-72 flex flex-col items-center p-4"
  >
    <i
      :class="icon"
      class="opacity-75"
    />
    <div class="text-base font-bold">
      {{ title }}
    </div>
    <div class="text-sm opacity-50">
      {{ description }}
    </div>
  </NuxtLink>
</template>
