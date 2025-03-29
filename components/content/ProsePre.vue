<script setup lang="ts">
const props = withDefaults(defineProps<{
  code:string
  language?:string
  filename?:string
  highlights?:Array<number>
  meta?:string
}>(), {
  code: '',
  language: 'txt',
  filename: undefined,
  highlights: () => [],
  meta: undefined,
})
import {} from 'shiki'
</script>

<template>
  <div class="relative rounded-xl overflow-hidden font-mono text-sm">
    <div class="flex items-center justify-between px-4 py-2 bg-zinc-200 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800">
      <div v-if="filename" class="text-zinc-700 dark:text-zinc-300">
        {{ filename }}
      </div>
      <div v-else class="text-zinc-500 dark:text-zinc-400">
        &lt;/&gt;
      </div>
      
      <div v-if="language" class="px-2 py-0.5 rounded text-xs bg-zinc-300 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
        {{ language }}
      </div>
    </div>
    
    <pre class="shiki not-prose px-6 font-mono m-0 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 overflow-x-auto" >
          <slot />
    </pre>
    
    <div v-if="meta" class="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 text-xs border-t border-zinc-200 dark:border-zinc-800">
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

code::before {
  content: '' !important;
}

code::after {
  content: '' !important;
}

</style>