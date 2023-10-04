<script setup lang="ts">
const darkBtnRef = ref<HTMLButtonElement | null>(null)
const isDark = useViewTransitionDark()
const toggleDark = useToggle(isDark)
const { isEnabled } = useIPadCursor()
</script>

<template>
  <button
    ref="darkBtnRef"
    data-cursor="block"
    :class="{
      'cursor-none': isEnabled,
      'cursor-pointer': !isEnabled,
    }"
    class="p-2 leading-0 rounded-xl hover:border-bd"
    tabindex="0"
    @click="toggleDark()"
  >
    <i class="i-tabler-moon" />
  </button>
</template>
