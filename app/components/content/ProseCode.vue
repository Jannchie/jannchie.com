<script setup lang="ts"></script>

<template>
  <code
    class="border-border-zinc-300 border rounded bg-zinc-100 px-1 text-zinc-900 dark:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 mx-0.5 dark:text-zinc-200"
    v-bind="$attrs"
  >
    <slot />
  </code>
</template>
