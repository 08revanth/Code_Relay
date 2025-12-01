import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/judge0': {
        target: 'http://localhost:2358',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/judge0/, ''),
      },
    },
  },
})
