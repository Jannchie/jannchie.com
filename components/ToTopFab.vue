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
  }, {
    passive: true,
  })
}
</script>

<template>
  <TransitionFade>
    <div
      v-if="!isTop"
      class="fixed bottom-8 right-8 cursor-pointer bg-bg-2 p-2 leading-0 border! !border-bd"
      @click="scrollToTop"
    >
      <i class="i-tabler-chevron-up" />
    </div>
  </TransitionFade>
</template>
