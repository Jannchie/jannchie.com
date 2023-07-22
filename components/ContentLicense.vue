<script setup lang="ts">
const locale = useRoute('locale').params.locale
</script>

<template>
  <div v-if="locale === 'en'">
    {{ 'This content is licensed under ' }}
    <NuxtLink
      href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
      data-cursor="block"
    >
      {{ 'CC BY-NC-SA 4.0' }}
    </NuxtLink>
    {{ '.' }}
  </div>
  <div v-if="locale === 'zh-CN'">
    {{ '本文采用 ' }}
    <NuxtLink
      href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
      data-cursor="block"
    >
      {{ 'CC BY-NC-SA 4.0' }}
    </NuxtLink>
    {{ ' 协议进行公开。' }}
  </div>
  <div v-if="locale === 'ja'">
    {{ 'このコンテンツは ' }}
    <NuxtLink
      href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
      data-cursor="block"
    >
      {{ 'CC BY-NC-SA 4.0' }}
    </NuxtLink>
    {{ ' でライセンスされています。' }}
  </div>
</template>
