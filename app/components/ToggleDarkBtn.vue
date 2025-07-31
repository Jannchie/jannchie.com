<script setup lang="ts">
const darkBtnRef = ref<HTMLButtonElement | null>(null)
const isDark = useViewTransitionDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button
    ref="darkBtnRef"
    role="button"
    class="p-2 leading-0"
    tabindex="0"
    @click="toggleDark()"
  >
    <i
      :class="{
        'i-tabler-sun': isDark,
        'i-tabler-moon': !isDark,
      }"
    />
  </button>
</template>
