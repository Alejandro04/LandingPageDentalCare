import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load test environment variables (optional - CI uses secrets directly)
const envTestPath = path.resolve(__dirname, '.env.test');
const envTestExists = fs.existsSync(envTestPath);

if (envTestExists) {
  dotenv.config({ path: envTestPath });
}

// Parse .env.test to pass to webServer (if it exists)
function loadEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const env: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=');
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    }
  }
  return env;
}

const testEnv = loadEnvFile(envTestPath);

/**
 * Playwright E2E Test Configuration
 *
 * This configuration sets up Playwright for testing the Aniversario Dental Care
 * appointment booking system with a focus on reliability and maintainability.
 */
export default defineConfig({
  // Test directory
  testDir: './e2e',

  // Ignore the fixtures and pages directories
  testIgnore: ['**/fixtures/**', '**/pages/**'],

  // Maximum time one test can run (30 seconds - allows for database operations)
  timeout: 30 * 1000,

  // Run tests in files in serial (one worker to avoid database conflicts)
  fullyParallel: false,
  workers: 1,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry strategy: 0 locally (fail fast), 2 on CI (handle flakiness)
  retries: process.env.CI ? 2 : 0,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

    // Collect trace on failure for debugging
    trace: 'retain-on-failure',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Accept downloads
    acceptDownloads: false,

    // Timeout for actions (click, fill, etc.)
    actionTimeout: 10 * 1000,
  },

  // Configure projects for different test scenarios
  projects: [
    // Setup project - runs first to create authenticated state
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // Chromium tests (desktop)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use saved auth state for admin tests
        storageState: 'e2e/.auth/admin.json',
      },
      dependencies: ['setup'],
    },

    // Firefox tests (desktop) - optional, comment out for faster CI
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: 'e2e/.auth/admin.json',
    //   },
    //   dependencies: ['setup'],
    // },

    // WebKit tests (desktop) - optional, comment out for faster CI
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: 'e2e/.auth/admin.json',
    //   },
    //   dependencies: ['setup'],
    // },

    // Mobile Chrome tests - optional, for responsive testing
    // {
    //   name: 'mobile-chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //     storageState: 'e2e/.auth/admin.json',
    //   },
    //   dependencies: ['setup'],
    // },
  ],

  // Run the dev server automatically (optional - comment out if running manually)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
    // Pass test environment variables to the dev server
    env: {
      ...Object.fromEntries(
        Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined)
      ),
      ...testEnv,
    },
  },
});
