<script setup>
import 'katex/dist/katex.min.css'
</script>

<template>
  <main>
    <h1 class="text-center text-4xl lg:text-6xl font-black pt-8 pb-16">
      {{ `Jannchie's Blog` }}
    </h1>
    <article
      data-cursor="text"
      class="m-auto p-2 sm:px-0 dark:prose-invert prose sm:prose-sm md:prose-md lg:prose-lg"
    >
      <ContentDoc />
      <div class="opacity-75 text-sm font-mono mt-32">
        本文采用
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
          data-cursor="block"
        >
          CC BY-NC-SA 4.0
        </a>
        协议进行公开
      </div>
      <div class="font-mono opacity-75 text-sm">
        <span>$ </span>
        <a
          href="/"
          data-cursor="block"
        >
          cd ..
        </a>
      </div>
    </article>
  </main>
  <Footer />
</template>
