import { request } from '@/api/request'

/**
 * @typedef {import('@/types/common.types').PageResult} PageResult
 * @typedef {import('@/types/user.types').UserItem} UserItem
 * @typedef {import('@/types/user.types').UserQuery} UserQuery
 */

/**
 * 查询用户列表
 * @param {UserQuery} params 查询条件
 * @returns {Promise<PageResult<UserItem>>} 分页结果
 */
export function fetchUserList(params) {
  return request.get('/users', { params }).then((response) => response.data)
}

/**
 * 创建用户
 * @param {Omit<UserItem, 'id' | 'createdAt'>} payload 用户信息
 * @returns {Promise<UserItem>} 创建后的用户
 */
export function createUser(payload) {
  return request.post('/users', payload).then((response) => response.data)
}
