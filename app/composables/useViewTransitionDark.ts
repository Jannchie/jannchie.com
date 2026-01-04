function setThemeAttributeWithAnimation(theme: string, x: Ref<number>, y: Ref<number>) {
  if (globalThis.window === undefined || document.startViewTransition === undefined) {
    document.documentElement.dataset.scheme = theme
    return
  }

  const endRadius = Math.hypot(
    Math.max(x.value, innerWidth - x.value),
    Math.max(y.value, innerHeight - y.value),
  )
  const transition = document.startViewTransition(() => {
    document.documentElement.dataset.scheme = theme
  })
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x.value}px ${y.value}px)`,
      `circle(${endRadius}px at ${x.value}px ${y.value}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: theme === 'dark' ? clipPath.toReversed() : clipPath,
      },
      {
        duration: 500,
        easing: 'cubic-bezier(.2,.8,.6,1)',
        pseudoElement: theme === 'dark' ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    )
  }).catch(() => {})
}

export function useViewTransitionDark() {
  const { x, y } = useMouse()
  const isDark = useDark({
    onChanged: (isDark: any) => {
      const a = document.documentElement.dataset.scheme
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
  return isDark
}
