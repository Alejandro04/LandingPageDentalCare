import { test, expect } from '@playwright/test';
import { LandingPage } from './pages/landing.page';
import { resetDatabase, getLeadCount } from './fixtures/database';
import { adultLead } from './fixtures/test-data';

test.describe('Public Registration Form', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await resetDatabase();
  });

  test('should register first lead when database is empty', async () => {
    // Verificar que no hay registros
    const initialCount = await getLeadCount();
    expect(initialCount).toBe(0);

    // Ir al formulario
    await landingPage.goto();

    // Registrar adulto con cédula
    await landingPage.fillAndSubmitForm(adultLead);
    await landingPage.expectSuccessMessage();

    // Verificar que ahora hay 1 registro
    const finalCount = await getLeadCount();
    expect(finalCount).toBe(1);
  });
});
