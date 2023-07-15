<script setup>
import 'katex/dist/katex.min.css'
import { t } from '@/i18n'

const ContentLicense = t('contentLicense')
const locale = useRoute().params.locale
</script>

<template>
  <main>
    <h1 class="text-center text-4xl lg:text-6xl font-black pt-8 pb-16">
      {{ `Jannchie's Posts` }}
    </h1>
    <article
      data-cursor="text"
      class="m-auto p-2 sm:px-0 dark:prose-invert prose sm:prose-sm md:prose-md lg:prose-lg"
    >
      <ContentDoc />
      <div class="opacity-75 text-sm font-mono mt-32">
        <ContentLicense />
      </div>
      <div class="font-mono opacity-75 text-sm">
        <span>$ </span>
        <NuxtLink
          :to="`/${locale}`"
          data-cursor="block"
        >
          cd ..
        </NuxtLink>
      </div>
    </article>
  </main>
</template>
