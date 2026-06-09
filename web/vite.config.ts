import { defineConfig, loadEnv } from "vite";
import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: parseInt(env.PORT),
      allowedHosts: env.ALLOWED_HOST ? [env.ALLOWED_HOST] : [],
      host: true,
    },
  };
});
