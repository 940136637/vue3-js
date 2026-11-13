---
description: Vue 单文件组件写法、props/emits、模板与异步三态约束
globs: src/**/*.vue
alwaysApply: false
---

# Vue 组件

## SFC 结构

顺序固定：`<script setup>` → `<template>` → `<style scoped lang="scss">`。

script 内部顺序：依赖导入 → props/emits/model → 响应式状态 → computed → 方法 → 生命周期。

- 只允许 `<script setup>` + Composition API。
- 禁止 Options API、`mixins`、`defineComponent({ setup })` 混写。
- 禁止 `<script lang="ts">` 或任何 TS 类型语法。
- 单文件 ≤ 300 行，模板嵌套 ≤ 5 层，一个文件只定义一个组件。

## props / emits

```js
const props = defineProps({
  /** @type {import('vue').PropType<import('@/types/user.types').UserItem[]>} */
  items: { type: Array, required: true },
  size: { type: String, default: 'md' },
})
const emit = defineEmits(['change'])
```

- props 必须运行时声明；复杂对象/数组用 JSDoc 描述结构。
- props 只读，派生数据用 `computed`。
- 禁止未声明的 `emit`；双向绑定用 `v-model` / `defineModel`。

## 模板

- 禁止业务逻辑：多行表达式、就地 `filter/sort/format`、复杂链式判断。
- `v-for` 必须有稳定 `:key`（禁止 index），禁止与 `v-if` 同节点。
- 条件分支 > 3 且 UI 差异明显时拆子组件或使用映射表。
- 可点击元素用 `button` / `a`，图片有 `alt`。

## 异步

必须三态齐全：

```vue
<BaseSkeleton v-if="loading" />
<BaseError v-else-if="error" :message="error" @retry="load" />
<BaseEmpty v-else-if="!list.length" />
<UserTable v-else :list="list" />
```

- 异步方法必须 `try/catch/finally`，`finally` 复位 loading。
- 定时器、事件监听、订阅必须在 `onUnmounted` / `onScopeDispose` 清理。
- 组件卸载后不得再写状态（必要时用 `AbortController`）。

## 通信优先级

props/emits > `v-model` > provide/inject > Pinia。禁止 EventBus、`$parent` 链式访问、用 Pinia 传父子临时状态。
