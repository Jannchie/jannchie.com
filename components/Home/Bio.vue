<script setup>
const locale = useRoute('locale').params.locale
</script>

<template>
  <div
    v-if="locale === 'en'"
    class="text-fg-3 children:my-4 max-w-[60ch] p-2"
  >
    <p>
      I am a software development engineer with a particular interest in front-end technologies, and I am also involved in operations for things like K8S and research in AIGC technologies.
    </p>
    <p class="mt-2">
      Currently, I am working at
      <NuxtLink
        target="_blank"
        href="https://www.preferred.jp/ja/"
        class="gap-2 items-center underline decoration-offset-4 decoration-bg-1 hover:bg-bg-2 px-2 py-1 transition-background-color"
      >
        <IconPFN />
        {{ 'Preferred Networks' }}
      </NuxtLink>, which is an inspiring environment that allows me to continuously learn and grow..
    </p>
    <p class="mt-2">
      I am passionate about bringing interesting ideas to life, all of which is made possible by the constant support of my wife. Her assistance and understanding enable me to focus on my daily tasks and actively take on new challenges.
    </p>
  </div>
  <div
    v-if="locale === 'zh-CN'"
    class="text-fg-3 children:my-4 max-w-[60ch] p-2"
  >
    <p>
      一名全栈软件开发工程师，兴趣是前端开发，同时我也参与了 K8S 等运维工作和 AIGC 相关的人工智能技术的研究。
    </p>
    <p class="mt-2">
      目前，我在
      <NuxtLink
        target="_blank"
        href="https://www.preferred.jp/ja/"
        class="gap-2 items-center underline decoration-offset-4 decoration-bg-1 hover:bg-bg-2 px-2 py-1 transition-background-color"
      >
        <IconPFN />
        {{ 'Preferred Networks' }}
      </NuxtLink> 工作，这是一个充满激励的环境，让我有机会学习和成长。
    </p>
    <p class="mt-2">
      我依旧对实现有趣的想法充满热情，这一切都得益于我妻子的持续支持。有了她的帮助和理解，我才能专注于日常工作并积极面对新的挑战。
    </p>
  </div>
  <div
    v-if="locale === 'ja'"
    class="text-fg-3 children:my-4 max-w-[60ch] p-2"
  >
    <p>
      私はソフトウェア開発エンジニアで、特にフロントエンド技術に興味を持っていますが、K8Sなどの運用業務やAIGC関連の人工知能技術の研究にも取り組んでいます。
    </p>
    <p class="mt-2">
      現在は
      <NuxtLink
        target="_blank"
        href="https://www.preferred.jp/ja/"
        class="gap-2 items-center underline decoration-offset-4 decoration-bg-1 hover:bg-bg-2 px-2 py-1 transition-background-color"
      >
        <IconPFN />
        {{ 'Preferred Networks' }}
      </NuxtLink> で仕事をしており、刺激的な環境の中で学び、成長しています。
    </p>
    <p class="mt-2">
      面白いアイデアを実現するために常に情熱を持って取り組んでいますが、そのバックグラウンドには、支えてくれる妻の存在があります。彼女の支援と理解があってこそ、日々の業務に集中することができ、新しい挑戦にも積極的に取り組むことができます。
    </p>
  </div>
</template>
