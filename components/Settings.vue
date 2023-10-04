<script setup lang="ts">
import ToggleDarkBtn from './ToggleDarkBtn.vue'

const { toggleCursor, isEnabled } = useIPadCursor()
</script>

<template>
  <ClientOnly>
    <TransitionFade>
      <div class="absolute top-2 right-4 flex">
        <button
          v-if="toggleCursor" :class="{
            'cursor-none': isEnabled,
            'cursor-pointer': !isEnabled,
          }" data-cursor="block" class="p-2 leading-0 rounded-xl hover:border-bd" tabindex="0" @click="toggleCursor()"
        >
          <i class="i-tabler-pointer" />
        </button>
        <ToggleDarkBtn />
      </div>
    </TransitionFade>
  </ClientOnly>
</template>
