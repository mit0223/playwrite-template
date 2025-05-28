// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: false,
    slowMo: 1000, // デモ用にゆっくり実行
  },

  projects: [
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // VNC環境用の設定
        launchOptions: {
          env: {
            DISPLAY: ':1'
          }
        }
      },
    },
  ],

  webServer: undefined,
});
