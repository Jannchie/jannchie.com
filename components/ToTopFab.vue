<script setup lang="ts">
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
const isTop = ref(true)
if (typeof window !== 'undefined') {
  useEventListener('scroll', () => {
    isTop.value = window.scrollY < 200
  })
}
</script>

<template>
  <TransitionFade>
    <div
      v-if="!isTop"
      data-cursor="block"
      class="fixed bottom-8 right-8 p-2 bg-bg-2 leading-0 border! !border-bd cursor-none rounded-xl"
      @click="scrollToTop"
    >
      <i class="i-tabler-chevron-up" />
    </div>
  </TransitionFade>
</template>
