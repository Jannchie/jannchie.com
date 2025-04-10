<script setup lang="ts">
definePageMeta({ middleware: ['i18n'] })

useHead({
  htmlAttrs: {
    lang: useRoute('locale').params.locale,
  },
})
</script>

<template>
  <ArticlePage title="Posts" />
</template>
