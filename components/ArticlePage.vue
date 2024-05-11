<script setup lang="ts">
import 'katex/dist/katex.min.css'

const { title } = defineProps<{
  title: string
}>()

const { params: { locale }, path } = useRoute('locale')
const data = await queryContent(path).findOne()
useSeoMeta({
  title: data.title,
})

const createdAt = computed(() => {
  return Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(data.createdAt))
})
const modifiedAt = computed(() => {
  return Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(data.modifiedAt))
})
</script>

<template>
  <main>
    <div class="text-center text-4xl lg:text-3xl pt-8 pb-16">
      {{ title }}
    </div>
    <article
      data-cursor="text"
      class="m-auto p-2 sm:px-0 dark:prose-invert prose text-md"
    >
      <h1 class="text-center">
        {{ data.title }}
      </h1>
      <div class="text-sm text-fg-3 text-center">
        {{ createdAt }} / {{ modifiedAt }}
      </div>
      <ContentDoc :head="false" />
      <div class="mt-32 mx-2 flex gap-4 justify-end">
        <span
          v-for="tag in data.tags"
          :key="tag"
          class="text-sm text-fg-3 border-bd border px-2 rounded"
        >
          #{{ tag }}
        </span>
      </div>
      <div class="opacity-75 text-sm font-mono mt-32">
        <ContentLicense />
      </div>
      <div class="font-mono opacity-75 text-sm">
        <span>$ </span>
        <NuxtLink
          :to="`/${locale}`"
        >
          cd ..
        </NuxtLink>
      </div>
    </article>
  </main>
</template>
