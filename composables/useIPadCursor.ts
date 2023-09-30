import { useCursor } from 'ipad-cursor/vue'

export function useIPadCursor() {
  const { initCursor, disposeCursor } = useCursor({
    enableMouseDownEffect: true,
    enableAutoTextCursor: true,
    enableLighting: true,
    enableAutoUpdateCursor: true,
  })

  let toggleCursor: () => void
  const isEnabled = ref(false)
  if (typeof window !== 'undefined' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isEnabled.value = true
    toggleCursor = () => {
      const el = document.querySelector('.ipad-cursor')
      // if exist, dispose
      if (el) {
        isEnabled.value = false
        disposeCursor()
      }
      else {
        initCursor()
        isEnabled.value = true
      }
    }
  }
  return { toggleCursor, isEnabled }
}
