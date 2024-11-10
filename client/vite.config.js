import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/web3_blockchain_zh/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
