---
description: JavaScript 语法、JSDoc 类型表达与禁止写法
globs: src/**/*.{js,vue}
alwaysApply: false
---

# JavaScript

## 硬性要求

- 统一 ESM，禁止 `require` / `module.exports`。
- 只用 `const` / `let`，禁止 `var`；必须 `===` / `!==`。
- 禁止隐式全局变量；所有依赖显式 import。
- 禁止在 `.js` / `.vue` 中写 TypeScript 语法。
- 禁止 `eval`、`new Function`、修改内置原型。
- 禁止 `eslint-disable`、`@ts-ignore`、`@ts-nocheck`。

## JSDoc 类型

| 类型 | 位置 |
| --- | --- |
| 通用（分页、响应包装） | `src/types/common.types.js` |
| 业务实体 / 查询 / 响应 | `src/types/<domain>.types.js` |
| 组件 props / emits | 组件内部 JSDoc |

- `src/types/*.types.js` 只写 `@typedef` + `export {}`，不写运行时代码。
- 公共函数、api、store action、composable 必须有 `@param` / `@returns`。
- 可选属性 `[name]`，可能为空 `{string | null}`，两者不得混用。
- 跨文件引用：`@typedef {import('@/types/user.types').UserItem} UserItem`。

```js
/**
 * 加载用户
 * @param {{ id: string, withDetail?: boolean }} options 查询参数
 * @returns {Promise<import('@/types/user.types').UserItem>} 用户信息
 */
export function loadUser(options) { ... }
```

## 错误处理

```js
/**
 * @param {unknown} error
 * @returns {string}
 */
function getMessage(error) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return '未知错误'
}
```

禁止 `catch (e) { e.message }`，禁止 `catch {}` 静默吞错。

## Vue 中

```js
const props = defineProps({
  /** @type {import('vue').PropType<import('@/types/user.types').UserItem[]>} */
  items: { type: Array, required: true },
})
const emit = defineEmits(['change'])
const tableRef = ref(null)
```

- 禁止对 `props` 赋值。
- `ref` 必须有初始值。
- 事件名用 camelCase，模板监听用 kebab-case。
