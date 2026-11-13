import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserList } from '@/api/user'

/**
 * @typedef {import('@/types/user.types').UserItem} UserItem
 * @typedef {import('@/types/user.types').UserQuery} UserQuery
 */

export const useUserStore = defineStore('user', () => {
  /** @type {import('vue').Ref<UserItem[]>} */
  const list = ref([])
  const total = ref(0)
  const loading = ref(false)

  const isEmpty = computed(() => !loading.value && list.value.length === 0)

  /**
   * 加载用户列表
   * @param {UserQuery} query 查询条件
   * @returns {Promise<UserItem[]>} 用户列表
   */
  async function loadList(query) {
    loading.value = true
    try {
      const result = await fetchUserList(query)
      list.value = result.list
      total.value = result.total
      return result.list
    } finally {
      loading.value = false
    }
  }

  function reset() {
    list.value = []
    total.value = 0
  }

  return { list, total, loading, isEmpty, loadList, reset }
})
