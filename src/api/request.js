import axios from 'axios'
import { env } from '@/config/env'

export const request = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => response,
  (error) => {
    // 统一转换为可读错误，禁止在此弹 UI 提示
    const message = error.response?.data?.message ?? error.message ?? '网络异常，请稍后重试'
    return Promise.reject(new Error(message))
  },
)
