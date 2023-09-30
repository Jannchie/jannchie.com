<template>
  <div class="min-h-[calc(100vh-16rem-2rem*2)]">
    <Settings />
    <link
      rel="preload"
      href="//s1.hdslb.com/bfs/static/jinkela/long/font/medium.css"
      as="style"
      onload="this.rel='stylesheet'"
    >
    <VitePwaManifest />
    <NuxtLoadingIndicator color="#23a1c0" />
    <slot />
    <ToTopFab />
  </div>
  <Footer />
</template>
