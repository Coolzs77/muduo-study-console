import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 支持 GitHub Pages 相对路径部署
  server: {
    port: 3000,
    open: true
  }
})
