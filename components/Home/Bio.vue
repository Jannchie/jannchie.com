<script setup>
const locale = useRoute('locale').params.locale
</script>

<template>
  <div v-if="locale === 'en'" class="text-fg-3 children:my-4 max-w-[60ch] p-2">
    <p>
      I'm Jannchie Pan, a developer.
      <br>
      Working at
      <NuxtLink
        target="_blank" href="https://www.preferred.jp/ja/" data-cursor="block"
        class="gap-2 items-center p-1 underline decoration-offset-4 decoration-bg-1"
      >
        <IconPFN />
        {{ 'Preferred Networks' }}
      </NuxtLink>.
    </p>
    <p class="mt-2">
      Very fortunately, I have unlimited enthusiasm and energy to realize interesting ideas. I owe it all to the company
      and support of my wife.
    </p>
  </div>
  <div v-if="locale === 'zh-CN'" class="text-fg-3 children:my-4 max-w-[60ch] p-2">
    <p>
      我是见齐，一个普通的开发者。对前端特别感兴趣，也能进行 K8S 相关的运维和人工智能相关的研究。
      <br>
      我目前在
      <NuxtLink
        target="_blank" href="https://www.preferred.jp/ja/" data-cursor="block"
        class="gap-2 items-center p-1 underline decoration-offset-4 decoration-bg-1"
      >
        <IconPFN />
        {{ 'Preferred Networks' }}
      </NuxtLink> 工作。
    </p>
    <p class="mt-2">
      非常幸运，我有无限的热情和精力去实现有趣的想法。这一切都要归功于我的妻子的陪伴和支持。
    </p>
  </div>
  <div v-if="locale === 'ja'" class="text-fg-3 children:my-4 max-w-[60ch] p-2">
    <p>
      ソフトウェア開発エンジニアです。フロントエンド技術には特に興味があり、K8S などの運用業務や人工知能技術の研究も行うことができます。
      <br>
      現在、
      <NuxtLink
        target="_blank" href="https://www.preferred.jp/ja/" data-cursor="block"
        class="gap-2 items-center p-1 underline decoration-offset-4 decoration-bg-1"
      >
        <IconPFN />
        {{ 'Preferred Networks' }}
      </NuxtLink> で働いています。
    </p>
    <p class="mt-2">
      面白いアイデアを実現するために、私は情熱とエネルギーに溢れています。これはすべて、妻が絶えず私をサポートしてくれるおかげです。
    </p>
  </div>
</template>
