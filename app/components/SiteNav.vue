<script setup lang="ts">
import { t } from '~/i18n'

const route = useRoute()
const locale = computed(() => String((route.params as { locale?: string }).locale || 'en'))

const segments = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  return parts.slice(1)
})

const topSegment = computed(() => segments.value[0])

const pages = computed(() => [
  { key: 'use', to: `/${locale.value}/use` },
  { key: 'game', to: `/${locale.value}/game` },
  { key: 'anime', to: `/${locale.value}/anime` },
])

const locales = [
  { code: 'en', label: 'en' },
  { code: 'zh-CN', label: 'zh' },
  { code: 'ja', label: 'ja' },
]

const mirroredRoots = new Set(['use', 'game', 'anime'])

function localeHref(target: string) {
  const first = segments.value[0]
  if (first && mirroredRoots.has(first)) {
    return `/${target}/${first}`
  }
  return `/${target}`
}
</script>

<template>
  <nav
    class="sticky top-0 z-20 w-full border-b border-bd bg-bg-base/75 backdrop-blur"
  >
    <div class="w-full flex justify-center">
      <div class="mx-4 max-w-[1120px] w-full min-w-0 border-x-0 border-bd lg:mx-16 sm:mx-8 sm:border-x">
        <div class="flex items-center gap-1 px-4 py-3 text-xs text-fg-3 font-mono sm:gap-2 sm:px-8">
          <NuxtLink
            :to="`/${locale}`"
            :aria-label="t('home')"
            class="inline-flex items-center gap-1.5 px-2 py-1 transition-colors -my-1.5 hover:bg-bg-variant hover:text-fg-1"
          >
            <i class="i-tabler-home text-sm" />
            <span>~</span>
          </NuxtLink>
          <template v-for="(seg, i) in segments" :key="i">
            <span class="text-fg-3/60">/</span>
            <NuxtLink
              v-if="i < segments.length - 1"
              :to="`/${[locale, ...segments.slice(0, i + 1)].join('/')}`"
              class="transition-colors hover:text-fg-1"
            >
              {{ seg }}
            </NuxtLink>
            <span v-else class="text-fg-2">
              {{ seg }}
            </span>
          </template>
          <span class="text-fg-1">$</span>

          <span class="flex-1" />

          <div class="hidden items-center gap-1 md:flex">
            <NuxtLink
              v-for="p in pages"
              :key="p.key"
              :to="p.to"
              class="px-2 py-1 transition-colors hover:text-fg-1"
              :class="topSegment === p.key ? 'text-fg-1' : ''"
            >
              {{ t(p.key) }}
            </NuxtLink>
          </div>

          <div class="ml-1 flex items-center gap-1 border-l border-bd pl-2 sm:ml-2 sm:pl-3">
            <template v-for="(l, i) in locales" :key="l.code">
              <span v-if="i > 0" class="text-fg-3/60">·</span>
              <NuxtLink
                :to="localeHref(l.code)"
                :aria-label="l.code"
                class="px-1 transition-colors hover:text-fg-1"
                :class="locale === l.code ? 'text-fg-1' : ''"
              >
                {{ l.label }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
