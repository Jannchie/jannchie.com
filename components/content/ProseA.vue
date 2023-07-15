<script setup lang="ts">
defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String,
    default: undefined,
    required: false,
  },
})
</script>

<template>
  <NuxtLink data-cursor="block" :href="href" :target="target">
    <slot />
  </NuxtLink>
</template>
