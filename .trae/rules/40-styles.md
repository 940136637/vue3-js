---
description: 样式、设计变量、BEM 与响应式约束
globs: src/**/*.{vue,scss,css}
alwaysApply: false
---

# 样式

## 变量唯一来源

全部设计变量在 `src/styles/variables.scss` 的 `:root` 中声明。

- 颜色、间距、字号、圆角、阴影、`z-index` 必须用变量。
- 唯一允许裸值：`0`、`100%`、`auto`、`1px`（边框）。
- 新增变量必须集中声明 + 注释用途，并同时提供亮/暗两套值。

```scss
:root {
  --color-primary: #2563eb;
  --space-4: 16px;
  --radius-md: 8px;
  --z-modal: 2000;
}
```

## 命名

- BEM：`.block__element--modifier`。
- 组件根类名 = 组件名 kebab-case（`UserCard.vue` → `.user-card`）。
- 嵌套 ≤ 3 层；禁止标签选择器做业务样式。
- 禁止 `!important`（覆盖第三方内联样式时需注释原因）。

## scoped

- `<style scoped lang="scss">` 必须开启。
- 覆盖子组件 / 组件库用 `:deep()` 并限定在根类下，注释原因。
- 禁止在全局样式中写第三方组件类名覆盖。

## 响应式

- 断点统一：`640 / 768 / 1024 / 1280`，变量在 `variables.scss`。
- 禁止用 JS 读 `window.innerWidth` 做布局判断。
- 移动端适配方案全项目统一，不得逐组件自定。

## 其他

- 单个 `<style>` ≤ 150 行。
- 过渡时长用 `--duration-fast: 150ms` / `--duration-base: 250ms`。
- 尊重 `prefers-reduced-motion`。
- 正文对比度 ≥ WCAG AA（4.5:1）。

## 禁止

- 硬编码 `#333`、`13px`、`z-index: 9999`。
- 遗留无用样式、注释掉的大段 CSS。
- 用 `!important` 抢优先级。
