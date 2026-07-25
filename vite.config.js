import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/oauth2/authorization': 'http://localhost:8080',
      '/login/oauth2/code': 'http://localhost:8080',
    },
  },
})