import type { AxiosRequestConfig } from 'axios'
import { http } from './axios'

export async function fetcher<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await http.request<T>({ url, ...config })
  return response.data
}
