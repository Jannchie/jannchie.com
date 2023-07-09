<script setup lang="ts">
import { updateCursor } from 'ipad-cursor'

nextTick(() => {
  if (typeof window !== 'undefined') {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile)
      updateCursor()
  }
})
</script>

<template>
  <div
    v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
    class="p-4 fixed bottom-8 right-8 w-72 border rounded-xl bg-bg-3 border-bg-2"
    role="alert"
  >
    <div class="message">
      <span>
        Install PWA
      </span>
    </div>
    <button data-cursor="block" class="p-2 cursor-none" @click="$pwa.install()">
      Install
    </button>
    <button data-cursor="block" class="p-2 cursor-none" @click="$pwa.cancelInstall()">
      Cancel
    </button>
  </div>
</template>
