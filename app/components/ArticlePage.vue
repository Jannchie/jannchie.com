<script setup lang="ts">
import { t } from '~/i18n'
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

useSeoMeta({
  title: data.value?.title ?? '404',
  description: data.value?.description ?? '404',
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
      <div class="mx-16 max-w-[1120px] w-full border-x-0 border-bd sm:border-x">
        <div class="m-auto w-full px-4 pb-6 pt-3 text-start sm:px-8">
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
      <div class="mx-16 max-w-[1120px] w-full border-x-0 border-bd sm:border-x">
        <article
          data-cursor="text"
          class="text-md m-auto w-full px-4 py-2 sm:px-8"
        >
          <h1 class="text-center text-2xl!">
            {{ data.title }}
          </h1>
          <div class="text-center text-sm text-fg-3">
            {{ createdAt }}
          </div>

          <div
            v-if="otherLangMap && otherLangMap.size > 0"
            class="flex flex-col items-center justify-center py-4"
          >
            <div class="mb-2 px-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {{ t('otherLang') }}
            </div>

            <div class="flex flex-wrap items-center justify-center gap-1">
              <NuxtLink
                v-for="lang in otherLangMap.keys()"
                :key="lang.locale" :to="otherLangMap.get(lang).path"
                target="_blank"
                class="rounded-md px-2 py-1 text-sm transition-colors duration-150 ease-in-out" :class="[
                  locale === lang.locale
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold cursor-default' // 激活链接样式：背景色、更深的文本颜色、加粗、默认光标
                    : 'text-zinc-600 dark:text-zinc-300 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-100', // 非激活链接样式：基础颜色 + 悬停效果
                ]"
                :aria-current="locale === lang.locale ? 'page' : undefined"
              >
                {{ t(lang) }}
              </NuxtLink>
            </div>
          </div>

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
              <div class="px-4 py-3 text-sm text-fg-3 font-mono opacity-75 sm:px-8">
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
