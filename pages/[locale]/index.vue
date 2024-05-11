<script setup lang="ts">
import Waterfall from 'vue-wf'
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
const posts = await queryContent(`/${locale}/posts`).limit(5).sort({ createdAt: -1 }).find()

const { width } = useWindowSize()
const column = computed(() => {
  const w = Math.min(1660, width.value)
  if (width.value === Number.POSITIVE_INFINITY) {
    return 1
  }
  return Math.floor(w / 500) + 1
})
const itemWidth = computed(() => {
  const w = Math.min(1660, width.value)
  return (w - 32 * column.value) / column.value
})
</script>

<template>
  <main class="flex flex-col">
    <HomeCover />
    <div
      v-if="posts.length > 0"
      class="max-w-full w-[60ch] m-auto mb-48"
    >
      <HomeSectionTitle>
        {{ t('posts') }}
      </HomeSectionTitle>
      <div class="flex justify-center flex-col m-auto">
        <NuxtLink
          v-for="post in posts"
          :key="post._path"
          class="p-4 w-full"
          data-cursor="block"
          :to="post._path"
        >
          <div>
            {{ post.title }}
          </div>
          <div class="text-xs text-fg-3">
            {{ new Date(post.createdAt).toDateString() }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <HomeSectionTitle class="justify-center">
      {{ t('demos') }}
    </HomeSectionTitle>
    <div class="flex gap-2 justify-center items-start">
      <ClientOnly>
        <Waterfall
          :item-width="itemWidth"
          :row-count="column"
        >
          <HomeDemoCard
            v-for="demo in demos"
            :key="demo.title"
            :title="demo.title"
            :desc="demo.desc"
            :link="demo.link"
            :href="demo.href"
          />
        </Waterfall>
      </ClientOnly>
    </div>
    <HomeSectionTitle class="justify-center">
      {{ t('projects') }}
    </HomeSectionTitle>
    <div class="flex flex-wrap gap-4 p-8 m-auto justify-center">
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
          class="p-2 inline-block inline-flex gap-2 items-center"
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
          class="p-2 inline-block inline-flex gap-2 items-center"
        >
          <i class="i-tabler-pig-money" />
          <span>
            爱赞助
          </span>
        </NuxtLink>
      </div>
    </div>
    <div class="flex items-start gap-2 flex-wrap p-y px-2 m-auto max-w-[100vw] justify-center">
      <div
        v-for="sponsor in groupedSponsors"
        :key="sponsor.user_name"
      >
        <img
          v-if="sponsor.user_avatar !== 'https://cdn.snscz.com/azz/img/avatar.png'"
          :alt="sponsor.user_name"
          width="48"
          height="48"
          :src="sponsor.user_avatar"
          class="rounded-full"
        >
        <div
          v-else
          class="w-[48px] h-[48px] overflow-hidden rounded-full text-xs text-center flex items-center justify-center bg-bg-2 text-fg-2"
        >
          {{ sponsor.user_name }}
        </div>
      </div>
    </div>
  </main>
</template>
