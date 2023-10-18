export function useViewTransitionDark() {
  const { x, y } = useMouse()
  const isDark = useDark({
    onChanged: (isDark) => {
      const a = document.documentElement.getAttribute('color-scheme')
      if (a === 'dark' && isDark) {
        return
      }
      if (a === 'light' && !isDark) {
        return
      }
      if (a === null && !isDark) {
        return
      }
      setThemeAttributeWithAnimation(isDark ? 'dark' : 'light', x, y)
    },
  })
  function setThemeAttributeWithAnimation(theme: string, x: Ref<number>, y: Ref<number>) {
    // @ts-expect-error: Transition API
    if (typeof window === 'undefined' || typeof document.startViewTransition === 'undefined') {
      document.documentElement.setAttribute('color-scheme', theme)
      return
    }

    const endRadius = Math.hypot(
      Math.max(x.value, innerWidth - x.value),
      Math.max(y.value, innerHeight - y.value),
    )
    // @ts-expect-error: Transition API
    const transition = document.startViewTransition(() => {
      document.documentElement.setAttribute('color-scheme', theme)
    })
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x.value}px ${y.value}px)`,
        `circle(${endRadius}px at ${x.value}px ${y.value}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: theme !== 'dark' ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 500,
          easing: 'cubic-bezier(.2,.8,.6,1)',
          pseudoElement: theme !== 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      )
    }).catch(() => { })
  }
  return isDark
}
