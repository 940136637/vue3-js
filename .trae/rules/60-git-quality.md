---
description: 提交信息、门禁与交付说明约束，提交或汇报前适用
alwaysApply: true
---

# Git 与交付质量

## 提交信息

格式：`<type>(<scope>): <subject>`

type 仅限：`feat` `fix` `refactor` `perf` `style` `docs` `test` `build` `ci` `chore` `revert`。

- subject ≤ 50 字，不以句号结尾。
- scope 用业务域名：`user` `order` `table` `router` `api`。
- 一次提交只做一类改动。
- 禁止 `update`、`fix bug`、`提交`、`111`。

## 门禁

提交前必须：

```bash
npm run check   # eslint + stylelint + prettier check
```

- husky 的 `pre-commit`（lint-staged）与 `commit-msg`（commitlint）不得跳过。
- 禁止 `git commit --no-verify`。
- 钩子报错必须修代码或修描述，不得改配置绕过。

## 禁止提交

- `.env*`、密钥、token、本地个人配置。
- `console.log` / `debugger` / 注释代码 / TODO 占位。
- 与提交信息无关的「顺手改动」。
- `dist/`、构建产物、`node_modules/`。

## 交付说明必须包含

1. 改了什么（文件级）
2. 为什么改
3. 影响范围（页面/公共模块/接口/数据结构）
4. 验证命令与结果
5. 剩余风险与回滚方式

不得在未执行检查的情况下声称「已完成」「已通过」。
