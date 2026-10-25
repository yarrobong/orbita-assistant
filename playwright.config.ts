import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173/orbita-assistant/', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ...(process.env.CI ? [
      { name: 'webkit-desktop', testMatch: '**/platform.spec.ts', use: { ...devices['Desktop Safari'], browserName: 'webkit' as const } },
      { name: 'iphone-safari', testMatch: '**/platform.spec.ts', use: { ...devices['iPhone 13'], browserName: 'webkit' as const } },
    ] : []),
  ],
  webServer: { command: 'npm run preview -- --host 127.0.0.1', url: 'http://127.0.0.1:4173/orbita-assistant/', reuseExistingServer: !process.env.CI, timeout: 30_000 },
})
