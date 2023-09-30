<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'color-scheme',
})
const toggleDark = useToggle(isDark)
const { toggleCursor, isEnabled } = useIPadCursor()
</script>

<template>
  <ClientOnly>
    <TransitionFade>
      <div class="absolute top-2 right-4 flex">
        <button
          v-if="toggleCursor"
          :class="{
            'cursor-none': isEnabled,
            'cursor-pointer': !isEnabled,
          }"
          data-cursor="block"
          class="p-2 leading-0 rounded-xl hover:border-bg-2"
          tabindex="0"
          @click="toggleCursor()"
        >
          <i class="i-tabler-pointer" />
        </button>
        <button
          data-cursor="block"
          :class="{
            'cursor-none': isEnabled,
            'cursor-pointer': !isEnabled,
          }"
          class="p-2 leading-0 rounded-xl hover:border-bg-2"
          tabindex="0"
          @click="toggleDark()"
        >
          <i class="i-tabler-moon" />
        </button>
      </div>
    </TransitionFade>
  </ClientOnly>
</template>
