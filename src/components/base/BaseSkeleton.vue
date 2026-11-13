<script setup>
defineProps({
  rows: {
    type: Number,
    default: 3,
  },
})
</script>

<template>
  <div class="base-skeleton" role="status" aria-busy="true">
    <span v-for="row in rows" :key="row" class="base-skeleton__row" />
  </div>
</template>

<style scoped lang="scss">
.base-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  &__row {
    height: 16px;
    background: var(--color-border);
    border-radius: var(--radius-sm);
    animation: base-skeleton-pulse 1.2s ease-in-out infinite;
  }
}

@keyframes base-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}
</style>
