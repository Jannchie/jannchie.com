<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && (headings?.anchorLinks))
</script>

<template>
  <h2
    :id="id"
    class="relative mt-5"
  >
    <NuxtLink
      v-if="id && generate"
      exact
      class="flex text-base font-bold decoration-none before:absolute before:text-fg-3 before:opacity-0 before:transition-all before:content-['###'] before:-left-[4ch] hover:before:opacity-100"
      :href="`#${id}`"
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </h2>
</template>
