<script setup>
const { content } = defineProps({
  content: {
    type: Object,
    default: () => ({}),
  },
})

const formater = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

const createdAtStr = computed(() => {
  const createdAt = new Date(content.createdAt)
  return formater.format(createdAt)
})
</script>

<template>
  <NuxtLink
    :key="content.slug"
    data-cursor="block"
    :href="`${content._path}`"
    class="inline w-full p-4"
  >
    <div>
      {{ content.title }}
    </div>
    <div class="text-sm opacity-75">
      {{ createdAtStr }}
    </div>
  </NuxtLink>
</template>
