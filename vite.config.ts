import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { APP_BASE } from './src/lib/config.ts'

export default defineConfig({
  base: APP_BASE,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test-setup.ts'],
    restoreMocks: true,
  },
})
