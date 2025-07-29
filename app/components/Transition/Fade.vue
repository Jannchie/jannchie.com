<template>
  <Transition
    appear
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <slot />
  </Transition>
</template>
