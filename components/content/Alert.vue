<script setup lang="ts">
const props = defineProps<{
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  content?: string
}>()

// Default values for props
const alertType = props.type || 'info'

// Computed styling based on alert type with dark mode support
function getAlertStyles() {
  switch (alertType) {
    case 'info':
      return {
        container: 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-800',
        icon: 'text-blue-500 dark:text-blue-400',
        title: 'text-blue-800 dark:text-blue-300',
        content: 'text-blue-700 dark:text-blue-300/90',
      }
    case 'warning':
      return {
        container: 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-800',
        icon: 'text-yellow-500 dark:text-yellow-400',
        title: 'text-yellow-800 dark:text-yellow-300',
        content: 'text-yellow-700 dark:text-yellow-300/90',
      }
    case 'error':
      return {
        container: 'bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-800',
        icon: 'text-red-500 dark:text-red-400',
        title: 'text-red-800 dark:text-red-300',
        content: 'text-red-700 dark:text-red-300/90',
      }
    case 'success':
      return {
        container: 'bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-800',
        icon: 'text-green-500 dark:text-green-400',
        title: 'text-green-800 dark:text-green-300',
        content: 'text-green-700 dark:text-green-300/90',
      }
    default:
      return {
        container: 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-800',
        icon: 'text-blue-500 dark:text-blue-400',
        title: 'text-blue-800 dark:text-blue-300',
        content: 'text-blue-700 dark:text-blue-300/90',
      }
  }
}

const alertStyles = getAlertStyles()
</script>

<template>
  <div
    class="not-prose my-4 flex items-start border rounded-lg p-4 transition-colors"
    :class="alertStyles.container"
  >
    <!-- Alert Icon -->
    <div
      class="mr-3 flex-shrink-0"
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
        class="mb-1 text-lg font-medium"
        :class="alertStyles.title"
      >
        {{ title }}
      </h3>
      <div
        v-if="content"
        class="text-sm"
        :class="alertStyles.content"
      >
        {{ content }}
      </div>
      <slot v-else />
    </div>
  </div>
</template>
