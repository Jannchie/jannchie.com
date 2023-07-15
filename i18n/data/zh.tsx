import { ClientOnly, NuxtLink } from '#components'

export default {
  subtitle: '的全栈工程师之旅。',
  posts: '文章',
  projects: '项目',
  sponsors: '赞助者',
  contentLicense: (
    <ClientOnly>
      本文采用
      <NuxtLink
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
        data-cursor="block"
      >
        CC BY-NC-SA 4.0
      </NuxtLink>
      协议进行公开
    </ClientOnly>
  ),
}
