# 01 项目初始化与技术栈

## 1. 技术栈基线

| 类别 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Vue 3.5+ | 只用 Composition API + `<script setup>` |
| 构建 | Vite 6+ | 不引入 webpack 配置 |
| 语言 | JavaScript ES2022+ | ESM 模块，禁止 TS 语法 |
| 类型表达 | JSDoc | `@typedef` / `@param` / `@returns`，不引入 TypeScript |
| 路由 | Vue Router 4 | history 模式 |
| 状态 | Pinia 2/3 | setup store 写法 |
| 请求 | axios | 单一实例 + 拦截器 |
| 样式 | SCSS + CSS 变量 | 不引入 CSS-in-JS |
| 图标/组件库 | 按项目定（Element Plus / Ant Design Vue） | 全项目只允许一个主组件库 |
| 测试 | Vitest + @vue/test-utils（可选） | 有测试则必须纳入 `check` |
| Lint | ESLint 9 flat config + Prettier + Stylelint 16 | 配置随仓库走 |

**禁止**：Vue 2 写法、Options API、`mixins`、`this.$xxx` 形式的全局挂载、多套 UI 库混用、在 `.js` / `.vue` 中写 TypeScript 类型语法。

## 2. 初始化方式

```bash
# 推荐：先官方脚手架生成骨架
npm create vue@latest my-app
# 勾选 JavaScript / Router / Pinia / ESLint / Prettier，不要勾 TypeScript

# 再用本仓库配置覆盖：eslint.config.js、.prettierrc.json、stylelint.config.js、
# jsconfig.json、commitlint.config.js、lint-staged.config.mjs、.husky/
npm install
npm run prepare   # 安装 git hooks
```

初始化后必须确认：

- [ ] `src/` 目录与本规范第 02 篇一致
- [ ] `vite.config.js` 配置了 `@` 别名指向 `src`
- [ ] `jsconfig.json` 的 `paths` 与 Vite 别名一致
- [ ] `npm run check` 可执行
- [ ] `.env.example` 已登记全部环境变量

## 3. 依赖治理

- 新增依赖前必须回答：现有依赖能否实现？体积多少？是否长期维护？
- 一个能力只允许一套实现（如日期处理固定用 `dayjs`，不得再引 `moment`）。
- 禁止引入会全局污染原型的库。
- 依赖版本统一写 `package.json`，禁止在代码里 CDN 引脚本。
- **必须锁定**：由 lockfile 保证；禁止手工编辑 lockfile。

### 依赖分层

```text
dependencies       运行时必需：vue / vue-router / pinia / axios
devDependencies    构建与质量：vite / eslint / prettier / stylelint / husky
```

## 4. 脚本约定

| 脚本 | 用途 | 是否可省略 |
| --- | --- | --- |
| `dev` | 本地开发 | 否 |
| `build` | 构建 | 否 |
| `preview` | 预览产物 | 否 |
| `lint` / `lint:fix` | ESLint | 否 |
| `lint:style` / `lint:style:fix` | Stylelint | 否 |
| `format` / `format:check` | Prettier | 否 |
| `check` | 本地全量门禁 | 否 |

- 新增脚本必须在此登记，且命名不得与上表语义重叠。
- JS 项目没有 `typecheck` 脚本，类型靠 JSDoc 约定与评审保证，不得伪造同名脚本。

## 5. 环境变量

只在 `.env.development`、`.env.production` 等文件中声明，且必须满足：

1. 前缀统一 `VITE_`；
2. 在 `.env.example` 中登记并写注释；
3. 统一通过 `src/config/env.js` 读取并做校验；
4. **禁止**在 `.env*` 中存放密钥、token、私钥（前端产物会暴露）。

```js
// src/config/env.js
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!rawBaseUrl) {
  throw new Error('缺少环境变量 VITE_API_BASE_URL，请参考 .env.example 配置')
}

/** @type {{ apiBaseUrl: string, appTitle: string, enableMock: boolean }} */
export const env = {
  apiBaseUrl: rawBaseUrl,
  appTitle: import.meta.env.VITE_APP_TITLE ?? 'Vue App',
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
}
```

❌ 禁止：

```js
const url = import.meta.env.VITE_API_BASE_URL // 散落在组件中
```

## 6. Vite 基础配置要求

- `resolve.alias`：`@` → `src`，与 `jsconfig.json` 的 `paths` 保持一致。
- `server.proxy`：仅开发环境使用，生产走网关。
- `build.sourcemap`：生产默认关闭，按需开启。
- `define` 中不注入业务常量，业务常量放 `src/constants`。
