import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

// Vite configuration for Vue3 project
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Path aliases for cleaner imports
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
