<script setup lang="ts">
import { t } from '~/i18n'
import { buildSeoLinks, buildSeoMeta, ensureSeoLocale, normalizeSiteUrl } from '~/utils/seo'
import 'katex/dist/katex.min.css'

defineProps<{
  title: string
}>()

const locales = [
  'en',
  'zh-CN',
  'ja',
]
const { params: { locale }, path } = useRoute('locale')
const seoLocale = ensureSeoLocale(locale)
const siteUrl = normalizeSiteUrl(useRuntimeConfig().public.siteUrl || 'https://jannchie.com')
const canonicalUrl = computed(() => `${siteUrl}${path}`)
const ogImage = path.includes('/posts/') ? undefined : `${siteUrl}/imgs/jannchie.jpg`
const contentPath = path.replace(`/${locale}/`, `/${locale.toLowerCase()}/`)
const { data } = await useAsyncData(path, () => {
  return queryCollection('content').path(contentPath).first()
})
if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

const { data: otherLangMap } = await useAsyncData(`${path}/${locale}other`, async () => {
  const otherLocales = locales.filter(l => l !== locale)
  const otherlocalePath = otherLocales.map((l) => {
    return path.replace(`/${locale}/`, `/${l.toLowerCase()}/`)
  })

  const otherLangs = await queryCollection('content').where('path', 'IN', otherlocalePath).all()
  const localeToPostMap = new Map()
  for (const post of otherLangs) {
    const postLocaleRaw = post.path.split('/')[1]
    if (!postLocaleRaw) {
      continue
    }
    const postLocale = locales.find(l => l.toLowerCase() === postLocaleRaw.toLowerCase()) || postLocaleRaw
    const normalizedPath = `/${postLocale}${post.path.slice(postLocaleRaw.length + 1)}`
    localeToPostMap.set(postLocale, { ...post, path: normalizedPath })
  }
  return localeToPostMap
})

const publishedTime = computed(() => {
  const value = data.value?.createdAt
  if (!value) {
    return
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return
  }
  return date.toISOString()
})

const modifiedTime = computed(() => {
  const value = data.value?.updatedAt
  if (!value) {
    return
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return
  }
  return date.toISOString()
})

useHead(() => {
  return {
    link: buildSeoLinks(path, seoLocale, siteUrl),
  }
})

useSeoMeta(buildSeoMeta({
  title: data.value?.title ?? '404',
  description: data.value?.description ?? '404',
  url: canonicalUrl.value,
  type: 'article',
  image: ogImage,
  siteName: 'Jannchie\'s Home',
  publishedTime: publishedTime.value,
  modifiedTime: modifiedTime.value,
}))

const createdAt = computed(() => {
  const val = data.value
  if (!val) {
    return ''
  }
  try {
    return Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(val.createdAt))
  }
  catch (error) {
    console.error('createdAt', error)
    return ''
  }
})
</script>

<template>
  <main v-if="data" class="w-full">
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-0 max-w-[52rem] min-w-0 w-full border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <article
          data-cursor="text"
          class="text-md m-auto px-4 sm:px-8"
        >
          <header class="border-b border-bd px-4 py-10 -mx-4 sm:px-8 sm:py-14 sm:-mx-8">
            <div class="mx-auto max-w-3xl">
              <div class="mb-4 text-xs text-fg-3 font-mono">
                <span class="text-fg-1">$</span>
                <span class="ml-2">cat ~{{ path }}.md</span>
              </div>
              <h1 class="text-3xl leading-tight tracking-tight sm:text-4xl">
                {{ data.title }}
              </h1>
              <p
                v-if="data.description"
                class="mt-3 text-base text-fg-3 sm:text-lg"
              >
                {{ data.description }}
              </p>
              <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fg-3 font-mono">
                <span v-if="createdAt">
                  {{ createdAt }}
                </span>
                <template v-if="Array.isArray(data.tags) && data.tags.length > 0">
                  <span class="text-fg-3/50">|</span>
                  <span
                    v-for="tag in data.tags"
                    :key="tag"
                  >
                    #{{ tag }}
                  </span>
                </template>
                <template v-if="otherLangMap && otherLangMap.size > 0">
                  <span class="text-fg-3/50">|</span>
                  <template v-for="(entry, i) in [...otherLangMap.entries()]" :key="entry[0]">
                    <span v-if="i > 0" class="text-fg-3/60">·</span>
                    <NuxtLink
                      :to="entry[1].path"
                      class="transition-colors hover:text-fg-1"
                    >
                      {{ t(entry[0], seoLocale) }}
                    </NuxtLink>
                  </template>
                </template>
              </div>
            </div>
          </header>

          <div class="mx-auto max-w-3xl py-10 sm:py-14">
            <ContentRenderer :value="data" class="max-w-none break-words prose prose-zinc dark:prose-invert" />
          </div>
          <div class="border-t border-bd -mx-4 sm:-mx-8">
            <div class="divide-y divide-bd">
              <div class="px-4 py-3 text-sm text-fg-3 font-mono opacity-75 sm:px-8">
                <ContentLicense />
              </div>
              <div class="px-4 py-4 text-sm text-fg-3 font-mono opacity-75 sm:px-8">
                <span class="text-fg-1">$ </span>
                <NuxtLink :to="`/${locale}`">
                  cd ..
                </NuxtLink>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>
