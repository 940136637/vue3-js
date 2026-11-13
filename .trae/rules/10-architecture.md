---
description: 目录职责、模块边界与命名规范，新增或移动文件时适用
globs: src/**
alwaysApply: false
---

# 架构与命名

## 目录职责

```text
src/
├── api/          # 唯一允许 import axios 的目录，按业务域单文件
├── assets/       # 参与构建的资源
├── components/   # base/（Base 前缀，无业务）与 business/（有业务语义）
├── composables/  # useXxx 组合式函数
├── config/       # env.js 等运行时配置
├── constants/    # 常量、枚举
├── directives/   # 自定义指令
├── layouts/      # 布局
├── router/       # 路由与守卫
├── stores/       # Pinia，*.store.js
├── styles/       # variables / mixins / reset / index
├── types/        # JSDoc typedef，*.types.js
├── utils/        # 纯函数，无 Vue 依赖
└── views/        # 路由页面，XxxView.vue，按业务域分目录
```

## 依赖方向（只能向下）

```text
types ← utils/constants ← api ← stores ← composables ← components ← views
```

- 反向 import 视为架构违规。
- 跨业务域只能走 `index.js` 公开出口。
- 组件被 ≥ 3 个页面使用才上移 `components/`；只被单页使用就放该页 `components/`。

## 命名

| 类型 | 规则 | 示例 |
| --- | --- | --- |
| 目录 | kebab-case | `user-center/` |
| 页面 | PascalCase + `View` | `UserListView.vue` |
| 组件 | PascalCase，≥ 2 词 | `UserCard.vue`、`BaseTable.vue` |
| 组合式函数 | `use` + camelCase | `usePagination.js` |
| Store | kebab-case + `.store.js` | `user.store.js` |
| JSDoc 类型 | kebab-case + `.types.js` | `user.types.js` |
| 常量 | kebab-case + `.constant.js` | `order-status.constant.js` |
| 变量/函数 | camelCase，动词开头 | `fetchOrderList` |
| 布尔 | `is/has/can/should` 前缀 | `isLoading` |
| 常量值 | SCREAMING_SNAKE_CASE | `MAX_PAGE_SIZE` |
| 类 / typedef | PascalCase，无 `I` 前缀 | `UserItem` |
| CSS 类 | BEM | `.user-card__title--active` |

## 禁止

- `index.vue`（目录出口除外）、`test.vue`、`temp`、`data1`、拼音/中文命名。
- 新增目录不登记到 `docs/standards/02-directory-and-naming.md` 与 `AGENTS.md` 目录速查。
- 同职责重复实现（已有工具/组件又新建一个）。
- 在 `.js` / `.vue` 中写 TypeScript 类型语法，类型统一用 JSDoc。
