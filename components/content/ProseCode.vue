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
      type: Function,
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
  <div class="bg-[#222] rounded-xl relative">
    <span class="p-2 absolute right-2 text-sm text-fg-3 font-mono">
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
