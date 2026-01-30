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
  title: data.value?.title ?? 'Game',
  description: data.value?.description ?? '',
})
</script>

<template>
  <main v-if="data" class="w-full">
    <div class="w-full flex justify-center border-b border-t border-bd">
      <div class="mx-4 max-w-[1120px] w-full border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div class="m-auto w-full px-4 py-4 text-start sm:px-8">
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
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <article class="text-md m-auto w-full px-4 py-2 sm:px-8">
          <h1 class="mb-6 text-center text-2xl!">
            {{ data.title }}
          </h1>
          <ContentRenderer :value="data" class="max-w-none prose prose-zinc dark:prose-invert" />
          <div class="mt-16 border-t border-bd -mx-4 sm:-mx-8">
            <div class="border-b border-bd px-4 py-4 text-sm text-fg-3 font-mono opacity-75 sm:px-8">
              <span>$ </span>
              <NuxtLink
                :to="`/${locale}`"
              >
                cd ..
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>
