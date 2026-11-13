const rawBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!rawBaseUrl) {
  throw new Error('缺少环境变量 VITE_API_BASE_URL，请参考 .env.example 配置')
}

/**
 * 运行时环境配置
 * @type {{ apiBaseUrl: string, appTitle: string, enableMock: boolean }}
 */
export const env = {
  apiBaseUrl: rawBaseUrl,
  appTitle: import.meta.env.VITE_APP_TITLE ?? 'Vue App',
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
}
