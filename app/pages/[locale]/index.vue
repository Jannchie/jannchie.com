<script setup lang="ts">
import { t } from '@/i18n'

definePageMeta({ middleware: ['i18n'], layout: 'default' })
defineOgImageComponent('Meishi', {
  theme: '#000000',
  avatar: 'https://jannchie.com/imgs/jannchie.jpg',
  title: 'Jianqi Pan / Jannchie',
  subtitle: 'Full Stack Engineer',
  bottomRight: 'jannchie.com',
})

const projects = useProjects()
const demos = useDemos()
const locale = String(useRoute('locale').params.locale || 'en')

useHead({
  htmlAttrs: {
    lang: locale,
  },
})

const { data: sponsorsRaw } = await useFetch<[{ user_avatar: string, user_name: string, order_price: number }]>('https://api.zeroroku.com/sponsor', {
  headers: {
    'Content-Type': 'application/json',
  },
})
const groupedSponsors = computed(() => {
  if (!sponsorsRaw.value) {
    return [] as any
  }
  const result: { [user_name: string]: { user_name: string, total_order_price: number, user_avatar: string } } = {}
  for (const sponsor of sponsorsRaw.value) {
    const { user_name, order_price, user_avatar } = sponsor
    if (!result[user_name]) {
      result[user_name] = { user_name, total_order_price: 0, user_avatar }
    }
    result[user_name].total_order_price += order_price
  }
  return Object.values(result).toSorted((a: any, b: any) => b.total_order_price - a.total_order_price) as any
})
const postDateFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
const posts = await queryCollection('content').where('path', 'LIKE', `/${locale}/posts/%`).order('createdAt', 'DESC').all()
const { width } = useWindowSize()

const cols = computed(() => {
  if (width.value > 1024) {
    return 5
  }
  else if (width.value > 768) {
    return 4
  }
  else if (width.value > 640) {
    return 3
  }
  return 2
})

const demosDivided = computed(() => {
  const divided: any[] = []
  // 将 demos 平均分到 cols 列中
  for (let i = 0; i < cols.value; i++) {
    divided[i] = []
  }
  for (const [i, demo] of demos.entries()) {
    divided[i % cols.value].push(demo)
  }
  return divided
})
</script>

<template>
  <main class="flex flex-col">
    <HomeCover />
    <div v-if="posts.length > 0" class="w-full">
      <HomeSectionTitle class="justify-center">
        {{ t('posts') }}
      </HomeSectionTitle>
      <div class="mb-12">
        <div
          v-for="post in posts"
          :key="post.path"
          class="w-full flex justify-center border-b border-bd"
        >
          <div class="mx-16 max-w-[1120px] w-full border-x-0 border-bd sm:border-x">
            <NuxtLink
              class="group block px-4 py-6 transition-colors hover:bg-bg-2 sm:px-8"
              :to="post.path"
            >
              <h3 class="mb-2 text-lg font-medium group-hover:underline">
                {{ post.title }}
              </h3>
              <div
                v-if="post.createdAt"
                class="text-xs text-fg-3"
              >
                {{ postDateFormatter.format(new Date(post.createdAt)) }}
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <ClientOnly>
      <HomeSectionTitle class="justify-center">
        {{ t('demos') }}
      </HomeSectionTitle>
      <div class="flex gap-2 px-2">
        <div
          v-for="(demoList, index) in demosDivided"
          :key="index"
          class="w-full gap-2"
        >
          <div
            class="flex flex-col gap-2"
          >
            <HomeDemoCard
              v-for="demo in demoList"
              :key="demo.title"
              :title="demo.title"
              :desc="demo.desc"
              :link="demo.link"
              :href="demo.href"
            />
          </div>
        </div>
      </div>
    </ClientOnly>
    <HomeSectionTitle class="justify-center">
      {{ t('projects') }}
    </HomeSectionTitle>
    <div class="h-8 w-full flex justify-center border-b border-default" />
    <div class="m-8 m-auto flex flex-wrap justify-center gap-4 border-x border-default">
      <HomeProjectCard
        v-for="project in projects"
        :key="project.title"
        :title="project.title"
        :description="project.description"
        :link="project.link"
        :icon="project.icon"
      />
    </div>
    <HomeSectionTitle class="justify-center">
      {{ t('sponsors') }}
    </HomeSectionTitle>
    <div class="text-center text-sm text-sm opacity-75">
      <div class="p-2">
        <NuxtLink
          aria-label="github sponsor"
          href="https://github.com/sponsors/Jannchie"
          target="_blank"
          data-cursor="block"
          class="inline-block inline-flex items-center gap-2 p-2"
        >
          <i class="i-tabler-brand-github" />
          <span>
            Github
          </span>
        </NuxtLink>
        <NuxtLink
          aria-label="azz sponsor"
          href="https://azz.ee/jannchie"
          target="_blank"
          data-cursor="block"
          class="inline-block inline-flex items-center gap-2 p-2"
        >
          <i class="i-tabler-pig-money" />
          <span>
            爱赞助
          </span>
        </NuxtLink>
      </div>
    </div>
    <div class="m-auto max-w-[100vw] flex flex-wrap items-start justify-center gap-2 p-y px-2 text-xs">
      <div
        v-for="sponsor in groupedSponsors"
        :key="sponsor.user_name"
      >
        {{ sponsor.user_name }}
      </div>
    </div>
  </main>
</template>
