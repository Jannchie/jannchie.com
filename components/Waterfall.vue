<!-- eslint-disable no-console -->
<script setup lang="ts">
const props = defineProps<{
  gap?: MaybeRef<number>
  wrapperWidth?: MaybeRef<number>
  itemWidth?: MaybeRef<number>
  rowCount?: MaybeRef<number>
  paddingX?: MaybeRef<number>
}>()

const gap = computed(() => unref(props.gap) ?? 16)
const rowCount = computed(() => unref(props.rowCount) ?? 3)
const paddingX = computed(() => unref(props.paddingX) ?? 0)
const itemWidth = computed(() => unref(props.itemWidth) ?? 500)
const wrapper = ref<HTMLDivElement>()

function isArray<T>(val: any): val is T[] {
  return Array.isArray(val)
}

const itemsRef = ref([])

const boundings = computed(() => {
  const itemsVal = itemsRef.value
  return Array.from(itemsVal).map((item) => {
    return useElementBounding(item)
  })
})

watch(boundings, () => {}) // Magic, to avoid warning

const wrapperWidth = computed(() => itemWidth.value * rowCount.value + gap.value * (rowCount.value - 1) + paddingX.value * 2)

const wrapperHeight = ref(0)
function calculateWaterfallLayout(itemsRef: Ref<{ width: Ref<number>; height: Ref<number> }[]>, columnCount: MaybeRef<number>, gap: MaybeRef<number>, paddingX: MaybeRef<number>) {
  wrapperHeight.value = 0
  const items = unref(itemsRef)
  const columnHeights = Array.from<number>({ length: unref(columnCount) }).fill(0) // 初始化列高度数组
  const itemPositions = [] // 存储每个项目的坐标
  const offset = Math.max(0, wrapperWidth.value - unref(paddingX) * 2 - itemWidth.value * items.length - unref(gap) * (items.length)) / 2

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const columnIndex = columnHeights.indexOf(Math.min(...columnHeights)) // 找到最短的列
    const x = columnIndex * (itemWidth.value + unref(gap)) + unref(paddingX) + offset
    const y = columnHeights[columnIndex] // 计算 y 坐标
    itemPositions.push({ x, y })
    // 更新列的高度
    columnHeights[columnIndex] += item.height.value + unref(gap)
    wrapperHeight.value = Math.max(wrapperHeight.value, columnHeights[columnIndex])
  }
  return itemPositions
}

const layoutData = computed(() => {
  return calculateWaterfallLayout(boundings, rowCount, gap, paddingX)
})

function getItemStyle(i: number) {
  if (!isArray(layoutData.value))
    return {}
  const current = layoutData.value[i]
  if (!current)
    return {}
  return {
    left: `${current.x ?? 0}px`,
    top: `${current.y ?? 0}px`,
    maxWidth: `${itemWidth.value}px`,
  }
}
</script>

<template>
  <div
    ref="wrapper"
    class="relative overflow-hidden" :style="{
      width: `${wrapperWidth}px`,
      height: `${wrapperHeight}px`,
    }"
  >
    <div
      v-for="it, i in $slots.default!()[0]?.children"
      ref="itemsRef"
      :key="i"
      :style="getItemStyle(i as number)"
      class="absolute"
    >
      <component :is="it" />
    </div>
  </div>
</template>
