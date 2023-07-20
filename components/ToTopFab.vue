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
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <div
      v-if="!isTop"
      data-cursor="block"
      class="fixed bottom-8 right-8 p-2 bg-bg-2 leading-0 border! !border-bg-1 cursor-none rounded-xl"
      @click="scrollToTop"
    >
      <i class="i-tabler-chevron-up" />
    </div>
  </Transition>
</template>
