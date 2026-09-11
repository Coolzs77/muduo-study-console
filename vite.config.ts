import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 确保构建生成 ./assets/... 相对路径，同时完美兼容 GitHub Pages 与本地运行
  server: {
    port: 3000,
    open: '/dev.html'
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'dev.html')
      }
    }
  }
})
