<script setup lang="ts">
import { t } from '~/i18n'
import { buildSeoLinks, buildSeoMeta, ensureSeoLocale, normalizeSiteUrl } from '~/utils/seo'

const props = defineProps<{
  fallbackTitle: string
}>()

const route = useRoute('locale')
const locale = String(route.params.locale || 'en')
const seoLocale = ensureSeoLocale(locale)
const contentPath = route.path.replace(`/${locale}/`, `/${locale.toLowerCase()}/`)
const siteUrl = normalizeSiteUrl(useRuntimeConfig().public.siteUrl || 'https://jannchie.com')
const canonicalUrl = computed(() => `${siteUrl}${route.path}`)
const ogImage = `${siteUrl}/imgs/jannchie.jpg`

const slug = computed(() => route.path.split('/').filter(Boolean).slice(1).join('/') || '')

useHead(() => {
  return {
    htmlAttrs: {
      lang: locale,
    },
    link: buildSeoLinks(route.path, seoLocale, siteUrl),
  }
})

const { data } = await useAsyncData(contentPath, () => {
  return queryCollection('content').path(contentPath).first()
})

useSeoMeta(buildSeoMeta({
  title: data.value?.title ?? props.fallbackTitle,
  description: data.value?.description ?? '',
  url: canonicalUrl.value,
  type: 'website',
  image: ogImage,
  siteName: 'Jannchie\'s Home',
}))

const dateFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const updatedAt = computed(() => {
  const raw = data.value?.updatedAt ?? data.value?.createdAt
  if (!raw) {
    return ''
  }
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) {
    return ''
  }
  return dateFormatter.format(d)
})

const siblings = computed(() => {
  const items = [
    { key: 'use', to: `/${locale}/use` },
    { key: 'game', to: `/${locale}/game` },
    { key: 'anime', to: `/${locale}/anime` },
  ]
  return items.filter(item => !route.path.endsWith(`/${item.key}`))
})
</script>

<template>
  <main v-if="data" class="w-full">
    <section class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div class="px-4 py-10 sm:px-8 sm:py-16">
          <div class="mb-4 text-xs text-fg-3 font-mono">
            <span class="text-fg-1">$</span>
            <span class="ml-2">cat ~/{{ slug }}.md</span>
          </div>
          <h1 class="text-3xl leading-tight tracking-tight sm:text-5xl">
            {{ data.title }}
          </h1>
          <p
            v-if="data.description"
            class="mt-3 text-base text-fg-3 sm:text-lg"
          >
            {{ data.description }}
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fg-3 font-mono">
            <span v-if="updatedAt">
              updated · {{ updatedAt }}
            </span>
            <template v-if="Array.isArray(data.tags) && data.tags.length > 0">
              <span class="text-fg-3/50">|</span>
              <span
                v-for="tag in data.tags"
                :key="String(tag)"
              >
                #{{ tag }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </section>

    <section class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <article class="px-4 py-10 sm:px-8 sm:py-14">
          <ContentRenderer :value="data" class="max-w-none prose prose-zinc dark:prose-invert" />
        </article>
      </div>
    </section>

    <section
      v-if="siblings.length > 0"
      class="w-full flex justify-center border-b border-bd"
    >
      <div class="mx-4 max-w-[1120px] min-w-0 w-full border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 text-xs text-fg-3 font-mono sm:px-8">
          <span class="text-fg-3/70">
            →
          </span>
          <NuxtLink
            v-for="s in siblings"
            :key="s.key"
            :to="s.to"
            class="transition-colors hover:text-fg-1"
          >
            {{ t(s.key) }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] min-w-0 w-full border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div class="px-4 py-4 text-sm text-fg-3 font-mono opacity-75 sm:px-8">
          <span class="text-fg-1">$ </span>
          <NuxtLink :to="`/${locale}`">
            cd ..
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
