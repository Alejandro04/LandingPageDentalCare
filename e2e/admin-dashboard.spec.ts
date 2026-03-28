import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/dashboard.page';
import { resetDatabase, insertLeads } from './fixtures/database';
import { bulkLeads } from './fixtures/test-data';

test.describe('Admin Dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await resetDatabase();
  });

  test('should display registrations and stats correctly', async () => {
    await insertLeads(bulkLeads.slice(0, 3));
    await dashboardPage.goto();
    await dashboardPage.expectPageLoaded();

    const count = await dashboardPage.getLeadsCount();
    expect(count).toBe(3);

    const total = await dashboardPage.getTotalRegistros();
    expect(total).toBe(3);
  });

  test('should filter leads by search', async () => {
    await insertLeads(bulkLeads.slice(0, 5));
    await dashboardPage.goto();

    await dashboardPage.search(bulkLeads[0].nombre.split(' ')[0]);
    const count = await dashboardPage.getLeadsCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should update patient limit', async () => {
    await dashboardPage.goto();
    await dashboardPage.updateLimit(100);
    await dashboardPage.expectLimitUpdateSuccess();

    const limit = await dashboardPage.getCurrentLimit();
    expect(limit).toBe(100);
  });

  test('should logout and redirect to login', async ({ page }) => {
    await dashboardPage.goto();
    await dashboardPage.logout();
    await dashboardPage.expectRedirectToLogin();
    await expect(page.locator('text=Acceso restringido')).toBeVisible();
  });
});
