---
description: 全仓库核心红线，任何任务都必须遵守；违反即视为不可交付
alwaysApply: true
---

# 核心红线

## 必须

1. 动手前先读目标文件、直接调用方、相关 JSDoc 类型与规则文件。**没读过不许改。**
2. 先检索再新建：`composables` / `utils` / `components` / `api` 已有实现就复用。
3. 一次任务只做一件事，只改相关文件；无关问题写进交付说明，不擅自修。
4. 改动涉及 ≥ 3 个文件或跨层时，先列出文件清单与理由再动手。
5. 交付前执行 `npm run check`，如实汇报结果。

## 禁止

1. 引入 `package.json` 之外的新依赖（须先获用户确认）。
2. 修改 `eslint.config.js`、`jsconfig.json`、`vite.config.js`、`stylelint.config.js`、`.prettierrc.json`、`commitlint.config.js` 来让检查通过。
3. 使用 `eslint-disable`、`@ts-ignore`、`@ts-nocheck`、隐式全局变量掩盖错误。
4. 在 `.js` / `.vue` 中写 TypeScript 类型语法（类型注解、`interface`、`enum`、`as`）。
5. 删除或重命名公共模块的既有导出而未全仓同步调用方。
6. 在组件/页面中直接用 `axios`、`fetch`、`XMLHttpRequest`。
7. 跨业务域深层引用内部文件（`views/a` 引 `views/b/xxx.vue`）。
8. 在模板中写业务逻辑（多行表达式、链式判断、就地 filter/sort/format）。
9. 硬编码颜色、字号、圆角、间距、`z-index`（`0` / `100%` / `1px` 除外）。
10. 提交 `console.log`、`debugger`、注释掉的代码、TODO 占位实现。
11. 修改 `dist/`、`node_modules/`、构建产物、lockfile。
12. 一个 `.vue` 文件里定义多个组件。
13. 使用 `--no-verify` 跳过 git hooks。

## 冲突处理

- 用户当次明确指令 > 本规则 > `AGENTS.md` > `docs/standards`。
- 指令与本规则冲突时，指出冲突点并请求确认，不得静默绕过。
