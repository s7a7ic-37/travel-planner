import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4196', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium-phone', use: { browserName: 'chromium', viewport: { width: 390, height: 900 } } },
    { name: 'chromium-desktop', use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } } },
    { name: 'webkit-phone', use: { browserName: 'webkit', viewport: { width: 390, height: 900 } } },
  ],
  webServer: {
    command: 'npm run build && npx --yes wrangler@4.158.0 dev --config ../wrangler.jsonc --port 4196',
    url: 'http://127.0.0.1:4196/demo/',
    timeout: 120000,
  },
});
