import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

/**
 * Authentication Setup
 *
 * This file runs before all other tests to create an authenticated admin session.
 * The authentication state is saved to a file and reused by other tests,
 * avoiding the need to log in before every test.
 *
 * This significantly speeds up test execution and follows Playwright best practices.
 */

const authFile = 'e2e/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.goto();

  // Verify page loaded
  await loginPage.expectPageLoaded();

  // Get admin password from environment
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      'ADMIN_PASSWORD environment variable is not set. Please configure it in .env.test'
    );
  }

  // Perform login
  await loginPage.login(adminPassword);

  // Wait for redirect to dashboard
  await loginPage.expectRedirectToDashboard();

  // Verify auth cookie is set
  await loginPage.expectAuthCookieSet();

  // Verify we're on the dashboard (double-check)
  await expect(page.locator('text=Panel de Registros')).toBeVisible({
    timeout: 10000,
  });

  // Save the authenticated state to file
  await page.context().storageState({ path: authFile });

  console.log(`✅ Authentication successful. State saved to ${authFile}`);
});
