# 06 JavaScript 规范

## 1. 基本要求

- 统一 ESM（`import` / `export`），禁止 `require` / `module.exports`。
- 禁止 `var`，只用 `const`；需要重新赋值时用 `let`。
- 必须 `===` / `!==`，禁止 `==` / `!=`（除 `value == null` 这一处例外）。
- 禁止隐式全局变量；未声明的变量不得赋值。
- 禁止在 `.js` / `.vue` 中写 TypeScript 语法（类型注解、`interface`、`enum`、`as`）。
- 禁止 `eval`、`new Function`、修改内置原型。

## 2. JSDoc 类型表达

JS 项目用 JSDoc 承担类型说明，必须与代码同步维护。

### 2.1 位置

| 类型 | 位置 |
| --- | --- |
| 通用（分页、响应包装） | `src/types/common.types.js` |
| 业务实体 / 查询 / 响应 | `src/types/<domain>.types.js` |
| 组件 props / emits | 组件内部 JSDoc 注释 |

`src/types/*.types.js` 只写 `@typedef` 注释与 `export {}`，不写业务运行时代码。

### 2.2 写法

```js
// src/types/user.types.js
/**
 * 用户状态
 * @typedef {'active' | 'disabled'} UserStatus
 */

/**
 * 用户列表项
 * @typedef {object} UserItem
 * @property {string} id 用户 ID
 * @property {string} name 姓名
 * @property {string | null} email 邮箱
 * @property {UserStatus} status 状态
 * @property {string} createdAt 创建时间
 */

export {}
```

- 对象结构用 `@typedef {object}` + `@property`。
- 可选属性用 `[keyword]`，可能为空用 `{string | null}`，两者语义不同不得混用。
- 联合类型直接用 JSDoc 字面量联合，禁止用 `enum`。
- 引用其他文件类型：`@typedef {import('@/types/user.types').UserItem} UserItem`。

## 3. 函数

- 公共函数、api、store action、composable **必须**写 `@param` 与 `@returns`。
- 组件内部短函数可省略返回注释，但参数含义要清楚。
- 参数超过 3 个必须改为对象参数。

```js
// ❌
export function loadUser(id, withDetail) { ... }

// ✅
/**
 * 加载用户
 * @param {{ id: string, withDetail?: boolean }} options 查询参数
 * @returns {Promise<import('@/types/user.types').UserItem>} 用户信息
 */
export function loadUser(options) { ... }
```

## 4. 异步与错误

```js
/**
 * 提取错误信息
 * @param {unknown} error 捕获到的错误
 * @returns {string} 可读信息
 */
function getMessage(error) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return '未知错误'
}
```

- 禁止 `catch (e) { e.message }` 直接访问。
- 禁止 `catch {}` 静默吞错；必须有反馈或日志。
- 异步函数必须 `try/catch/finally`，`finally` 复位 loading。

## 5. 对象与数组

- 对象字面量使用简写与尾逗号（交给 Prettier）。
- 解构赋值避免多层链式取值；深层取值前先判空。
- 禁止在 `sort` 中依赖隐式转换，比较函数必须返回数字。
- 禁止直接修改函数参数对象；需要时先浅拷贝。

## 6. Vue 中的 JS

```js
// props 用运行时声明 + JSDoc 描述复杂结构
const props = defineProps({
  /** @type {import('vue').PropType<import('@/types/user.types').UserItem[]>} */
  items: { type: Array, required: true },
  size: { type: String, default: 'md' },
})

// emits 用数组声明
const emit = defineEmits(['change'])

// 模板 ref 初值为 null
const tableRef = ref(null)
```

- 禁止对 `props` 重新赋值。
- `ref` 必须有初始值；`reactive` 仅用于固定结构对象。
- 禁止用 `$refs` 链式访问子组件内部状态。

## 7. 禁止清单

| 禁止 | 替代 |
| --- | --- |
| `var` | `const` / `let` |
| `==` / `!=` | `===` / `!==` |
| 隐式全局变量 | 显式声明 + 模块导入 |
| `eval` / `new Function` | 正常函数调用 |
| `// @ts-ignore` / `@ts-nocheck` | 修正 JSDoc 或代码 |
| `eslint-disable` | 修正代码或规则评审 |
| 修改内置原型 | 工具函数 |
| 无 `@param` 的公共函数 | 补 JSDoc |

## 8. 评审检查项

- [ ] 无 `var`、无 `==`、无隐式全局
- [ ] 公共函数有 JSDoc 入参/返回
- [ ] JSDoc typedef 放对位置，与实现同步
- [ ] 无 `eslint-disable` / `@ts-ignore`
- [ ] `npm run check` 通过
