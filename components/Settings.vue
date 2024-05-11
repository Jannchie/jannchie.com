<script setup lang="ts">
import ToggleDarkBtn from './ToggleDarkBtn.vue'
</script>

<template>
  <ClientOnly>
    <TransitionFade>
      <div class="absolute top-2 right-4 flex">
        <ToggleDarkBtn />
      </div>
    </TransitionFade>
  </ClientOnly>
</template>
