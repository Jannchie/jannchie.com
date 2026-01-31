type SeoType = 'website' | 'article'

export const SEO_LOCALES = ['en', 'zh-CN', 'ja'] as const
export type SeoLocale = (typeof SEO_LOCALES)[number]

export function ensureSeoLocale(locale: string): SeoLocale {
  if (SEO_LOCALES.includes(locale as SeoLocale)) {
    return locale as SeoLocale
  }
  return 'en'
}

export function normalizeSiteUrl(siteUrl: string): string {
  if (!siteUrl) {
    return ''
  }
  return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl
}

function normalizePath(path: string): string {
  if (!path) {
    return '/'
  }
  return path.startsWith('/') ? path : `/${path}`
}

export function buildLocalizedPath(path: string, locale: SeoLocale, targetLocale: SeoLocale): string {
  const normalizedPath = normalizePath(path)
  const localeRoot = `/${locale}`
  if (normalizedPath === localeRoot || normalizedPath === `${localeRoot}/`) {
    return `/${targetLocale}`
  }
  if (normalizedPath.startsWith(`${localeRoot}/`)) {
    return normalizedPath.replace(`${localeRoot}/`, `/${targetLocale}/`)
  }
  return normalizedPath
}

export function buildSeoLinks(path: string, locale: SeoLocale, siteUrl: string): Array<Record<string, string>> {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl)
  const normalizedPath = normalizePath(path)
  const canonical = `${normalizedSiteUrl}${normalizedPath}`
  const alternates = SEO_LOCALES.map((targetLocale) => {
    return {
      rel: 'alternate',
      hreflang: targetLocale,
      href: `${normalizedSiteUrl}${buildLocalizedPath(normalizedPath, locale, targetLocale)}`,
    }
  })
  const xDefault = {
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${normalizedSiteUrl}${buildLocalizedPath(normalizedPath, locale, 'en')}`,
  }
  return [
    { rel: 'canonical', href: canonical },
    ...alternates,
    xDefault,
  ]
}

export function buildSeoMeta(params: {
  title: string
  description: string
  url: string
  type: SeoType
  image?: string
  siteName?: string
  publishedTime?: string
  modifiedTime?: string
}): Record<string, string> {
  const meta: Record<string, string> = {
    title: params.title,
    description: params.description,
    ogTitle: params.title,
    ogDescription: params.description,
    ogUrl: params.url,
    ogType: params.type,
    twitterTitle: params.title,
    twitterDescription: params.description,
    twitterCard: params.image ? 'summary_large_image' : 'summary',
  }
  if (params.siteName) {
    meta.ogSiteName = params.siteName
  }
  if (params.image) {
    meta.ogImage = params.image
    meta.twitterImage = params.image
  }
  if (params.type === 'article') {
    if (params.publishedTime) {
      meta.articlePublishedTime = params.publishedTime
    }
    if (params.modifiedTime) {
      meta.articleModifiedTime = params.modifiedTime
    }
  }
  return meta
}
