const locales = ['en', 'zh-CN', 'ja']

export default defineNuxtRouteMiddleware((to) => {
  const { locale } = to.params as { locale: string }
  if (locales.includes(locale))
    return
  // get preferred language from browser
  if (typeof window === 'undefined')
    return
  const preferredLanguage = (typeof navigator === 'undefined') ? 'en' : navigator.language.split('-')[0]
  return navigateTo(`/${preferredLanguage}${to.path}`)
})
