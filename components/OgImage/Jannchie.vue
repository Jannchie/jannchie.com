<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  avatar?: string
  image?: string
  socials?: { name: string, icon: string }[]
}>(), {
})
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
      class="absolute inset-0 w-full h-full bg-center opacity-10"
      :style="{ backgroundImage: `url(${image})` }"
    />
    <div class="flex flex-row justify-center gap-4 items-center -ml-61">
      <div v-if="avatar">
        <img :src="avatar" class="rounded-full w-16 h-16" />
      </div>
      <div class="flex flex-col">
        <div class="text-lg op-50">
          {{ subtitle }}
        </div>
        <div class="text-2xl max-w-3xl">
          {{ title }}
        </div>
      </div>
    </div>
  </div>
</template>