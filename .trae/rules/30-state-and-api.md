---
description: Pinia 状态、请求分层、错误处理与 JSDoc 类型流转约束
globs: src/{api,stores,composables,types}/**
alwaysApply: false
---

# 状态与数据请求

## 调用链（不可跳层）

```text
组件 → store / composable → src/api/<domain>.js → src/api/request.js
```

## API 层

- `src/api` 是**唯一**允许 `import axios` 的地方。
- 组件禁止直接 import `src/api/request.js`。
- 函数命名：`fetchXxx / createXxx / updateXxx / deleteXxx`。
- 必须有 JSDoc 入参与返回注释；返回业务数据，不返回 axios 响应对象。
- 禁止在 api 层做 loading、UI 提示、路由跳转、状态写入。
- 后端字段与前端不一致时在 api 层转换。

```js
/**
 * 查询用户列表
 * @param {UserQuery} params 查询条件
 * @returns {Promise<PageResult<UserItem>>} 分页结果
 */
export function fetchUserList(params) {
  return request.get('/users', { params }).then((response) => response.data)
}
```

## Store

- 统一 setup store，文件名 `xxx.store.js`，id 与文件名一致。
- 禁止在 store 内直接发请求、操作 DOM、调用 `ElMessage` 等提示。
- 禁止保存组件实例、ref、路由对象。
- 组件只能通过 action 改状态，禁止 `store.list = []` 直接赋值。
- 异步 action 维护自身 loading，有 JSDoc 返回注释；并发需防竞态。
- 登出 / 切换租户必须 `reset()`。

## 状态归属

- 组件内部 UI 状态 → 组件 `ref`。
- 父子共享 → props/emits/`v-model`。
- 跨层级配置 → provide/inject。
- 跨页面业务状态 → Pinia。

## 错误处理

- api 层：归一化为 `Error` + 可读 message。
- store/composable：捕获记录，不弹窗。
- 页面层：负责提示与跳转。
- 禁止 `catch {}` 静默吞错。

## 类型流转（JSDoc）

`src/types/*.types.js`（@typedef）→ `src/api` → store/composable → 组件。改数据结构时按此顺序改。
