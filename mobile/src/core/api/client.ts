import { create } from 'axios';
import { Config } from '@/constants/config';

export const apiClient = create({
  baseURL: Config.apiBaseUrl,
  timeout: 15_000,
  headers: { 'X-Client-Type': 'mobile' },
});
