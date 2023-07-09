<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { updateCursor } from 'ipad-cursor'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

async function close() {
  offlineReady.value = false
  needRefresh.value = false
}

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
    v-if="needRefresh"
    class="p-4 fixed bottom-8 right-8 w-72 border rounded-xl bg-bg-3 border-bg-2"
    role="alert"
  >
    <div>
      <span>
        New content available, click on reload button to update.
      </span>
    </div>
    <div class="flex justify-end">
      <button data-cursor="block" class="p-2 cursor-none" @click="updateServiceWorker()">
        Reload
      </button>
      <button data-cursor="block" class="p-2 cursor-none" @click="close">
        Close
      </button>
    </div>
  </div>
</template>
