<script setup>
const route = useRoute()
const router = useRouter()
const locales = ['en', 'zh', 'ja']
watchEffect(() => {
  const currentLocale = route.params.locale
  if (!locales.includes(currentLocale)) {
    const preferred = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en'
    nextTick(() => {
      router.push(`/${preferred}${route.path}`)
    })
  }
})
</script>

<template>
  <div class="min-h-[calc(100vh-16rem-2rem*2)]">
    <slot />
  </div>
  <Footer />
</template>
