# 02 目录结构与命名

## 1. 目录职责

```text
src/
├── api/            # 接口函数：每个业务域一个文件，唯一允许使用 axios 的地方
├── assets/         # 参与构建的资源（图片、字体），大文件放 public/
├── components/     # 跨页面复用组件
│   ├── base/       # 无业务语义的基础组件，统一 Base 前缀
│   └── business/   # 有业务语义的公共组件
├── composables/    # 组合式函数，统一 use 前缀
├── config/         # 运行时配置（env.js）
├── constants/      # 常量与枚举
├── directives/     # 自定义指令
├── layouts/        # 布局骨架
├── router/         # 路由表、守卫、路由元信息
├── stores/         # Pinia store
├── styles/         # 变量、mixin、重置样式
├── types/          # JSDoc typedef，仅注释无运行时代码
├── utils/          # 纯函数（无 Vue 依赖）
├── views/          # 路由页面，按业务域分目录
├── App.vue
└── main.js
```

### 分层规则

| 目录 | 可以依赖 | 禁止依赖 |
| --- | --- | --- |
| `types` | 无 | 所有其他目录 |
| `utils` / `constants` | `types` | Vue 组件、store、api |
| `api` | `types`、`utils`、`config` | 组件、store、views |
| `stores` | `api`、`types`、`utils` | 组件、views |
| `composables` | `stores`、`api`、`types` | 具体页面组件 |
| `components` | `composables`、`stores`、`types` | `views` |
| `views` | 以上全部 | 其他业务域的 `views` 内部文件 |

> 依赖只能自上向下。下层不允许反向 import 上层，否则视为架构违规。

### 业务域膨胀后的升级路径

当 `views/` 下某业务域文件数 > 20，或跨模块引用频繁时，改为 feature 结构：

```text
src/features/order/
├── api/
├── components/
├── composables/
├── stores/
├── types/
├── views/
└── index.js        # 唯一对外出口
```

升级需整体迁移，不允许两种结构长期并存。

## 2. 文件命名

| 类型 | 规则 | 示例 |
| --- | --- | --- |
| 目录 | kebab-case，多单词 | `user-center/`、`order-detail/` |
| 页面组件 | PascalCase + `View` 后缀 | `UserListView.vue` |
| 通用组件 | PascalCase，基础组件 `Base` 前缀 | `BaseTable.vue`、`UserCard.vue` |
| 布局 | PascalCase + `Layout` 后缀 | `AdminLayout.vue` |
| 组合式函数 | camelCase + `use` 前缀 | `usePagination.js` |
| Store | kebab-case + `.store.js` | `user.store.js` |
| API | kebab-case，按域命名 | `user.js`、`order.js` |
| JSDoc 类型 | kebab-case + `.types.js` | `user.types.js` |
| 工具 | kebab-case，动词或名词 | `format-date.js`、`storage.js` |
| 常量 | kebab-case + `.constant.js` | `order-status.constant.js` |
| 样式 | kebab-case | `variables.scss`、`mixins.scss` |
| 测试 | 与被测文件同名 + `.spec.js` | `usePagination.spec.js` |

❌ 禁止：`index.vue`（除目录唯一出口外）、`test.vue`、`Component1.vue`、`uTils.js`、`UserList.vue` 放在 `views/user/` 却命名为 `list.vue`。

## 3. 代码命名

| 对象 | 规则 | 示例 |
| --- | --- | --- |
| 变量 / 函数 | camelCase，动词开头表达行为 | `fetchOrderList`、`normalizeUser` |
| 布尔值 | `is` / `has` / `can` / `should` 前缀 | `isLoading`、`hasPermission` |
| 事件处理 | `handle` + 事件名 | `handleSubmit`、`handleRowClick` |
| 常量 | SCREAMING_SNAKE_CASE | `MAX_PAGE_SIZE`、`ORDER_STATUS` |
| 类 / 构造函数 | PascalCase | `UserFormatter` |
| JSDoc typedef | PascalCase，不加 `I` 前缀 | `UserItem`、`OrderQuery` |
| 枚举对象 | PascalCase 名称 + PascalCase 成员 | `OrderStatus.Paid` |
| 组件事件 | defineEmits 用 camelCase，模板监听用 kebab-case | `update:modelValue` → `@update:model-value` |
| CSS 类 | BEM：`block__element--modifier` | `.user-card__title--active` |
| CSS 变量 | `--{语义}-{层级}` | `--color-primary`、`--space-4` |

❌ 禁止：`data1`、`temp`、`obj`、`list2`、`flag`、拼音命名（`yonghuList`）、中文命名、`IUser`。

## 4. 模块边界

- 跨业务域只能通过 `index.js` 公开出口引用，禁止指到内部文件。

```js
// ✅
import { useOrderStore } from '@/features/order'
// ❌
import { useOrderStore } from '@/features/order/stores/order.store'
```

- 公共组件被 3 个以上页面使用，才允许上移到 `components/`；否则留在使用方目录。
- 只被一个页面使用的组件，放该页面同级 `components/` 下。

## 5. 新增文件前置检查

1. `Grep` 是否已有同名/同职责实现；
2. 该文件属于哪一层，依赖是否符合第 1 节表格；
3. 命名是否符合第 2、3 节；
4. 是否需要在 `index.js` 或路由中注册；
5. 是否需要在本文档「目录速查」中补充。
