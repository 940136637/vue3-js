# 04 状态管理与数据请求

## 1. 状态归属

| 状态类型 | 存放位置 |
| --- | --- |
| 组件内部 UI 状态（展开、输入中） | 组件 `ref` / `reactive` |
| 父子共享 | props / emits / `v-model` |
| 跨层级配置 | provide / inject |
| 跨页面业务状态（用户信息、权限、字典） | Pinia |
| 服务端数据缓存 | Pinia + api，禁止在组件里缓存 |

判断标准：**页面刷新后仍需存在、或 ≥ 2 个不相关页面需要读取** → 才进 Pinia。

## 2. Pinia 规范

### 2.1 写法

统一 setup store，文件名 `xxx.store.js`，store id 与文件名一致。

```js
// src/stores/user.store.js
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchProfile } from '@/api/user'

/**
 * @typedef {import('@/types/user.types').UserProfile} UserProfile
 */

export const useUserStore = defineStore('user', () => {
  /** @type {import('vue').Ref<UserProfile | null>} */
  const profile = ref(null)
  const loading = ref(false)

  const isLogin = computed(() => profile.value !== null)
  const displayName = computed(() => profile.value?.nickname ?? '未登录')

  /**
   * 加载用户资料
   * @returns {Promise<void>}
   */
  async function loadProfile() {
    loading.value = true
    try {
      profile.value = await fetchProfile()
    } finally {
      loading.value = false
    }
  }

  function reset() {
    profile.value = null
  }

  return { profile, loading, isLogin, displayName, loadProfile, reset }
})
```

### 2.2 禁止项

- ❌ 在 store 中直接 `axios` / `fetch`，必须调 `src/api`。
- ❌ 在 store 中操作 DOM、调用 `ElMessage` 等 UI 提示（提示由调用方负责）。
- ❌ 在 store 中保存组件实例、ref 引用、路由对象。
- ❌ 组件直接改 store 状态而不走 action（`userStore.list = []`）。
- ❌ 用 store 传递父子组件临时状态。
- ❌ 在 `setup store` 外使用 `this`。

### 2.3 异步约定

- action 必须有 JSDoc 返回注释，异步 action 负责维护自身 loading。
- 并发请求必须防竞态：每次请求带序号或 `AbortController`，旧响应不得覆盖新状态。
- 登出、切换租户等场景必须调用 `reset()` 清理状态。

## 3. 请求层

### 3.1 分层

```text
组件 → store / composable → src/api/<domain>.js → src/api/request.js（axios 实例）
```

- **只有** `src/api` 可以 import `axios`。
- 组件禁止直接 import `src/api/request.js`。
- api 函数只做「参数整理 + 接口调用 + 返回数据」，不做业务判断。

### 3.2 统一实例

```js
// src/api/request.js
import axios from 'axios'
import { env } from '@/config/env'

export const request = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

request.interceptors.response.use(
  (response) => response,
  (error) => {
    // 统一转换为可读错误，禁止在此弹 UI 提示
    const message = error.response?.data?.message ?? error.message ?? '网络异常，请稍后重试'
    return Promise.reject(new Error(message))
  },
)
```

### 3.3 api 文件写法

```js
// src/api/user.js
import { request } from '@/api/request'

/**
 * @typedef {import('@/types/common.types').PageResult} PageResult
 * @typedef {import('@/types/user.types').UserItem} UserItem
 * @typedef {import('@/types/user.types').UserQuery} UserQuery
 */

/**
 * 查询用户列表
 * @param {UserQuery} params 查询条件
 * @returns {Promise<PageResult<UserItem>>} 分页结果
 */
export function fetchUserList(params) {
  return request.get('/users', { params }).then((response) => response.data)
}

/**
 * 创建用户
 * @param {Omit<UserItem, 'id' | 'createdAt'>} payload 用户信息
 * @returns {Promise<UserItem>} 创建后的用户
 */
export function createUser(payload) {
  return request.post('/users', payload).then((response) => response.data)
}
```

要求：

- 一个业务域一个文件，函数名 `fetchXxx / createXxx / updateXxx / deleteXxx`。
- 必须有 JSDoc 入参、返回注释；返回值只暴露业务数据，不暴露 axios 响应对象。
- 禁止在 api 层做 loading、提示、跳转、状态写入。
- 路径使用常量或相对路径，禁止散落完整域名。

## 4. 错误处理

- api 层：只做错误归一化（转成 `Error` + 可读 message）。
- store / composable：捕获并记录，不弹窗。
- 页面层：负责提示与跳转（`ElMessage`、`router.push`）。
- 未捕获错误统一在 `app.config.errorHandler` 上报，禁止静默吞掉。

```js
try {
  await userStore.loadProfile()
} catch (e) {
  ElMessage.error(e instanceof Error ? e.message : '加载失败')
}
```

## 5. 类型（JSDoc）流转

```text
src/types/user.types.js（@typedef） → src/api/user.js → store / composable → 组件
```

- `src/types/*.types.js` 只写 JSDoc `@typedef` 注释，不写运行时代码。
- 后端字段与前端不一致时，在 api 层转换，禁止把后端原始结构透传到组件。
- 分页、查询参数必须有独立 typedef（`UserQuery`、`PageResult`）。
- 可选字段用 `@property {string} [keyword]`，可能为空用 `{string | null}`，两者语义不同不得混用。

## 6. 评审检查项

- [ ] 请求只出现在 `src/api`
- [ ] store 无 UI 提示、无 DOM 操作、无直接 axios
- [ ] 异步 action 维护 loading，有 JSDoc 返回注释
- [ ] 组件不改 store 状态（走 action）
- [ ] 存在竞态风险的场景已处理
- [ ] 错误在页面层有用户可感知反馈
