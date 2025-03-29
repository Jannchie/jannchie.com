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
      class="font-bold decoration-offset-8 before:absolute before:text-fg-3 before:-left-[2ch] hover:before:content-['#']"
      :href="`#${id}`"
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </h1>
</template>
