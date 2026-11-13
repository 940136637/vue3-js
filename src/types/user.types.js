/**
 * 用户状态
 * @typedef {'active' | 'disabled'} UserStatus
 */

/**
 * 用户列表项
 * @typedef {object} UserItem
 * @property {string} id 用户 ID
 * @property {string} name 姓名
 * @property {string | null} email 邮箱
 * @property {UserStatus} status 状态
 * @property {string} createdAt 创建时间
 */

/**
 * 用户列表查询条件
 * @typedef {object} UserQuery
 * @property {string} [keyword] 关键字
 * @property {UserStatus} [status] 状态
 * @property {number} page 页码
 * @property {number} pageSize 每页条数
 */

export {}
