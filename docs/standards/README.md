# Vue 3 + JavaScript 前端工程规范

本目录是团队规范正文。AI 约束摘要见根目录 [AGENTS.md](../../AGENTS.md)，机器可读规则见 [.trae/rules](../../.trae/rules)。

## 阅读顺序

| 文档 | 内容 | 适用对象 |
| --- | --- | --- |
| [01-project-setup.md](./01-project-setup.md) | 技术栈、初始化、依赖、脚本、环境变量 | 项目负责人、新人 |
| [02-directory-and-naming.md](./02-directory-and-naming.md) | 目录职责、命名规则、模块边界 | 所有人 |
| [03-vue-component.md](./03-vue-component.md) | SFC 结构、props/emits、插槽、渲染性能 | 前端开发 |
| [04-state-and-api.md](./04-state-and-api.md) | Pinia、请求层、错误处理、JSDoc 类型流转 | 前端开发 |
| [05-style-and-ui.md](./05-style-and-ui.md) | SCSS、BEM、CSS 变量、响应式、主题 | 前端开发、UI |
| [06-javascript.md](./06-javascript.md) | JSDoc 类型、禁止写法、常见模式 | 所有写 JS 的人 |
| [07-git-and-quality.md](./07-git-and-quality.md) | 分支、提交、评审、质量门禁 | 所有人 |
| [08-ai-workflow.md](./08-ai-workflow.md) | AI 任务流程、禁止行为、Prompt 约定 | 使用 AI 的人 |

## 三条铁律

1. **约定大于个性**：与本文冲突的个人偏好一律让步，改动规范需走评审。
2. **边界清晰**：页面、组件、数据、样式各层只做自己的事，跨层必须经公开出口。
3. **可验证**：任何规范都要能被 `npm run check`、评审清单或脚本兜住，否则只是口号。

## 规范如何落地

```bash
npm run check   # eslint + stylelint + prettier check
```

提交时 husky 会自动执行 `lint-staged` 与 `commitlint`；CI 必须执行同一套 `npm run check`。

## 修订流程

1. 提出变更动机（真实踩坑，而非猜测）。
2. 修改 `docs/standards` 正文 + 对应 `.trae/rules` + 配置三者，保持一致。
3. 评审通过后合入，并在提交信息中标注 `docs(standards): ...`。
