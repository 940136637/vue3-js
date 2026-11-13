<template>
  <section class="not-found-view">
    <h1 class="not-found-view__title">404</h1>
    <p class="not-found-view__desc">页面不存在或已被移除</p>
    <RouterLink class="not-found-view__link" to="/">返回首页</RouterLink>
  </section>
</template>

<style scoped lang="scss">
.not-found-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-8) 0;

  &__title {
    font-size: 48px;
    color: var(--color-primary);
  }

  &__desc {
    color: var(--color-text-secondary);
  }

  &__link {
    padding: var(--space-2) var(--space-4);
    color: var(--color-bg);
    background: var(--color-primary);
    border-radius: var(--radius-sm);
  }
}
</style>
