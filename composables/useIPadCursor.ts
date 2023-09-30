import { disposeCursor, initCursor } from 'ipad-cursor'

export function useIPadCursor() {
  const isEnabled = useLocalStorage('enable-ipad-cursor', true)

  if (isEnabled.value) {
    initCursor({
      enableMouseDownEffect: true,
      enableAutoTextCursor: true,
      enableLighting: true,
      enableAutoUpdateCursor: true,
    })
  }

  let toggleCursor: (() => void) | null = null
  if (typeof window !== 'undefined' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    toggleCursor = () => {
      const el = document.querySelector('.ipad-cursor')
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
