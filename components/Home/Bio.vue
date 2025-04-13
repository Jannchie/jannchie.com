<script setup>
const locale = useRoute('locale').params.locale
</script>

<template>
  <div
    v-if="locale === 'en'"
    class="max-w-[60ch] p-2 text-fg-3 children:my-4"
  >
    <p>
      Love programming, researching front-end and AIGC.
    </p>
    <p class="mt-2">
      Currently working at
      <NuxtLink
        target="_blank"
        href="https://www.preferred.jp/ja/"
        class="items-center gap-2 px-2 py-1 underline decoration-bg-1 decoration-offset-4 transition-background-color hover:bg-bg-2"
      >
        <IconPFN />
        {{ 'Preferred Networks' }}
      </NuxtLink>, hoping the company won't go bankrupt because of me.
    </p>
    <p class="mt-2">
      The greatest achievement is having the good fortune to have a beautiful girl artist as my wife.
    </p>
  </div>
  <div
    v-if="locale === 'zh-CN'"
    class="max-w-[60ch] p-2 text-fg-3 children:my-4"
  >
    <p>
      热爱编程，研究前端、AIGC。
    </p>
    <p class="mt-2">
      在
      <NuxtLink
        target="_blank"
        href="https://www.preferred.jp/ja/"
        class="items-center gap-2 px-2 py-1 underline decoration-bg-1 decoration-offset-4 transition-background-color hover:bg-bg-2"
      >
        <IconPFN />
        {{ 'Preferred Networks' }}
      </NuxtLink> 工作，希望公司别被我干倒闭。
    </p>
    <p class="mt-2">
      最大的成就是幸运获得美少女画师老婆。
    </p>
  </div>
  <div
    v-if="locale === 'ja'"
    class="max-w-[60ch] p-2 text-fg-3 children:my-4"
  >
    <p>
      プログラミングが好き、フロントエンド、AIGCを研究しています。
    </p>
    <p class="mt-2">
      今は、
      <NuxtLink
        target="_blank"
        href="https://www.preferred.jp/ja/"
        class="items-center gap-2 px-2 py-1 underline decoration-bg-1 decoration-offset-4 transition-background-color hover:bg-bg-2"
      >
        <IconPFN />
        {{ 'Preferred Networks' }}
      </NuxtLink> で仕事をしており、会社が倒産しないように頑張っています。
    </p>
    <p class="mt-2">
      最大の成果は美少女イラストレーターの妻を得たことです。
    </p>
  </div>
</template>
