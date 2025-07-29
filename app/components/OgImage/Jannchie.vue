<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  avatar?: string
  image?: string
  socials?: { name: string, icon: string }[]
  topLeft?: string
  topRight?: string
  bottomLeft?: string
  bottomRight?: string
}>(), {})
</script>

<template>
  <div
    class="background-pattern relative h-full w-full flex items-center justify-center text-white"
    :style="{
      backgroundImage: `radial-gradient(#444 64px, #111 64px)`,
      backgroundSize: '40px 40px',
      backgroundColor: '#111',
    }"
  >
    <div
      v-if="image"
      class="absolute inset-0 h-full w-full bg-center opacity-10"
      :style="{ backgroundImage: `url(${image})` }"
    />
    <!-- Top Left Corner -->
    <div v-if="topLeft" class="absolute left-8 top-8 text-2xl font-mono">
      {{ topLeft }}
    </div>

    <!-- Top Right Corner -->
    <div v-if="topRight" class="absolute right-8 top-8 text-2xl font-mono">
      {{ topRight }}
    </div>

    <!-- Bottom Left Corner -->
    <div v-if="bottomLeft" class="absolute bottom-8 left-8 text-2xl font-mono">
      {{ bottomLeft }}
    </div>

    <!-- Bottom Right Corner -->
    <div v-if="bottomRight" class="absolute bottom-8 right-8 text-2xl font-mono">
      {{ bottomRight }}
    </div>

    <div class="flex flex-row items-center justify-center gap-10 -ml-61">
      <div v-if="avatar">
        <img :src="avatar" class="h-20 w-20 rounded-full">
      </div>
      <div class="flex flex-col gap-4">
        <div class="text-2xl op-75">
          {{ subtitle }}
        </div>
        <div class="max-w-3xl text-4xl">
          {{ title }}
        </div>
      </div>
    </div>
  </div>
</template>
