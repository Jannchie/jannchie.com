<template>
  <div class="h-8 w-full flex justify-center border-t border-zinc-200 text-2xl font-bold dark:border-zinc-600 lg:text-4xl">
    <div class="mx-16 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-zinc-200 text-center sm:border-x dark:border-zinc-600" />
  </div>
  <h2 class="w-full flex justify-center border-y border-zinc-200 text-2xl font-bold dark:border-zinc-600 lg:text-4xl">
    <div class="mx-16 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-zinc-200 py-16 text-center sm:border-x dark:border-zinc-600">
      <slot />
    </div>
  </h2>
</template>
