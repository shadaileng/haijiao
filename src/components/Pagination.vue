<template>
  <div v-if="totalPages > 1" class="van-pagination">
    <button
      class="van-pagination__item van-pagination__item--prev"
      :class="{ 'van-pagination__item--disabled': modelValue === 1 }"
      :disabled="modelValue === 1"
      @click="goTo(modelValue - 1)"
    >上一页</button>
    <div class="van-pagination__items">
      <template v-for="(p, idx) in visiblePages" :key="idx">
        <button
          v-if="typeof p === 'object' && p.type === 'left'"
          class="van-pagination__item van-pagination__item--page"
          @click="goTo(p.target)"
        >...</button>
        <button
          v-else-if="typeof p === 'object' && p.type === 'right'"
          class="van-pagination__item van-pagination__item--page"
          @click="goTo(p.target)"
        >...</button>
        <button
          v-else
          class="van-pagination__item van-pagination__item--page"
          :class="{ 'van-pagination__item--active': p === modelValue }"
          @click="goTo(p as number)"
        >{{ p }}</button>
      </template>
    </div>
    <button
      class="van-pagination__item van-pagination__item--next"
      :class="{ 'van-pagination__item--disabled': modelValue === totalPages }"
      :disabled="modelValue === totalPages"
      @click="goTo(modelValue + 1)"
    >下一页</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

type PageItem = number | { type: 'left'; target: number } | { type: 'right'; target: number }

const visiblePages = computed<PageItem[]>(() => {
  const total = totalPages.value
  const current = props.modelValue

  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: PageItem[] = []

  if (current <= 3) {
    for (let i = 1; i <= 5; i++) pages.push(i)
    pages.push({ type: 'right', target: current + 1 })
    pages.push(total)
  } else if (current >= total - 2) {
    pages.push(1)
    pages.push({ type: 'left', target: current - 1 })
    for (let i = total - 4; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    pages.push({ type: 'left', target: current - 1 })
    for (let i = current - 1; i <= current + 1; i++) pages.push(i)
    pages.push({ type: 'right', target: current + 1 })
    pages.push(total)
  }

  return pages
})

const goTo = (page: number) => {
  if (page < 1 || page > totalPages.value || page === props.modelValue) return
  emit('update:modelValue', page)
  emit('change', page)
}
</script>

<style scoped>
.van-pagination {
  font-size: var(--van-pagination-font-size, 14px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.van-pagination__items {
  display: flex;
}

.van-pagination__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: var(--van-pagination-item-width, 36px);
  height: var(--van-pagination-height, 40px);
  color: var(--van-pagination-item-default-color, #1989fa);
  background: var(--van-pagination-background, #f7f8fa);
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0;
  font-size: inherit;
  transition: opacity 0.2s;
}

.van-pagination__item:active:not(.van-pagination__item--disabled) {
  color: var(--van-white, #fff);
  background-color: var(--van-pagination-item-default-color, #1989fa);
}

.van-pagination__item--active {
  color: var(--van-white, #fff);
  background-color: var(--van-pagination-item-default-color, #1989fa);
}

.van-pagination__item--page {
  flex-grow: 0;
}

.van-pagination__item--prev,
.van-pagination__item--next {
  padding: 0 var(--van-padding-base, 16px);
  cursor: pointer;
}

.van-pagination__item--disabled,
.van-pagination__item--disabled:active {
  color: var(--van-pagination-item-disabled-color, #969799);
  background-color: var(--van-pagination-item-disabled-background, #f7f8fa);
  opacity: var(--van-disabled-opacity, 0.5);
  cursor: not-allowed;
}
</style>
