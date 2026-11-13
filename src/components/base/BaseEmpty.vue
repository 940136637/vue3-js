<script setup>
defineProps({
  description: {
    type: String,
    default: '暂无数据',
  },
})
</script>

<template>
  <div class="base-empty">
    <p class="base-empty__text">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.base-empty {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-8) var(--space-4);
  color: var(--color-text-secondary);

  &__text {
    font-size: var(--font-size-base);
  }
}
</style>
