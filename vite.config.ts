import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/onebe-price-simulator/',
  plugins: [react()],
  build: {
    sourcemap: true,
  },
})
