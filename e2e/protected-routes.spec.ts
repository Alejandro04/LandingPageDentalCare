import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
  test.describe('Unauthenticated', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should redirect from /leads to /login without auth', async ({ page }) => {
      await page.goto('/leads');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/login');
      await expect(page.locator('text=Acceso restringido')).toBeVisible();
    });

    test('should allow access to public landing page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('text=Tu salud dental')).toBeVisible();
      expect(page.url()).not.toContain('/login');
    });
  });

  test.describe('Authenticated', () => {
    test('should allow access to /leads with valid auth', async ({ page }) => {
      await page.goto('/leads');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('text=Panel de Registros')).toBeVisible();
      expect(page.url()).toContain('/leads');
    });
  });
});
