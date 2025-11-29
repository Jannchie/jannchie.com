<script setup lang="ts">
import {} from 'shiki'

withDefaults(defineProps<{
  code: string
  language?: string
  filename?: string
  highlights?: Array<number>
  meta?: string
}>(), {
  language: 'txt',
  filename: undefined,
  highlights: () => [],
  meta: undefined,
})
</script>

<template>
  <div class="relative overflow-hidden border border-zinc-200 rounded-xl text-sm font-mono dark:border-zinc-600">
    <div class="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-600 dark:bg-zinc-900">
      <div
        v-if="filename"
        class="text-zinc-700 dark:text-zinc-300"
      >
        {{ filename }}
      </div>
      <div
        v-else
        class="text-zinc-500 dark:text-zinc-400"
      >
        &lt;/&gt;
      </div>

      <div
        v-if="language"
        class="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      >
        {{ language }}
      </div>
    </div>

    <pre class="shiki not-prose flex overflow-x-auto bg-zinc-950 px-6 py-2 text-zinc-800 font-mono dark:text-zinc-200">
      <slot />
    </pre>

    <div
      v-if="meta"
      class="border-t border-zinc-200 bg-zinc-100 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
    >
      {{ meta }}
    </div>
  </div>
</template>

<style>
pre code .line {
  display: block;
  min-height: 1rem;
}

/* 添加行号样式 */
.line-number {
  display: inline-block;
  width: 1.5rem;
  text-align: right;
  margin-right: 1rem;
  color: #9ca3af;
}

/* 高亮行样式 */
.highlighted-line {
  background-color: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
  padding-left: calc(1rem - 3px);
  margin-left: -1rem;
}

p code::before {
  content: '' !important;
  height: 0 !important;
}

p code::after {
  content: '' !important;
  height: 0 !important;
}
</style>
