<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h4)
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
      class="before:transition-all before:opacity-0 hover:before:opacity-100 before:content-['####'] before:-left-[5ch] before:absolute before:text-fg-3 decoration-offset-8 font-bold"
      :href="`#${id}`"
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </h2>
</template>
