<script setup lang="ts">
import { t } from '~/i18n'
import { buildSeoLinks, buildSeoMeta, ensureSeoLocale, normalizeSiteUrl } from '~/utils/seo'

const props = defineProps<{
  slug: string
  fallbackTitle: string
}>()

const route = useRoute('locale')
const locale = String(route.params.locale || 'en')
const seoLocale = ensureSeoLocale(locale)
const dataPath = `${locale}/${props.slug}`
const siteUrl = normalizeSiteUrl(useRuntimeConfig().public.siteUrl || 'https://jannchie.com')
const canonicalUrl = computed(() => `${siteUrl}${route.path}`)
const ogImage = `${siteUrl}/imgs/jannchie.jpg`

useHead(() => {
  return {
    htmlAttrs: {
      lang: locale,
    },
    link: buildSeoLinks(route.path, seoLocale, siteUrl),
  }
})

const { data } = await useAsyncData(`list:${dataPath}`, () => {
  return queryCollection('lists').where('stem', '=', dataPath).first()
})

useSeoMeta(() => {
  return buildSeoMeta({
    title: data.value?.title ?? props.fallbackTitle,
    description: data.value?.description ?? '',
    url: canonicalUrl.value,
    type: 'website',
    image: ogImage,
    siteName: 'Jannchie\'s Home',
  })
})

const dateFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const updatedAtLabel = computed(() => {
  const raw = data.value?.updatedAt
  if (!raw) {
    return ''
  }
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) {
    return raw
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

const hasAnyDetail = computed(() => {
  if (!data.value) {
    return false
  }
  return data.value.groups.some(group => group.items.some(item => item.detail))
})
</script>

<template>
  <main v-if="data" class="w-full">
    <SiteNav />

    <section class="w-full flex justify-center border-b border-bd">
      <div class="mx-4 max-w-[1120px] w-full min-w-0 border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div class="px-4 py-10 sm:px-8 sm:py-14">
          <div class="mb-4 text-xs text-fg-3 font-mono">
            <span class="text-fg-1">$</span>
            <span class="ml-2">cat ~/{{ slug }}.json</span>
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
            <span v-if="updatedAtLabel">
              updated · {{ updatedAtLabel }}
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
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="data.intro"
      class="w-full flex justify-center border-b border-bd"
    >
      <div class="mx-4 max-w-[1120px] w-full min-w-0 border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <p class="mx-auto max-w-3xl px-4 py-8 text-sm text-fg-3 leading-relaxed sm:px-8 sm:py-10 sm:text-base">
          {{ data.intro }}
        </p>
      </div>
    </section>

    <section
      v-for="group in data.groups"
      :key="group.name"
      class="w-full flex justify-center border-b border-bd"
    >
      <div class="mx-4 max-w-[1120px] w-full min-w-0 border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div class="md:grid md:grid-cols-[10rem_1fr]">
          <div class="flex items-start border-x border-b border-bd px-4 py-3 md:border-x-0 md:border-b-0 md:border-r md:px-6 md:py-6">
            <span class="text-sm text-fg-1 tracking-wider font-mono md:text-base">
              {{ group.name }}
            </span>
          </div>
          <div class="border-x border-bd py-3 md:border-x-0 md:py-4">
            <div
              v-for="(item, i) in group.items"
              :key="i"
              class="flex items-baseline gap-4 px-4 py-1 md:px-6 md:py-1.5"
            >
              <span class="flex-1">
                <component
                  :is="item.link ? 'a' : 'span'"
                  v-if="item.link"
                  :href="item.link"
                  target="_blank"
                  rel="noopener"
                  class="transition-colors hover:text-fg-1 hover:underline"
                >
                  {{ item.name }}
                </component>
                <span v-else>{{ item.name }}</span>
                <span v-if="item.note" class="ml-2 text-xs text-fg-3 font-mono">
                  — {{ item.note }}
                </span>
              </span>
              <span
                v-if="hasAnyDetail"
                class="text-right text-sm text-fg-3 font-mono"
              >
                {{ item.detail ?? '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="siblings.length > 0"
      class="w-full flex justify-center border-b border-bd"
    >
      <div class="mx-4 max-w-[1120px] w-full min-w-0 border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 text-xs text-fg-3 font-mono sm:px-8">
          <span class="text-fg-3/70">→</span>
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
