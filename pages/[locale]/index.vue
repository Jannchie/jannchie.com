<script setup lang="ts">
import { t } from '@/i18n'

definePageMeta({ middleware: ['i18n'] })

const projects = [{
  title: 'CodeTime',
  description: 'Programmer Time Tracking.',
  link: 'https://codetime.dev',
}, {
  title: 'Anichart.js',
  description: 'Animate historical data.',
  link: 'https://github.com/Jannchie/anichart.js',
}, {
  title: 'Zeroroku',
  description: 'Data Observatory.',
  link: 'https://zeroroku.com',
}, {
  title: 'Roku UI',
  description: 'React UI Library.',
  link: 'https://roku-ui.vercel.app',
}, {
  title: 'Jannchie\'s Blog',
  description: 'Here.',
  link: 'https://github.com/Jannchie/jannchie.com',
}]

const locale = useRoute('locale').params.locale

useHead({
  htmlAttrs: {
    lang: locale,
  },
})

const { data: sponsorsRaw } = await useFetch<[{ user_avatar: string; user_name: string; order_price: number }]>('https://api.zeroroku.com/sponsor', {
  headers: {
    'Content-Type': 'application/json',
  },
})
const groupedSponsors = computed(() => {
  if (!sponsorsRaw.value)
    return []
  return Object.values(sponsorsRaw.value.reduce((result, sponsor) => {
    const { user_name, order_price } = sponsor
    if (!result[user_name])
      result[user_name] = { user_name, total_order_price: 0, user_avatar: sponsor.user_avatar }
    result[user_name].total_order_price += order_price
    return result
  }, {} as { [user_name: string]: { user_name: string; total_order_price: number; user_avatar: string } })).sort((NuxtLink, b) => b.total_order_price - NuxtLink.total_order_price)
})
const posts = await queryContent(`/${locale}/posts`).limit(5).sort({ createdAt: -1 }).find()

const demos = [
  {
    title: t('demo-ios-sheet-title'),
    desc: t('demo-ios-sheet-desc'),
    href: 'https://github.com/Jannchie/vue-ios-sheet',
    link: '/videos/demo-ios-sheet.mp4',
  },
  {
    title: t('demo-vzad-title'),
    desc: t('demo-vzad-desc'),
    href: 'https://github.com/Jannchie/vzad',
    link: '/videos/demo-vzad.mp4',
  },
]
</script>

<template>
  <main class="flex flex-col">
    <HomeCover />
    <div v-if="posts.length > 0">
      <HomeSectionTitle>
        {{ t('posts') }}
      </HomeSectionTitle>
      <div class="flex justify-center flex-col max-w-md m-auto">
        <NuxtLink v-for="post in posts" :key="post._path" class="text-center p-4 min-w-72" data-cursor="block" :to="post._path">
          <div>
            {{ post.title }}
          </div>
          <div class="text-sm text-fg-3">
            {{ new Date(post.createdAt).toDateString() }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <HomeSectionTitle>
      {{ t('projects') }}
    </HomeSectionTitle>
    <div class="flex flex-wrap gap-4 p-8 m-auto justify-center">
      <HomeProjectCard
        v-for="project in projects"
        :key="project.title"
        :title="project.title"
        :description="project.description"
        :link="project.link"
      />
    </div>
    <HomeSectionTitle>
      {{ t('demos') }}
    </HomeSectionTitle>
    <div class="flex gap-2 justify-center items-start">
      <HomeDemoCard
        v-for="demo in demos"
        :key="demo.title"
        :title="demo.title"
        :desc="demo.desc"
        :link="demo.link"
        :href="demo.href"
      />
    </div>
    <HomeSectionTitle>
      {{ t('sponsors') }}
    </HomeSectionTitle>
    <div class="text-center text-sm text-sm opacity-75">
      <div class="p-2">
        <NuxtLink aria-label="github sponsor" href="https://github.com/sponsors/Jannchie" target="_blank" data-cursor="block" class="p-2 inline-block">
          <i class="i-tabler-brand-github" /> Github
        </NuxtLink>
        <NuxtLink aria-label="azz sponsor" href="https://azz.ee/jannchie" target="_blank" data-cursor="block" class="p-2 inline-block">
          <i class="i-tabler-pig-money" /> 爱赞助
        </NuxtLink>
      </div>
    </div>
    <div class="flex items-start gap-2 flex-wrap p-y px-2 m-auto max-w-[100vw] justify-center">
      <div v-for="sponsor in groupedSponsors" :key="sponsor.user_name">
        <img v-if="sponsor.user_avatar !== 'https://cdn.snscz.com/azz/img/avatar.png'" :alt="sponsor.user_name" width="48" height="48" :src="sponsor.user_avatar" class="rounded-full">
        <div v-else class="w-[48px] h-[48px] overflow-hidden rounded-full text-xs text-center flex items-center justify-center bg-bg-2 text-fg-2">
          {{ sponsor.user_name }}
        </div>
      </div>
    </div>
  </main>
</template>
