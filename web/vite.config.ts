import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    server: {
      host: true,
      port: Number(env.PORT) || 5173,
      allowedHosts: env.ALLOWED_HOST
        ? env.ALLOWED_HOST.split(',').map((host) => host.trim())
        : undefined,
    },
  }
})
