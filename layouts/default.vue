<script setup>
const route = useRoute()
const router = useRouter()
const locales = ['en', 'zh-CN', 'ja']
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
    <link
      rel="preload"
      href="//s1.hdslb.com/bfs/static/jinkela/long/font/medium.css"
      as="style"
      onload="this.rel='stylesheet'"
    >
    <Link rel="me" href="https://mastodon.social/@jannchie" />
    <VitePwaManifest />
    <NuxtLoadingIndicator color="#23a1c0" />
    <slot />
    <ToTopFab />
  </div>
  <Footer />
</template>
