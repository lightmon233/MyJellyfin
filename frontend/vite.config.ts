import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 配置'/api'路由到nest后端
      '/api': {
        target: 'http://localhost:3000', // nestjs的后端地址
        // changeOrigin会把访问从5173端口转到3000端口
        changeOrigin: true,
        // 如过写以下这句，前端访问'/api/hello', 就会被替换成访问后端的'/hello'
        // js中，正则表达式用//括起来
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
