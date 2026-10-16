import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3200);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: [["list"], ["json", { outputFile: "test-results/e2e-results.json" }]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  // Requires a production build: `npm run build` first.
  webServer: { command: `npx next start -p ${PORT}`, port: PORT, reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] }, testMatch: /(navigation|forms|a11y)\.spec\.ts/ },
  ],
});
