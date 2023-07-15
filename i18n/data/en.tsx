import { ClientOnly, NuxtLink } from '#components'

export default {
  subtitle: 'Journey as Full Stack Engineer.',
  posts: 'Posts',
  projects: 'Projects',
  sponsors: 'Sponsors',
  contentLicense: (
    <ClientOnly>
      {'This content is licensed under '}
      <NuxtLink
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
        data-cursor="block"
      >
        CC BY-NC-SA 4.0
      </NuxtLink>
    </ClientOnly>
  ),
}
