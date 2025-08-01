<template>
  <div class="h-8 w-full flex justify-center border-t border-zinc-300 text-2xl font-bold dark:border-zinc-700 lg:text-4xl">
    <div class="mx-16 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-zinc-300 text-center sm:border-x dark:border-zinc-700" />
  </div>
  <h2 class="w-full flex justify-center border-y border-zinc-300 text-2xl font-bold dark:border-zinc-700 lg:text-4xl">
    <div class="mx-16 max-w-[1120px] w-full flex items-center justify-center border-x-0 border-zinc-300 py-16 text-center sm:border-x dark:border-zinc-700">
      <slot />
    </div>
  </h2>
</template>
