<script setup lang="ts">
</script>

<template>
  <div
    class="background-pattern relative h-full w-full flex items-center justify-center text-white"
    :style="{
      backgroundColor: '#111',
    }"
  >
    <div class="absolute bottom-4 right-4 flex items-center text-2xl">
      jannchie.com
    </div>
    <div class="absolute bottom-4 left-4 flex items-center text-2xl">
      见齐
    </div>
    <div class="h-1px w-full bg-white/25" />
    <div class="flex flex-row items-center justify-center gap-10 py-8 -ml-61">
      <div>
        <img src="https://jannchie.com/imgs/jannchie.jpg" class="h-20 w-20 rounded-full">
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-2xl op-75">
          Full Stack Engineer
        </div>
        <div class="max-w-3xl text-4xl" style="font-family: 'Domine', serif;">
          Jannchie Pan
        </div>
      </div>
    </div>
    <div class="h-1px w-full bg-white/10" />
    <div class="absolute left-50 h-full w-1px bg-white/25" />
    <div class="absolute right-50 h-full w-1px bg-white/25" />
    <div class="absolute bottom-15 h-1px w-full bg-white/25" />
  </div>
</template>
