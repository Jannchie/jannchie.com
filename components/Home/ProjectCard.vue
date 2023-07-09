<script setup>
const { link } = defineProps({
  title: String,
  description: String,
  link: String,
})
</script>

<template>
  <a data-cursor="block" :href="link" target="_blank" class="p-4 w-72 rounded-xl flex flex-col items-center">
    <div class="font-bold text-base">
      {{ title }}
    </div>
    <div class="opacity-50 text-sm">
      {{ description }}
    </div>
  </a>
</template>
