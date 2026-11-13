# 05 样式与 UI 规范

## 1. 组织方式

```text
src/styles/
├── variables.scss   # 设计变量（颜色、间距、字号、圆角、阴影、层级）
├── mixins.scss      # 复用 mixin
├── reset.scss       # 重置样式
├── global.scss      # 全局基础样式
└── index.scss       # 统一入口，main.js 引入
```

- 组件内只用 `scoped` 样式。
- 全局样式仅限：重置、字体、body 背景、基础滚动条、过渡动画类。

## 2. 设计变量（唯一来源）

```scss
// src/styles/variables.scss
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  --color-danger: #dc2626;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;

  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;

  --radius-sm: 4px;
  --radius-md: 8px;

  --duration-fast: 150ms;
  --duration-base: 250ms;

  --z-dropdown: 1000;
  --z-modal: 2000;
  --z-toast: 3000;
}
```

规则：

- 颜色、间距、字号、圆角、阴影、`z-index` **必须**使用变量。
- 新增变量必须在 `variables.scss` 中集中声明并注释用途，禁止在组件里 `--xxx` 就地定义全局语义变量。
- 唯一允许的裸值：`0`、`100%`、`auto`、`1px`（边框）、`translate` 中的 `50%`。

❌ 禁止：

```scss
.card {
  color: #333;
  padding: 13px;
  z-index: 9999;
}
```

## 3. 命名

- 使用 BEM：`.block__element--modifier`。
- 组件根类名 = 组件名 kebab-case：`UserCard.vue` → `.user-card`。
- 禁止层级嵌套超过 3 层（SCSS `&` 嵌套同理）。
- 禁止用标签选择器做业务样式（`div { ... }`）。
- 禁止 `!important`，唯一例外：覆盖第三方库内联样式，且必须注释原因。

```vue
<style scoped lang="scss">
.user-card {
  display: flex;
  padding: var(--space-4);

  &__title {
    font-size: var(--font-size-lg);
  }

  &--disabled {
    opacity: 0.6;
  }
}
</style>
```

## 4. 覆盖组件库

- 优先使用组件库提供的 props / 主题变量。
- 必须覆盖时，用 `:deep()` 限定在组件根类下，并注释原因：

```scss
.order-table {
  :deep(.el-table__header th) {
    /* 设计稿要求表头底色与全局主题不同 */
    background: var(--color-bg-subtle);
  }
}
```

- 禁止在全局样式中写组件库类名覆盖。

## 5. 单位与响应式

- 尺寸单位：布局用 `px`，字体用 `px`；不用 `rem` 混搭（除非项目启用 rem 适配方案并统一）。
- 断点统一在 `variables.scss` 定义：`$bp-sm: 640px; $bp-md: 768px; $bp-lg: 1024px; $bp-xl: 1280px;`。
- 移动端适配必须使用统一方案（vw 适配或媒体查询），不得每个组件各写一套。
- 禁止用 JS 读取 `window.innerWidth` 做样式判断，优先 CSS 媒体查询。

## 6. 主题与暗色模式

- 颜色必须通过变量使用，禁止在组件中判断主题后写死颜色。
- 暗色模式通过 `html.dark` 覆盖变量实现：

```scss
html.dark {
  --color-bg: #111827;
  --color-text: #f9fafb;
  --color-border: #374151;
}
```

- 新增颜色变量必须同时提供亮/暗两套值。

## 7. 动画

- 过渡时长统一 `--duration-fast: 150ms`、`--duration-base: 250ms`。
- 必须尊重系统偏好：

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 8. 可维护性

- 单个 `<style>` 块 ≤ 150 行，超出拆子组件。
- 禁止遗留无用样式、注释掉的大段 CSS。
- 颜色对比度满足 WCAG AA（正文 ≥ 4.5:1）。

## 9. 评审检查项

- [ ] 无硬编码颜色/间距/字号/z-index
- [ ] BEM 命名，嵌套 ≤ 3 层，无 `!important`
- [ ] `scoped` 开启，`:deep` 有注释
- [ ] 新增变量已入 `variables.scss` 且含暗色值
- [ ] 响应式使用统一断点
- [ ] Stylelint 通过
