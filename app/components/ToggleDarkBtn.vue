<script setup lang="ts">
const darkBtnRef = ref<HTMLButtonElement | null>(null)
const isDark = useViewTransitionDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button
    ref="darkBtnRef"
    type="button"
    :aria-label="isDark ? 'Switch to light color scheme' : 'Switch to dark color scheme'"
    class="size-8 inline-flex items-center justify-center text-fg-2 leading-0 transition-colors hover:bg-bg-variant hover:text-fg-1"
    tabindex="0"
    @click="toggleDark()"
  >
    <i
      v-if="isDark"
      class="i-tabler-sun text-base"
      aria-hidden="true"
    />
    <i
      v-else
      class="i-tabler-moon text-base"
      aria-hidden="true"
    />
  </button>
</template>
