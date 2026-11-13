# 03 Vue 组件规范

## 1. SFC 结构

固定顺序，不得混排：

```vue
<script setup>
// 1. 依赖导入
import { computed, onMounted, ref } from 'vue'
import BaseTable from '@/components/base/BaseTable.vue'

// 2. props / emits / slots / model（运行时声明）
const props = defineProps({
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['select'])

// 3. 响应式状态
const keyword = ref('')

// 4. computed
const filtered = computed(() => props.items.filter((item) => item.name.includes(keyword.value)))

// 5. 方法
function handleSelect(id) {
  emit('select', id)
}

// 6. 生命周期
onMounted(() => {
  // 初始化
})
</script>

<template>
  <!-- 单一根节点，class 使用 BEM -->
</template>

<style scoped lang="scss">
/* 只写本组件样式 */
</style>
```

规则：

- 必须 `<script setup>`，禁止 Options API、`defineComponent({ setup })` 混写。
- `<style>` 必须 `scoped`；需要覆盖子组件样式时用 `:deep()`，并注释原因。
- 单文件 ≤ 300 行，模板嵌套 ≤ 5 层。
- 禁止在 SFC 中定义多个组件。

## 2. props

- JS 项目使用**运行时对象声明**，禁止写 TS 泛型语法。

```js
// ✅
const props = defineProps({
  size: { type: String, default: 'md', validator: (value) => ['sm', 'md', 'lg'].includes(value) },
  disabled: { type: Boolean, default: false },
})
```

- 复杂对象用 `Object` / `Array` 声明时，必须在上方用 JSDoc 描述结构。

```js
/**
 * @typedef {import('@/types/user.types').UserItem} UserItem
 */

defineProps({
  /** @type {import('vue').PropType<UserItem[]>} */
  items: { type: Array, required: true },
})
```

- props 只读，禁止修改；需要派生数据用 `computed`。
- 必填项必须 `required: true`；可选项必须有默认值或在使用处判空。

## 3. emits

```js
// ✅ 数组声明，事件名用 camelCase
const emit = defineEmits(['change', 'update:modelValue'])
```

- 禁止未声明就 `emit`；禁止把整个事件对象透传给父组件。
- 双向绑定统一 `v-model` / `defineModel`。
- 事件参数较多时，在 emit 处用 JSDoc 说明载荷结构。

## 4. 模板

- 禁止业务逻辑：多行表达式、函数调用做数据加工、`v-if` 中链式判断超过 2 个条件。
- 条件分支超过 3 个且带 UI 差异时，拆子组件或使用映射表。
- `v-for` 必须有稳定 `:key`，禁止用 index（除非列表纯静态且不重排）。
- `v-if` 与 `v-for` 禁止同节点。
- 禁止在模板里写 `console`、赋值、`new`。

```vue
<!-- ❌ -->
<li v-for="(item, index) in list.filter(i => i.status === 1).sort((a,b) => b.id - a.id)" :key="index">

<!-- ✅ -->
<li v-for="item in activeSortedList" :key="item.id">
```

## 5. 组件通信优先级

1. props / emits（父子直连）
2. `v-model`（表单类双向）
3. provide / inject（跨层级主题、配置）
4. Pinia（跨页面共享的业务状态）

禁止：用 Pinia 传递父子临时状态；用 EventBus；用 `$parent` / `$refs` 链式访问。

## 6. 异步与三态

所有异步组件必须处理 loading / empty / error：

```vue
<template>
  <BaseSkeleton v-if="loading" />
  <BaseError v-else-if="error" :message="error" @retry="load" />
  <BaseEmpty v-else-if="!list.length" />
  <UserTable v-else :list="list" />
</template>
```

- 异步方法必须 `try/catch/finally`，`finally` 复位 loading。
- 组件卸载后不得再更新状态：需要时使用 `AbortController` 或 `onScopeDispose`。
- 定时器、监听器、订阅必须在 `onUnmounted` / `onScopeDispose` 清理。

## 7. 性能

- 大列表（> 200 条）必须虚拟滚动或分页。
- 重组件用 `defineAsyncComponent` 懒加载。
- 避免在 `computed` 中产生副作用；避免在 `watch` 中写可被 `computed` 表达的逻辑。
- `v-memo` / `shallowRef` 仅在实测有性能问题时使用，并注释原因。

## 8. 可访问性与语义化

- 可点击元素用 `button` / `a`，禁止 `div @click` 且无 `role`、`tabindex`、键盘事件。
- 图片必须有 `alt`；表单控件必须有关联 `label`。
- 颜色不得作为唯一状态表达。

## 9. 组件评审检查项

- [ ] 命名与文件名一致，且 ≥ 2 个单词（`Base*` 除外）
- [ ] props / emits 为运行时声明，复杂结构有 JSDoc
- [ ] 无模板业务逻辑，无 index key
- [ ] 三态齐全，异常有反馈
- [ ] 无内存泄漏（监听、定时器已清理）
- [ ] 样式 scoped，类名遵循 BEM
