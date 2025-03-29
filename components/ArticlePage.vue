<script setup lang="ts">
import 'katex/dist/katex.min.css'
const { title } = defineProps<{
  title: string
}>()

const { params: { locale }, path } = useRoute('locale')
const { data } = await useAsyncData(path, () => {
  return queryCollection('content').path(path.toLowerCase()).first()
})

useSeoMeta({
  title: data.value?.title ?? '404',
  description: data.value?.description ?? '404',
})
const createdAt = computed(() => {
  const val = data.value
  if (!val) {
    return ''
  }
  const meta = val.meta as any
  if (!meta) {
    return ''
  }
  return Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(meta.createdAt))
})
const modifiedAt = computed(() => {
  const val = data.value
  if (!val) {
    return ''
  }
  const meta = val.meta as any
  if (!meta) {
    return ''
  }
  return Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(meta.modifiedAt))
})
</script>

<template>
  <main v-if="data">
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
      <ContentRenderer :value="data"/>
      <div class="mx-2 mt-32 flex justify-end gap-4">
        <span
          v-for="tag in data.meta.tags"
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
