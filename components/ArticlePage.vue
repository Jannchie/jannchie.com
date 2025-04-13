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
  console.log(locale, path, localeToPostMap)
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
    <div class="pb-16 pt-8 text-center text-lg lg:text-xl">
      {{ title }}
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
      class="flex flex-col items-center justify-center py-4 leading-0 children:p-2"
        v-if="otherLangMap && otherLangMap.size > 0"
      >
        <div class="text-center text-sm text-fg-3">
          {{ t('otherLang') }}
        </div>

        <NuxtLink
          v-for="lang in otherLangMap.keys()"
          :key="lang"
          :to="otherLangMap.get(lang).path"
          class="text-sm text-fg-3"
          :class="`${locale === lang.locale ? 'text-fg-1' : 'text-fg-3'} p-2`"
        >
          {{ t(lang) }}
        </NuxtLink>
    </div>

      <ContentRenderer :value="data"  class="prose prose-blue dark:prose-invert m-auto" />
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
