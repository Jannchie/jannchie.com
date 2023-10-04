<script setup lang="ts">
import { useRuntimeConfig } from '#imports'

defineProps<{ id?: string }>()
const heading = 1
const { anchorLinks } = useRuntimeConfig().public.content
const generate = anchorLinks?.depth >= heading && !anchorLinks?.exclude.includes(heading)
</script>

<template>
  <h2
    :id="id"
    class="relative"
  >
    <NuxtLink
      v-if="id && generate"
      exact
      data-cursor="block"
      class="hover:before:content-['#'] decoration-offset-8 font-bold before:-left-[2ch] before:absolute before:text-fg-3"
      :href="`#${id}`"
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </h2>
</template>
