<script>
export default defineComponent({
  props: {
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      default: null,
    },
    highlights: {
      type: Array,
      default: () => [],
    },
    meta: {
      type: String,
      default: null,
    },
  },
})
</script>

<template>
  <div class="relative rounded-xl bg-[#222] text-xs">
    <span class="absolute right-2 p-2 text-xs text-fg-3 font-mono">
      {{ language }}
    </span>
    <slot />
  </div>
</template>

<style>
pre code .line {
  display: block;
  min-height: 1rem;
}
</style>
