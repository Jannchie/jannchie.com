<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  content?: string
}>()

// Default values for props
const alertType = computed(() => props.type || 'info')

// Computed styling based on alert type with dark mode support - Subtle version
const alertStyles = computed(() => {
  // Base styles for neutrality
  const baseStyles = {
    // Using a very subtle background, slightly different for dark mode
    containerBg: 'bg-gray-50 dark:bg-zinc-900/30',
    // Neutral text colors
    title: 'text-gray-900 dark:text-gray-100',
    content: 'text-gray-700 dark:text-gray-400',
  }

  switch (alertType.value) {
    case 'info':
      return {
        ...baseStyles,
        // Colored left border and icon
        containerBorder: 'border-l-blue-500 dark:border-l-blue-600',
        icon: 'text-blue-500 dark:text-blue-400',
      }
    case 'warning':
      return {
        ...baseStyles,
        containerBorder: 'border-l-yellow-500 dark:border-l-yellow-600',
        icon: 'text-yellow-500 dark:text-yellow-400',
      }
    case 'error':
      return {
        ...baseStyles,
        containerBorder: 'border-l-red-500 dark:border-l-red-600',
        icon: 'text-red-500 dark:text-red-400',
      }
    case 'success':
      return {
        ...baseStyles,
        containerBorder: 'border-l-green-500 dark:border-l-green-600',
        icon: 'text-green-500 dark:text-green-400',
      }
    default: // Should technically not be reached if type is constrained, but good practice
      return {
        ...baseStyles,
        containerBorder: 'border-l-gray-500 dark:border-l-gray-600',
        icon: 'text-gray-500 dark:text-gray-400',
      }
  }
})

// Combine static and dynamic classes for the container
const containerClasses = computed(() => [
  'not-prose my-4 flex items-start border-l-4 rounded px-4 py-3 transition-colors', // Removed 'border', added 'border-l-4', adjusted 'rounded' potentially
  alertStyles.value.containerBg,
  alertStyles.value.containerBorder,
])
</script>

<template>
  <div :class="containerClasses">
    <div
      class="mr-3 flex-shrink-0 self-center"
      :class="alertStyles.icon"
    >
      <svg
        v-if="alertType === 'info'"
        class="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-else-if="alertType === 'warning'"
        class="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-else-if="alertType === 'error'"
        class="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-else-if="alertType === 'success'"
        class="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
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