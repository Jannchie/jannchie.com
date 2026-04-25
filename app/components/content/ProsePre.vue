<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

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

const attrs = useAttrs()
const preAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const { shikiTheme } = useAppConfig()
const shikiBackgroundStyle = computed(() => ({
  '--shiki-light-bg': shikiTheme.lightBg,
  '--shiki-default-bg': shikiTheme.darkBg,
  '--shiki-dark-bg': shikiTheme.darkBg,
}))
</script>

<template>
  <div
    class="code-block relative overflow-hidden border-b border-t border-bd text-sm font-mono -mx-4 sm:-mx-8"
    :style="shikiBackgroundStyle"
  >
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

    <pre
      v-bind="preAttrs"
      class="shiki not-prose flex overflow-x-auto px-4 py-3 font-mono sm:px-8"
      :class="attrs.class"
      :style="attrs.style"
    >
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
.code-block,
.code-block pre.shiki {
  background-color: var(--shiki-light-bg);
}

html:not([data-scheme="dark"]) pre.shiki code span {
  color: var(--shiki-light);
  background: var(--shiki-light-bg);
  font-style: var(--shiki-light-font-style);
  font-weight: var(--shiki-light-font-weight);
  text-decoration: var(--shiki-light-text-decoration);
}

html[data-scheme="dark"] .code-block,
html[data-scheme="dark"] .code-block pre.shiki {
  background-color: var(--shiki-dark-bg);
}

html[data-scheme="dark"] pre.shiki code span {
  color: var(--shiki-dark);
  background: var(--shiki-dark-bg);
  font-style: var(--shiki-dark-font-style);
  font-weight: var(--shiki-dark-font-weight);
  text-decoration: var(--shiki-dark-text-decoration);
}

@media (prefers-color-scheme: dark) {
  html:not([data-scheme="light"]) .code-block,
  html:not([data-scheme="light"]) .code-block pre.shiki {
    background-color: var(--shiki-dark-bg);
  }

  html:not([data-scheme="light"]) pre.shiki code span {
    color: var(--shiki-dark);
    background: var(--shiki-dark-bg);
    font-style: var(--shiki-dark-font-style);
    font-weight: var(--shiki-dark-font-weight);
    text-decoration: var(--shiki-dark-text-decoration);
  }
}

pre code {
  counter-reset: line;
}

pre code .line {
  display: block;
  min-height: 1rem;
  counter-increment: line;
}

pre code .line::before {
  content: counter(line);
  display: inline-block;
  width: 1.5rem;
  margin-right: 1rem;
  text-align: right;
  color: #9ca3af;
  user-select: none;
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
