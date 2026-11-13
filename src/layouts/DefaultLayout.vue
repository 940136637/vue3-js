<script setup>
import { env } from '@/config/env'
</script>

<template>
  <div class="default-layout">
    <header class="default-layout__header">
      <RouterLink class="default-layout__brand" to="/">{{ env.appTitle }}</RouterLink>
      <nav class="default-layout__nav">
        <RouterLink to="/">首页</RouterLink>
      </nav>
    </header>

    <main class="default-layout__main">
      <slot />
    </main>

    <footer class="default-layout__footer">Vue 3 + JavaScript + Vite 规范底座</footer>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-6);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  &__brand {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-primary);
  }

  &__nav {
    display: flex;
    gap: var(--space-4);
    color: var(--color-text-secondary);
  }

  &__main {
    flex: 1;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: var(--space-6) var(--space-4);
  }

  &__footer {
    padding: var(--space-4);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-align: center;
  }
}
</style>
