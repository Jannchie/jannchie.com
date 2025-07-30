const locales = new Set(['en', 'zh-CN', 'ja'])
export default defineNuxtRouteMiddleware((to, from) => {
  try {
    const locale = to.path.split('/')[1]
    if (!locale) {
      return navigateTo(`/en${to.path}`, { redirectCode: 302 })
    }
    if (locales.has(locale)) {
      return
    }
    if (from.path !== to.path) {
      return
    }

    const cookie = useCookie('locale')
    if (cookie.value && locales.has(cookie.value)) {
      return navigateTo(`/${cookie.value}${to.path}`, { redirectCode: 302 })
    }

    const headers = useRequestHeaders()
    let preferredLanguages: string[] = ['en']
    try {
      if (headers['accept-language']) {
        preferredLanguages = headers['accept-language'].split(',').map(d => d.split(';')[0]).filter(d => d !== undefined)
      }
    }
    catch (error) {
      console.error(error)
    }

    for (const preferredLanguage of preferredLanguages) {
      let trueLanguage = preferredLanguage
      if (trueLanguage === 'zh-HK' || trueLanguage === 'zh') {
        trueLanguage = 'zh-CN'
      }
      else if (trueLanguage === 'ja-JP' || trueLanguage === 'ja') {
        trueLanguage = 'ja'
      }

      if (trueLanguage !== 'en' && locales.has(trueLanguage)) {
        return navigateTo(`/${trueLanguage}${to.path}`, { redirectCode: 302 })
      }
    }
    return navigateTo(`/en${to.path}`, { redirectCode: 302 })
  }
  catch (error) {
    console.error(error)
    return navigateTo(`/en${to.path}`, { redirectCode: 302 })
  }
})
