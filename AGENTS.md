# AGENTS.md — Vue 3 + JavaScript 项目 AI 协作总纲

> 本文件是 AI（含各类编码 Agent）在本仓库工作的**最高约束**。任何任务开始前必须先读本文件，再读与任务相关的 `.trae/rules/*` 与 `docs/standards/*`。
>
> **优先级**：用户当次明确指令 > 本文件 > `.trae/rules/*` > `docs/standards/*` > 既有代码习惯。
> 冲突时取**更严格**的一方。违反「红线」的代码视为不可交付，即使功能“能跑”。

---

## 1. 项目基线（未经确认不得变更）

| 项 | 约定 |
| --- | --- |
| 框架 | Vue 3，统一 `<script setup>` + Composition API |
| 构建 | Vite |
| 语言 | JavaScript（ES2022+，ESM），禁止 TypeScript 语法 |
| 类型表达 | JSDoc 注释（`@typedef` / `@param` / `@returns`），不引入 TS |
| 路由 / 状态 | Vue Router 4 / Pinia（`setup` 语法） |
| 请求 | axios，**只在 `src/api` 内出现**，统一走 `request` 实例 |
| 样式 | SCSS + CSS 变量，组件默认 `<style scoped lang="scss">` |
| 包管理 | 以仓库已有 lockfile 为准；无 lockfile 时使用 npm |
| Node | >= 20.19 |
| 提交规范 | Conventional Commits（commitlint 校验） |

命令入口（不得擅自新增含义相同的脚本）：

```bash
npm run dev          # 本地开发
npm run lint         # ESLint（--max-warnings 0）
npm run lint:style   # Stylelint
npm run format       # Prettier 写入
npm run check        # lint + lint:style + format:check
```

---

## 2. 绝对红线（R）

违反任意一条即为不合格交付，必须停下来说明原因，而不是绕过。

| 编号 | 红线 |
| --- | --- |
| R1 | 禁止引入 `package.json` 之外的新依赖。确需引入时，先说明必要性、体积与替代方案，得到用户确认后再改 `package.json`。 |
| R2 | 禁止为了让检查通过而修改 `eslint.config.js`、`jsconfig.json`、`vite.config.js`、`stylelint.config.js`、`.prettierrc.json`、`commitlint.config.js`；禁止新增 `eslint-disable` / `@ts-ignore` / `// @ts-nocheck` 掩盖错误。 |
| R3 | 禁止删除、重命名、改写公共模块（`src/components`、`src/utils`、`src/api`、`src/stores`、`src/router`）的既有导出，除非已全仓检索调用方并在同一变更中同步修改。 |
| R4 | 禁止在组件 / 页面中用 `axios`、`fetch`、`XMLHttpRequest` 直接发请求；一律经 `src/api`。 |
| R5 | 禁止跨业务域深层引用：`src/views/<a>/...` 不得 import `src/views/<b>/...` 的内部文件；公共能力必须下沉到公共目录。 |
| R6 | 禁止在模板中写业务逻辑（多行表达式、链式判断、赋值、`v-for` 里做过滤+排序+格式化）。数据在 `computed` 中准备好。 |
| R7 | 禁止硬编码颜色、字号、圆角、z-index、间距数值；必须使用 `src/styles` 中的 CSS 变量或 SCSS mixin。唯一例外：`0`、`100%`、`1px` 边框。 |
| R8 | 禁止 `console.log`、`debugger`、被注释掉的旧代码、TODO 占位实现进入提交。需要日志用 `src/utils/logger.js`。 |
| R9 | 禁止直接修改 `dist/`、`node_modules/`、构建产物、自动生成文件、lockfile 手工编辑。 |
| R10 | 禁止“顺手重构”：一次任务只改与目标相关的文件。发现无关问题，写在交付说明里，不擅自改。 |
| R11 | 禁止一个 `.vue` 文件里定义多个组件（极小的私有子组件也需独立文件）；禁止组件名与文件名不一致。 |
| R12 | 禁止提交未经 `npm run check` 验证的代码；无法通过时必须如实说明失败项与原因。 |

---

## 3. 必须遵守（M）

| 编号 | 要求 |
| --- | --- |
| M1 | 改代码前必须先读：目标文件、其直接调用方、相关 JSDoc 类型与规则文件。**没读过就不许改**。 |
| M2 | 新增文件前先检索是否已有同类实现（`composables`、`utils`、`components`、`api`），能复用则复用。 |
| M3 | 单个文件超过 300 行、单函数超过 50 行，必须拆分或说明理由。 |
| M4 | 所有对外函数、组合式函数、Store action、API 函数必须有 JSDoc 入参/返回注释。 |
| M5 | 所有用户可见状态必须覆盖三态：loading / empty / error；异步操作必须有失败分支与用户可感知反馈。 |
| M6 | 组件通信优先级：props / emits > `v-model` > provide/inject > Pinia。禁止用 Pinia 传父子临时状态。 |
| M7 | 路由页面组件命名 `XxxView.vue`，放 `src/views/<domain>/`；路由懒加载必须写 `() => import(...)`。 |
| M8 | 所有环境变量必须以 `VITE_` 开头、在 `.env.example` 中登记，并通过 `src/config/env.js` 读取，禁止散落 `import.meta.env`。 |
| M9 | 修改 API 或数据结构时，先改 `src/types/*.types.js` 中的 JSDoc typedef，再改实现，再改调用方。 |
| M10 | 新增依赖、目录、公共组件、公共工具时，同步更新 `docs/standards` 对应章节与本文档「目录速查」。 |
| M11 | 命名、目录、样式、注释一律遵循 `docs/standards/02-directory-and-naming.md`，不得自创风格。 |
| M12 | 交付说明必须包含：改了什么、为什么、影响范围、验证命令与结果、剩余风险。 |

