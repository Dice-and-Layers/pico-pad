import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pico-pad/',
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
})
