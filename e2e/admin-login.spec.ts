import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Admin Login', () => {
  let loginPage: LoginPage;

  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should login successfully and redirect to dashboard', async ({ page }) => {
    await loginPage.goto();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is not set');
    }

    await loginPage.login(adminPassword);
    await loginPage.expectRedirectToDashboard();
    await loginPage.expectAuthCookieSet();
    await expect(page.locator('text=Panel de Registros')).toBeVisible();
  });

  test('should show error with incorrect password', async () => {
    await loginPage.goto();
    await loginPage.login('wrong_password');
    await loginPage.expectError();
    await loginPage.expectNoAuthCookie();
  });
});
