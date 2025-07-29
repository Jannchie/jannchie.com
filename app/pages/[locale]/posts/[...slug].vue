<script setup lang="ts">
definePageMeta({ middleware: ['i18n'] })

useHead({
  htmlAttrs: {
    lang: useRoute('locale').params.locale,
  },
})

const { params: { locale }, path } = useRoute('locale')
const { data } = await useAsyncData(path, () => {
  return queryCollection('content').path(path).first()
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
  <ArticlePage title="Posts" />
</template>
