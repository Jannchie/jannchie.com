<script setup lang="ts">
import { t } from '~/i18n'
import { buildSeoLinks, buildSeoMeta, ensureSeoLocale, normalizeSiteUrl } from '~/utils/seo'

definePageMeta({ middleware: ['i18n'] })

const route = useRoute('locale')
const locale = String(route.params.locale || 'en')
const seoLocale = ensureSeoLocale(locale)
const siteUrl = normalizeSiteUrl(useRuntimeConfig().public.siteUrl || 'https://jannchie.com')
const canonicalUrl = computed(() => `${siteUrl}${route.path}`)
const ogImage = `${siteUrl}/imgs/jannchie.jpg`

const posts = await queryCollection('content')
  .where('path', 'LIKE', `/${locale.toLowerCase()}/posts/%`)
  .order('createdAt', 'DESC')
  .all()

const postDateFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

useHead(() => ({
  htmlAttrs: { lang: locale },
  link: buildSeoLinks(route.path, seoLocale, siteUrl),
}))

useSeoMeta(() => buildSeoMeta({
  title: t('posts'),
  description: '',
  url: canonicalUrl.value,
  type: 'website',
  image: ogImage,
  siteName: 'Jannchie\'s Home',
}))
</script>

<template>
  <main class="w-full">
    <SiteNav />

    <section class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full min-w-0 border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div class="px-4 py-10 sm:px-8 sm:py-14">
          <div class="mb-4 text-xs text-fg-3 font-mono">
            <span class="text-fg-1">$</span>
            <span class="ml-2">ls ~/posts</span>
          </div>
          <h1 class="text-3xl leading-tight tracking-tight sm:text-5xl">
            {{ t('posts') }}
          </h1>
        </div>
      </div>
    </section>

    <section v-if="posts.length > 0" class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full min-w-0 border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div>
          <NuxtLink
            v-for="post in posts"
            :key="post.path"
            class="group block px-4 py-6 transition-colors hover:bg-bg-variant sm:px-8"
            :to="post.path.replace(`/${locale.toLowerCase()}/`, `/${locale}/`)"
          >
            <h3 class="mb-2 text-lg font-medium group-hover:underline">
              {{ post.title }}
            </h3>
            <div
              v-if="post.createdAt"
              class="text-xs text-fg-3 font-mono"
            >
              {{ postDateFormatter.format(new Date(post.createdAt)) }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full min-w-0 border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
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
