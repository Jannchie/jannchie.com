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
  <img
    class="rounded-xl flex justify-center brightness-75 hover:brightness-100 transition-all inline-block m-auto"
    :src="refinedSrc"
    :alt="alt"
    :width="width"
    :height="height"
  >
</template>
