<script setup lang="ts">
import 'katex/dist/katex.min.css'

const { title } = defineProps<{
  title: string
}>()

const { params: { locale }, path } = useRoute('locale')
const data = await queryCollection('content').path(path).findOne()
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
    <div class="pb-16 pt-8 text-center text-4xl lg:text-3xl">
      {{ title }}
    </div>
    <article
      data-cursor="text"
      class="text-md m-auto p-2 prose sm:px-0 dark:prose-invert"
    >
      <h1 class="text-center">
        {{ data.title }}
      </h1>
      <div class="text-center text-sm text-fg-3">
        {{ createdAt }} / {{ modifiedAt }}
      </div>
      <ContentDoc :head="false" />
      <div class="mx-2 mt-32 flex justify-end gap-4">
        <span
          v-for="tag in data.tags"
          :key="tag"
          class="border border-bd rounded px-2 text-sm text-fg-3"
        >
          #{{ tag }}
        </span>
      </div>
      <div class="mt-32 text-sm font-mono opacity-75">
        <ContentLicense />
      </div>
      <div class="text-sm font-mono opacity-75">
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
