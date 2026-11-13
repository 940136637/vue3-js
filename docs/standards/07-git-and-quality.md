# 07 Git 与质量门禁

## 1. 分支模型

| 分支 | 用途 | 来源 | 合并去向 |
| --- | --- | --- | --- |
| `main` | 生产分支，始终可发布 | — | — |
| `develop` | 集成分支（如采用） | `main` | `main` |
| `feature/<scope>-<desc>` | 功能开发 | `develop` / `main` | `develop` |
| `fix/<scope>-<desc>` | 缺陷修复 | `develop` / `main` | `develop` / `main` |
| `hotfix/<desc>` | 线上紧急修复 | `main` | `main` + `develop` |
| `refactor/<scope>` | 重构 | `develop` | `develop` |

- 分支名全小写 kebab-case，禁止中文、空格、`_`。
- 一个分支只做一件事，生命周期 ≤ 2 周。
- 禁止直接向 `main` / `develop` 推送，必须走 MR/PR。

## 2. 提交信息（Conventional Commits）

```text
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

| type | 含义 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 缺陷修复 |
| `refactor` | 重构（不改行为） |
| `perf` | 性能优化 |
| `style` | 格式调整（不影响逻辑） |
| `docs` | 文档 |
| `test` | 测试 |
| `build` | 构建/依赖 |
| `ci` | CI 配置 |
| `chore` | 杂项 |
| `revert` | 回滚 |

规则：

- `subject` 用中文或英文均可，≤ 50 字，不以句号结尾。
- `scope` 使用业务域或模块名：`user`、`order`、`table`、`router`。
- 一次提交只做一类改动；禁止「顺手改」混入。
- ❌ `update`、`fix bug`、`提交`、`111`。

示例：

```text
feat(user): 新增用户列表分页与筛选
fix(api): 修正 token 过期后未刷新导致的 401 循环
docs(standards): 补充样式变量使用约束
```

## 3. 提交前门禁

husky 钩子：

| 钩子 | 执行内容 |
| --- | --- |
| `pre-commit` | `lint-staged`：ESLint --fix、Stylelint --fix、Prettier --write |
| `commit-msg` | `commitlint` 校验提交信息 |

必须满足：

- [ ] `npm run check` 全绿
- [ ] 无调试代码、无临时注释、无未使用变量
- [ ] 改动文件与提交信息描述一致
- [ ] 无密钥、`.env`、本地配置误提交

跳过钩子的命令（`--no-verify`）**禁止**使用；钩子报错必须修代码，不是关钩子。

## 4. MR / PR 要求

标题格式同提交信息。描述必须包含：

```markdown
## 变更内容
- 一句话说明做了什么

## 变更原因
- 关联需求/缺陷/技术债

## 影响范围
- 涉及页面、公共组件、接口、数据结构

## 验证方式
- [ ] npm run check
- [ ] 手动验证路径：xxx → xxx

## 风险与回滚
- 潜在风险：
- 回滚方式：revert 本 MR
```

评审规则：

- 至少 1 人 approve；涉及公共模块、路由、构建配置需 2 人。
- 评审关注：红线违规、边界与空态、JSDoc 准确性、可读性，而非个人风格。
- 单次 MR 变更 ≤ 400 行（不含自动生成文件与格式化），超出必须拆分。

## 5. 质量门禁矩阵

| 阶段 | 执行 | 失败后果 |
| --- | --- | --- |
| 编辑器 | ESLint / Prettier 提示 | 提示，不阻塞 |
| pre-commit | lint-staged | 阻塞提交 |
| commit-msg | commitlint | 阻塞提交 |
| 本地自检 | `npm run check` | 阻塞交付 |
| CI | `npm run check` + `build` | 阻塞合并 |
| 发布 | 构建产物 + 冒烟用例 | 阻塞发布 |

CI 与本地必须使用同一套命令，禁止 CI 单独放宽规则。

## 6. 版本与发布（如有）

- 遵循 SemVer；`feat` → minor，`fix` → patch，破坏性变更 → major + `BREAKING CHANGE` footer。
- 发布标签：`v1.2.3`，标签信息与 CHANGELOG 一致。
- 发布前必须确认 `main` 与标签一致。