---

## 4. 标准工作流（每次任务都要走）

1. **定位**：用 `Grep` / `Glob` 找到相关文件，读 `AGENTS.md` + 命中的 `.trae/rules/*`。
2. **确认**：需求含糊、涉及破坏性改动、涉及新依赖时，先提问对齐，不猜。
3. **计划**：列出将改动的文件清单与理由（≥3 个文件或多层改动时必须列）。
4. **最小实现**：按 M6 的通信优先级、M9 的类型先行顺序落地；不新增无关抽象。
5. **自检**：执行 `npm run check`；再按第 6 节清单逐项核对。
6. **汇报**：按 M12 输出结论，不夸大完成度。

---

## 5. 标准代码模板

### 5.1 页面组件

```vue
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useLoading } from '@/composables/useLoading'

const props = defineProps({
  userId: { type: String, required: true },
})
const emit = defineEmits(['refresh'])

const items = ref([])
const error = ref(null)
const { loading, run } = useLoading()

const isEmpty = computed(() => !loading.value && !error.value && items.value.length === 0)

async function loadData() {
  error.value = null
  try {
    items.value = await run(() => useUserStore().loadList({ page: 1, pageSize: 20 }))
    emit('refresh', props.userId)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  }
}

onMounted(loadData)
</script>

<template>
  <section class="user-panel">
    <BaseSkeleton v-if="loading" :rows="3" />
    <BaseError v-else-if="error" :message="error" @retry="loadData" />
    <BaseEmpty v-else-if="isEmpty" description="暂无数据" />
    <ul v-else class="user-panel__list">
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.user-panel {
  padding: var(--space-4);

  &__list {
    margin: 0;
    list-style: none;
  }
}
</style>
```

### 5.2 组合式函数

```js
// src/composables/useLoading.js
import { ref } from 'vue'

/**
 * 异步 loading 包装
 * @param {boolean} [initial=false] 初始状态
 * @returns {{ loading: import('vue').Ref<boolean>, run: (task: () => Promise<*>) => Promise<*> }}
 */
export function useLoading(initial = false) {
  const loading = ref(initial)

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
```

### 5.3 Store

```js
// src/stores/user.store.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserList } from '@/api/user'

/** @typedef {import('@/types/user.types').UserItem} UserItem */
/** @typedef {import('@/types/user.types').UserQuery} UserQuery */

export const useUserStore = defineStore('user', () => {
  /** @type {import('vue').Ref<UserItem[]>} */
  const list = ref([])
  const loading = ref(false)

  /**
   * @param {UserQuery} query 查询条件
   * @returns {Promise<UserItem[]>} 用户列表
   */
  async function loadList(query) {
    loading.value = true
    try {
      list.value = await fetchUserList(query).then((result) => result.list)
      return list.value
    } finally {
      loading.value = false
    }
  }

  return { list, loading, loadList }
})
```

---

## 6. 交付前自检清单

- [ ] 已阅读目标文件与调用方，改动范围最小（R10）
- [ ] 无新增依赖，或已获确认（R1）
- [ ] 无 `eslint-disable` / `@ts-ignore` / `@ts-nocheck` 逃逸（R2）
- [ ] 请求只在 `src/api`（R4）；无跨域深层引用（R5）
- [ ] 模板无业务逻辑（R6）；样式无硬编码（R7）
- [ ] 无 `console.log` / 死代码（R8）
- [ ] loading / empty / error 三态齐全（M5）
- [ ] JSDoc 类型注释齐全，无隐式全局变量（M4、M9）
- [ ] `npm run check` 全绿（R12）
- [ ] 提交信息符合 Conventional Commits（见 `docs/standards/07-git-and-quality.md`）

---

## 7. 目录速查

```text
src/
├── api/          # 接口函数，按业务域单文件，只在这里出现 axios
├── assets/       # 参与构建的静态资源
├── components/   # 全局通用组件（Base 前缀）与业务公共组件
├── composables/  # useXxx 组合式函数
├── config/       # env.js 等运行时配置
├── constants/    # 枚举、常量
├── directives/   # 自定义指令
├── layouts/      # 布局组件
├── router/       # 路由表与守卫
├── stores/       # Pinia，文件名 *.store.js
├── styles/       # 变量、mixin、全局样式
├── types/        # JSDoc typedef，文件名 *.types.js
├── utils/        # 纯函数工具
├── views/        # 路由页面，XxxView.vue
├── App.vue
└── main.js
```

更多细节见 [docs/standards/README.md](docs/standards/README.md)。

## 8. 规则索引

| 规则文件 | 作用域 | 何时生效 |
| --- | --- | --- |
| `.trae/rules/00-core-redlines.md` | 全仓库 | 始终 |
| `.trae/rules/10-architecture.md` | `src/**` | 新增/移动文件时 |
| `.trae/rules/20-vue-components.md` | `src/**/*.vue` | 编辑组件时 |
| `.trae/rules/30-state-and-api.md` | `src/{api,stores,composables,types}/**` | 数据层改动时 |
| `.trae/rules/40-styles.md` | `src/**/*.{vue,scss,css}` | 样式改动时 |
| `.trae/rules/50-javascript.md` | `src/**/*.{js,vue}` | JS 语法与 JSDoc 改动时 |
| `.trae/rules/60-git-quality.md` | 全仓库 | 提交前 |
