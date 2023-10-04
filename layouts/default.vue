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

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}

[color-scheme="dark"]::view-transition-old(root) {
  z-index: 9999;
}

[color-scheme="dark"]::view-transition-new(root) {
  z-index: 1;
}
</style>
