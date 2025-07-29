<template>
  <div class="min-h-[calc(100vh-16rem-2rem*2)]">
    <Settings />
    <VitePwaManifest />
    <NuxtLoadingIndicator color="#23a1c0" />
    <slot />
    <ToTopFab />
  </div>
  <Footer />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&display=swap');
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

[data-scheme="dark"]::view-transition-old(root) {
  z-index: 9999;
}

[data-scheme="dark"]::view-transition-new(root) {
  z-index: 1;
}
</style>
