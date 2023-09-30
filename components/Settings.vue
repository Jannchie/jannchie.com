<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'color-scheme',
})
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="absolute top-2 right-4">
    <div
      data-cursor="block"
      class="p-2 leading-0 rounded-xl"
      tabindex="0"
      @click="toggleDark()"
    >
      <i class="i-tabler-moon" />
    </div>
  </div>
</template>
