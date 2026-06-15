import { defineConfig, devices } from '@playwright/test'

/**
 * Smoke-Test-Baseline für braum.consulting.
 *
 * Der Dev-Server läuft separat auf :3000 — Playwright startet ihn NICHT
 * selbst (webServer ist bewusst auskommentiert). Lokal/in CI:
 *   pnpm install
 *   pnpm exec playwright install chromium
 *   pnpm dev   # in eigenem Terminal, oder PLAYWRIGHT_BASE_URL setzen
 *   pnpm test:e2e
 */
export default defineConfig({
  testDir: './e2e',
  // Seriell + 1 Worker: läuft gegen den Turbopack-Dev-Server, der Routen
  // beim ersten Aufruf erst kompiliert. Paralleles Anfragen aller Routen
  // überlastet den Dev-Server und führt zu Timeouts beim Cold-Compile.
  fullyParallel: false,
  workers: 1,
  // Großzügig, weil der erste Aufruf einer Route den Compile abwartet.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    navigationTimeout: 60_000,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Server läuft bereits auf :3000 — kein Autostart.
  // Zum Aktivieren auskommentieren:
  // webServer: {
  //   command: 'pnpm dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: true,
  //   timeout: 120_000,
  // },
})
