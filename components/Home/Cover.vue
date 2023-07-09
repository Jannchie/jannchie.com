<script setup>
const isTop = ref(true)
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    isTop.value = window.scrollY < 20
  })
}
</script>

<template>
  <div class="pt-8 pb-16 h-screen flex items-center justify-center">
    <h1>
      <div class="flex items-end">
        <div style="font-family: 'My Soul', cursive;" class="relative text-center text-4xl lg:text-6xl">
          <div class="pointer-events-none select-none">
            {{ `Jannchie's` }}
          </div>
          <div class="absolute top-0 filter blur-3xl">
            {{ `Jannchie's` }}
          </div>
        </div>
      </div>
      <div class="opacity-50 ml-8">
        Journey as Full Stack Engineer.
      </div>
    </h1>
    <Transition
      class="absolute bottom-0 transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div v-if="isTop" class="absolute animate-bounce flex flex-col items-center bottom-20 text-base">
        More...
        <i
          class="i-tabler-arrow-big-down-lines-filled"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>

</style>
