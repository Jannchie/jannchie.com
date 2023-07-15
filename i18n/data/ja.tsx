import { ClientOnly, NuxtLink } from '#components'

export default {
  subtitle: 'フルスタックエンジニアとしての旅。',
  posts: '投稿',
  projects: 'プロジェクト',
  sponsors: 'スポンサー',
  contentLicense: (
    <ClientOnly>
      このコンテンツは
      <NuxtLink
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
        data-cursor="block"
      >
        CC BY-NC-SA 4.0
      </NuxtLink>
      でライセンスされています
    </ClientOnly>
  ),
}
