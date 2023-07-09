<script setup>
import { withBase } from 'ufo'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
})

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//'))
    return withBase(props.src, useRuntimeConfig().app.baseURL)
  return props.src
})
</script>

<template>
  <client-only>
    <div class="flex justify-center">
      <img class="rounded-xl" :src="refinedSrc" :alt="alt" :width="width" :height="height">
    </div>
  </client-only>
</template>
