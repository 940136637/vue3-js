import { ref } from 'vue'

/**
 * 异步 loading 包装
 * @param {boolean} [initial=false] 初始状态
 * @returns {{ loading: import('vue').Ref<boolean>, run: (task: () => Promise<*>) => Promise<*> }}
 */
export function useLoading(initial = false) {
  const loading = ref(initial)

  /**
   * 执行异步任务并自动维护 loading
   * @param {() => Promise<*>} task 异步任务
   * @returns {Promise<*>} 任务返回值
   */
  async function run(task) {
    loading.value = true
    try {
      return await task()
    } finally {
      loading.value = false
    }
  }

  return { loading, run }
}
