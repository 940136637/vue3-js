const isDev = import.meta.env.DEV

export const logger = {
  /**
   * 开发环境日志
   * @param {...*} args 日志内容
   */
  info(...args) {
    if (isDev) {
      console.info('[info]', ...args)
    }
  },
  /**
   * 警告日志
   * @param {...*} args 日志内容
   */
  warn(...args) {
    console.warn('[warn]', ...args)
  },
  /**
   * 错误日志
   * @param {...*} args 日志内容
   */
  error(...args) {
    console.error('[error]', ...args)
  },
}
