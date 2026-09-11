import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 确保构建生成相对路径 ./assets/...，完美适配 GitHub Pages 与各部署环境
  server: {
    port: 3000,
    open: true
  }
})
