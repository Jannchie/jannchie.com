<script setup lang="ts">
import { t } from '~/i18n'

definePageMeta({ middleware: ['i18n'] })

const route = useRoute('locale')
const locale = String(route.params.locale || 'en')
const contentPath = route.path.replace(`/${locale}/`, `/${locale.toLowerCase()}/`)

useHead({
  htmlAttrs: {
    lang: locale,
  },
})

const { data } = await useAsyncData(contentPath, () => {
  return queryCollection('content').path(contentPath).first()
})

useSeoMeta({
  title: data.value?.title ?? 'Use',
  description: data.value?.description ?? '',
})
</script>

<template>
  <main v-if="data">
    <div class="m-auto w-65ch pb-8 pt-3 text-start">
      <div class="text-lg">
        <NuxtLink
          :to="`/${locale}`"
          class="text-sm text-fg-3"
        >
          {{ t('home') }}
        </NuxtLink>
        <span class="text-sm text-fg-3"> / </span>
        <span class="text-sm text-fg-3">
          {{ data.title }}
        </span>
      </div>
    </div>
    <article class="text-md m-auto w-full px-4 py-2 sm:px-8">
      <h1 class="mb-6 text-center text-2xl!">
        {{ data.title }}
      </h1>
      <ContentRenderer :value="data" class="max-w-none prose prose-zinc dark:prose-invert" />
    </article>
  </main>
</template>
