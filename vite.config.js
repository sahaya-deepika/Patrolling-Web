import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    // NO proxy needed — api.js calls http://localhost:3001 directly
    // json-server 0.17.x sends Access-Control-Allow-Origin: * by default
  }
})