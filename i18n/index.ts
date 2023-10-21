import en from './data/en'
import zh from './data/zhCN'
import ja from './data/ja'

function objectToMap(obj: { [key: string]: any }): Map<string, any> {
  const entries = Object.entries(obj)
  return new Map(entries)
}

const i18NMap = new Map([['en', objectToMap(en)], ['zh-CN', objectToMap(zh)], ['ja', objectToMap(ja)]])

export function t(key: string, locale?: 'ja' | 'zh-CN' | 'en') {
  const { params } = useRoute()
  locale = locale ?? (params as any).locale
  if (!locale) {
    locale = 'en'
  }
  return i18NMap.get(locale)?.get(key) ?? key
}
