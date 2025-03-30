<script setup lang="ts">
import { t } from '@/i18n'

definePageMeta({ middleware: ['i18n'], layout: 'default' })

const projects = useProjects()
const demos = useDemos()
const locale = useRoute('locale').params.locale

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
  return Object.values(sponsorsRaw.value.reduce((result: any, sponsor: any) => {
    const { user_name, order_price } = sponsor
    if (!result[user_name]) {
      result[user_name] = { user_name, total_order_price: 0, user_avatar: sponsor.user_avatar }
    }
    result[user_name].total_order_price += order_price
    return result
  }, {} as { [user_name: string]: { user_name: string, total_order_price: number, user_avatar: string } })).sort((a: any, b: any) => b.total_order_price - a.total_order_price) as any
})
const posts = await queryCollection('content').where('path', 'LIKE', `/${locale}/%`).order('meta', 'ASC').all()

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
  for (let i = 0; i < demos.length; i++) {
    divided[i % cols.value].push(demos[i])
  }
  return divided
})

function getTurePath(path: string) {
  if (path.startsWith('/zh-cn')) {
    path = path.replace('/zh-cn', '/zh-CN')
    return path
  }
  return path
}
</script>

<template>
  <main class="flex flex-col">
    <HomeCover />
    <div
      v-if="posts.length > 0"
      class="m-auto mb-12 max-w-full w-[60ch]"
    >
      <HomeSectionTitle class="mb-6">
        {{ t('posts') }}
      </HomeSectionTitle>

      <div class="flex flex-col gap-6">
        <NuxtLink
          v-for="post in posts"
          :key="post.path"
          class="block rounded-md p-4 transition-shadow hover:shadow-sm"
          :to="getTurePath(post.path)"
        >
          <h3 class="mb-2 text-lg font-medium">
            {{ post.title }}
          </h3>
          <div
            v-if="post.meta.createdAt"
            class="text-xs"
          >
            {{ new Date(post.meta.createdAt as string).toDateString() }}
          </div>
        </NuxtLink>
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
    <div class="m-auto flex flex-wrap justify-center gap-4 p-8">
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
