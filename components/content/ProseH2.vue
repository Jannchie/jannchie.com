<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h2)
</script>

<template>
  <h2
    :id="id"
    class="relative"
  >
    <NuxtLink
      v-if="id && generate"
      exact
      class="flex text-xl font-bold decoration-none before:absolute before:text-fg-3 before:opacity-0 before:transition-all before:content-['##'] before:-left-[3ch] hover:before:opacity-100"
      :href="`#${id}`"
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </h2>
</template>
