<script setup lang="ts">
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
  <div class="relative overflow-hidden border-b border-t border-bd text-sm font-mono -mx-4 sm:-mx-8">
    <div class="flex items-center justify-between border-b border-bd px-4 py-2 sm:px-8">
      <div
        v-if="filename"
        class="text-fg-2"
      >
        {{ filename }}
      </div>
      <div
        v-else
        class="text-fg-3"
      >
        &lt;/&gt;
      </div>

      <div
        v-if="language"
        class="text-xs text-fg-3"
      >
        {{ language }}
      </div>
    </div>

    <pre class="shiki not-prose flex overflow-x-auto px-4 py-3 text-zinc-800 font-mono !bg-bg-2 sm:px-8 dark:text-zinc-200">
      <slot />
    </pre>

    <div
      v-if="meta"
      class="border-t border-bd px-4 py-2 text-xs text-fg-3 sm:px-8"
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
