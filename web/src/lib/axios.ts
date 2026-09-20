import axios from 'axios'
import { API_BASE_URL } from './api'

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: { 'X-Client-Type': 'web' },
})
