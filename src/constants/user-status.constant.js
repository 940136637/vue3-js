/**
 * @typedef {import('@/types/user.types').UserStatus} UserStatus
 */

/**
 * 用户状态文案
 * @type {Record<UserStatus, string>}
 */
export const USER_STATUS_LABEL = {
  active: '启用',
  disabled: '停用',
}
