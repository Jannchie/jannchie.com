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
const { data } = await useAsyncData(path, () => {
  return queryCollection('content').path(path).first()
})

const { data: otherLangMap } = await useAsyncData(`${path}/${locale}other`, async () => {
  const otherLocales = locales.filter(l => l !== locale)
  const otherlocalePath = otherLocales.map((l) => {
    return path.replace(`/${locale}/`, `/${l}/`)
  })

  const otherLangs = await queryCollection('content').where('path', 'IN', otherlocalePath).all()
  const localeToPostMap = new Map()
  for (const post of otherLangs) {
    const postLocale = post.path.split('/')[1] // 假设 locale 是路径的一部分，如`/en/...`
    localeToPostMap.set(postLocale, post)
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

useSeoMeta(() => {
  return buildSeoMeta({
    title: data.value?.title ?? '404',
    description: data.value?.description ?? '404',
    url: canonicalUrl.value,
    type: 'article',
    image: ogImage,
    siteName: 'Jannchie\'s Home',
    publishedTime: publishedTime.value,
    modifiedTime: modifiedTime.value,
  })
})

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
            <NuxtLink
              :to="path"
              class="text-sm text-fg-3"
            >
              {{ data.title }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <article
          data-cursor="text"
          class="text-md m-auto w-full px-4 py-2 sm:px-8"
        >
          <header class="my-6 border-y border-bd">
            <div class="py-6 sm:py-8">
              <div class="flex items-center gap-3 text-xs text-fg-3">
                <span class="h-1px flex-1 bg-bd" />
                <span class="px-2 font-mono">
                  {{ createdAt }}
                </span>
                <span class="h-1px flex-1 bg-bd" />
              </div>
              <h1 class="mt-4 text-center leading-tight sm:text-3xl text-2xl!">
                {{ data.title }}
              </h1>
            </div>

            <div
              v-if="otherLangMap && otherLangMap.size > 0"
              class="border-t border-bd py-4"
            >
              <div class="flex items-center gap-3 text-xs text-fg-3">
                <span class="h-1px flex-1 bg-bd" />
                <span class="px-2 font-mono">
                  {{ t('otherLang', locale) }}
                </span>
                <span class="h-1px flex-1 bg-bd" />
              </div>

              <div class="mt-3 flex flex-wrap items-center justify-center gap-2">
                <NuxtLink
                  v-for="lang in otherLangMap.keys()"
                  :key="lang" :to="otherLangMap.get(lang).path"
                  target="_blank"
                  class="border border-bd rounded-sm px-2 py-1 text-xs text-fg-2 transition-colors duration-150 ease-in-out" :class="[
                    locale === lang
                      ? 'border-fg-1 text-fg-1 cursor-default'
                      : 'text-fg-3 hover:border-fg-1 hover:text-fg-1',
                  ]"
                  :aria-current="locale === lang ? 'page' : undefined"
                >
                  {{ t(lang, locale) }}
                </NuxtLink>
              </div>
            </div>
          </header>

          <ContentRenderer :value="data" class="m-auto max-w-none prose prose-zinc dark:prose-invert" />
          <div class="mt-32 border-b border-t border-bd -mx-4 sm:-mx-8">
            <div class="divide-y divide-bd">
              <div class="px-4 py-3 sm:px-8">
                <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-fg-3">
                  <span
                    v-for="tag in data.tags"
                    :key="tag"
                    class="border-b border-bd pb-0.5"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <div class="px-4 py-3 text-sm text-fg-3 font-mono opacity-75 sm:px-8">
                <ContentLicense />
              </div>
              <div class="border-b border-bd px-4 py-4 text-sm text-fg-3 font-mono opacity-75 sm:px-8">
                <span>$ </span>
                <NuxtLink
                  :to="`/${locale}`"
                >
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
