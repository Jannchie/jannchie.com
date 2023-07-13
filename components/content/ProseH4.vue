<script setup lang="ts">
import { useRuntimeConfig } from '#imports'

defineProps<{ id?: string }>()
const heading = 3
const { anchorLinks } = useRuntimeConfig().public.content
const generate = anchorLinks?.depth >= heading && !anchorLinks?.exclude.includes(heading)
</script>

<template>
  <h2 :id="id" class="relative">
    <a v-if="id && generate" data-cursor="block" class="hover:before:content-['####'] before:-left-[5ch] before:absolute before:text-fg-3 decoration-offset-8 font-bold" :href="`#${id}`">
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
