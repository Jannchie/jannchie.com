<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  content?: string
}>()

// Default values for props
const alertType = computed(() => props.type || 'info')

// Computed styling based on alert type with dark mode support
const alertStyles = computed(() => {
  const baseStyles = {
    title: 'text-fg-1',
    content: 'text-fg-3',
  }

  switch (alertType.value) {
    case 'info': {
      return {
        ...baseStyles,
        icon: 'text-blue-500 dark:text-blue-400',
        bar: 'bg-blue-500 dark:bg-blue-400',
      }
    }
    case 'warning': {
      return {
        ...baseStyles,
        icon: 'text-yellow-500 dark:text-yellow-400',
        bar: 'bg-yellow-500 dark:bg-yellow-400',
      }
    }
    case 'error': {
      return {
        ...baseStyles,
        icon: 'text-red-500 dark:text-red-400',
        bar: 'bg-red-500 dark:bg-red-400',
      }
    }
    case 'success': {
      return {
        ...baseStyles,
        icon: 'text-green-500 dark:text-green-400',
        bar: 'bg-green-500 dark:bg-green-400',
      }
    }
    default: { // Should technically not be reached if type is constrained, but good practice
      return {
        ...baseStyles,
        icon: 'text-gray-500 dark:text-gray-400',
        bar: 'bg-gray-500 dark:bg-gray-400',
      }
    }
  }
})

const alertIcon = computed(() => ({
  info: 'i-jannchie-info',
  warning: 'i-jannchie-alert-triangle',
  error: 'i-jannchie-x-circle',
  success: 'i-jannchie-check-circle',
}[alertType.value]))

// Combine static and dynamic classes for the container
const containerClasses = computed(() => [
  'not-prose my-4 flex items-start border-b border-t border-bd -mx-4 py-3 pl-6 pr-4 transition-colors sm:-mx-8 sm:pl-8 sm:pr-8 relative',
])
</script>

<template>
  <div :class="containerClasses">
    <div class="absolute left-0 top-0 h-full w-1" :class="alertStyles.bar" />
    <div
      class="mr-3 flex flex-shrink-0 self-center"
      :class="alertStyles.icon"
    >
      <i
        class="h-5 w-5"
        :class="alertIcon"
      />
    </div>

    <div>
      <h3
        v-if="title"
        class="mb-1 text-base font-medium"
        :class="alertStyles.title"
      >
        {{ title }}
      </h3>
      <div
        v-if="content"
        class="text-xs"
        :class="alertStyles.content"
      >
        {{ content }}
      </div>
      <div
        v-else
        class="text-xs"
        :class="alertStyles.content"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
