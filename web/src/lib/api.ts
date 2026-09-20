const configuredBaseUrl =
  import.meta.env.VITE_API_URI || 'http://localhost:3000/api/v1'

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '')
