<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="base-error" role="alert">
    <p class="base-error__text">{{ message }}</p>
    <button class="base-error__action" type="button" @click="emit('retry')">重试</button>
  </div>
</template>

<style scoped lang="scss">
.base-error {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
  padding: var(--space-4);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-danger);
  border-radius: var(--radius-md);

  &__text {
    color: var(--color-danger);
  }

  &__action {
    padding: var(--space-1) var(--space-3);
    color: var(--color-bg);
    background: var(--color-primary);
    border: none;
    border-radius: var(--radius-sm);
    transition: background-color var(--duration-fast) ease;

    &:hover {
      background: var(--color-primary-hover);
    }
  }
}
</style>
