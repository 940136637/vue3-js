<script setup>
import { ref } from 'vue'
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import BaseError from '@/components/base/BaseError.vue'
import BaseSkeleton from '@/components/base/BaseSkeleton.vue'
import { useLoading } from '@/composables/useLoading'

const stack = ['Vue 3', 'JavaScript', 'Vite', 'Pinia', 'Vue Router', 'SCSS']

const { loading, run } = useLoading()
const items = ref([])
const error = ref(null)
const hasLoaded = ref(false)

/**
 * 模拟异步等待
 * @param {number} ms 毫秒
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function loadDemo() {
  error.value = null
  try {
    items.value = await run(async () => {
      await wait(600)
      return [
        { id: '1', label: '统一使用 script setup + Composition API' },
        { id: '2', label: '请求收敛在 src/api，组件不直接访问 axios' },
        { id: '3', label: '样式变量统一在 variables.scss 声明' },
        { id: '4', label: '提交前 npm run check 全量校验' },
      ]
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    hasLoaded.value = true
  }
}
</script>

<template>
  <div class="home-view">
    <section class="home-view__hero">
      <h1 class="home-view__title">Vue 3 规范底座</h1>
      <p class="home-view__desc">
        本示例按 AGENTS.md 与 docs/standards 组织，页面、数据、样式分层清晰，可直接替换为业务代码。
      </p>
      <ul class="home-view__stack">
        <li v-for="item in stack" :key="item" class="home-view__chip">{{ item }}</li>
      </ul>
    </section>

    <section class="home-view__panel">
      <header class="home-view__panel-header">
        <h2 class="home-view__panel-title">异步三态示例</h2>
        <button class="home-view__action" type="button" :disabled="loading" @click="loadDemo">
          {{ loading ? '加载中…' : '加载示例数据' }}
        </button>
      </header>

      <BaseSkeleton v-if="loading" :rows="3" />
      <BaseError v-else-if="error" :message="error" @retry="loadDemo" />
      <BaseEmpty v-else-if="hasLoaded && items.length === 0" description="暂无示例数据" />
      <ul v-else-if="items.length" class="home-view__list">
        <li v-for="item in items" :key="item.id" class="home-view__item">{{ item.label }}</li>
      </ul>
      <p v-else class="home-view__hint">
        点击右上角按钮加载示例数据，观察 loading → 空态 → 列表的三态切换。
      </p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);

  &__hero {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  &__title {
    font-size: var(--font-size-xl);
  }

  &__desc {
    max-width: 640px;
    color: var(--color-text-secondary);
  }

  &__stack {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  &__chip {
    padding: var(--space-1) var(--space-3);
    font-size: var(--font-size-sm);
    color: var(--color-primary);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 999px;
  }

  &__panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-6);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  &__panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__panel-title {
    font-size: var(--font-size-lg);
  }

  &__action {
    padding: var(--space-2) var(--space-4);
    color: var(--color-bg);
    background: var(--color-primary);
    border: none;
    border-radius: var(--radius-sm);
    transition: background-color var(--duration-fast) ease;

    &:hover:not(:disabled) {
      background: var(--color-primary-hover);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  &__item {
    padding: var(--space-3) var(--space-4);
    background: var(--color-bg-subtle);
    border-radius: var(--radius-sm);
  }

  &__hint {
    color: var(--color-text-secondary);
  }
}
</style>
