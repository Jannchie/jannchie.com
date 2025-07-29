<script setup lang="ts">
import ToggleDarkBtn from './ToggleDarkBtn.vue'
</script>

<template>
  <ClientOnly>
    <TransitionFade>
      <div class="absolute right-4 top-2 flex">
        <ToggleDarkBtn />
      </div>
    </TransitionFade>
  </ClientOnly>
</template>
