<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>

<template>
  <h1
    class="relative"
  >
    <NuxtLink
      v-if="id && generate"
      exact
      class="hover:before:content-['#'] decoration-offset-8 font-bold before:-left-[2ch] before:absolute before:text-fg-3"
      :href="`#${id}`"
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </h1>
</template>
