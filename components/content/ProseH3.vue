<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h3)
</script>

<template>
  <h2
    :id="id"
    class="relative"
  >
    <NuxtLink
      v-if="id && generate"
      exact
      class="before:transition-all text-base before:opacity-0 flex hover:before:opacity-100 before:content-['###'] before:-left-[4ch] before:absolute before:text-fg-3 font-bold decoration-none"
      :href="`#${id}`"
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </h2>
</template>
