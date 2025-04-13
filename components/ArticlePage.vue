<script setup lang="ts">
import 'katex/dist/katex.min.css'
import { t } from '~/i18n'

const { title } = defineProps<{
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
  const otherLocales = locales.filter((l) => l !== locale);
  const otherlocalePath = otherLocales.map((l) => {
    return path.replace(`/${locale}/`, `/${l}/`);
  });

  const otherLangs = await queryCollection('content').where('path', 'IN', otherlocalePath).all();
  const localeToPostMap = new Map();
  otherLangs.forEach(post => {
    const postLocale = post.path.split('/')[1]; // 假设 locale 是路径的一部分，如`/en/...`
    localeToPostMap.set(postLocale, post);
  });
  return localeToPostMap;
});


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
  catch (e) {
    console.error('createdAt', e)
  }
})

defineOgImageComponent('Jannchie', {
  theme: '#000000',
  avatar: 'https://jannchie.com/imgs/jannchie.jpg',
  title: data.value?.title ?? '404',
  subtitle: createdAt
})
</script>

<template>
  <main v-if="data">
    <div class="pb-8 pt-3 text-start w-65ch m-auto">
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
    <article
      data-cursor="text"
      class="text-md m-auto p-2 sm:px-0 max-w-65ch"
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
       :class="[
         'rounded-md px-2 py-1 text-sm transition-colors duration-150 ease-in-out', // 基础样式、内边距、圆角和过渡
         locale === lang.locale
           ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold cursor-default' // 激活链接样式：背景色、更深的文本颜色、加粗、默认光标
           : 'text-zinc-600 dark:text-zinc-300 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-100' // 非激活链接样式：基础颜色 + 悬停效果
       ]"
       :aria-current="locale === lang.locale ? 'page' : undefined" >
       {{ t(lang) }}
       </NuxtLink>
   </div>
 </div>

      <ContentRenderer :value="data"  class="prose prose-zinc dark:prose-invert m-auto" />
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
