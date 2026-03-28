import { Page, expect, Locator } from '@playwright/test';

/**
 * Page Object Model for the Admin Dashboard (Leads Page)
 *
 * This class encapsulates all interactions with the admin dashboard,
 * including viewing leads, searching, managing limits, and logout.
 */
export class DashboardPage {
  // Page reference (public for test access)
  readonly page: Page;

  // Header locators
  private readonly logoutButton: Locator;
  private readonly landingLink: Locator;
  private readonly pageTitle: Locator;

  // Stats card locators
  private readonly totalRegistrosCard: Locator;
  private readonly hoyCard: Locator;
  private readonly limiteActualCard: Locator;
  private readonly cuposRestantesCard: Locator;

  // Limit management locators
  private readonly limitInput: Locator;
  private readonly limitUpdateButton: Locator;
  private readonly limitSuccessMessage: Locator;
  private readonly limitErrorMessage: Locator;

  // Search and table locators
  private readonly searchInput: Locator;
  private readonly tableRows: Locator;
  private readonly noResultsMessage: Locator;
  private readonly loadingSpinner: Locator;
  private readonly errorMessage: Locator;
  private readonly resultCount: Locator;

  // Mobile card view locators
  private readonly mobileCards: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.logoutButton = page.locator('button', { hasText: 'Salir' });
    this.landingLink = page.locator('a[href="/"]', { hasText: 'Ver Landing' });
    this.pageTitle = page.locator('text=Panel de Registros');

    // Stats cards - using data within the card structure
    this.totalRegistrosCard = page.locator('text=Total registros').locator('..');
    this.hoyCard = page.locator('text=Hoy').locator('..');
    this.limiteActualCard = page.locator('text=Límite actual').locator('..');
    this.cuposRestantesCard = page.locator('text=Cupos restantes').locator('..');

    // Limit management
    this.limitInput = page.locator('input[type="number"][placeholder="Ej. 50"]');
    this.limitUpdateButton = page.locator('button', { hasText: 'Actualizar' });
    this.limitSuccessMessage = page.locator('text=Límite actualizado correctamente');
    this.limitErrorMessage = page.locator('text=Error al actualizar el límite');

    // Search and table
    this.searchInput = page.locator('input[placeholder*="Buscar"]');
    this.tableRows = page.locator('tbody tr');
    this.noResultsMessage = page.locator('text=No se encontraron registros');
    this.loadingSpinner = page.locator('.animate-spin');
    this.errorMessage = page.locator('.bg-rose-50');
    this.resultCount = page.locator('text=/\\d+ registros? encontrados?/');

    // Mobile cards
    this.mobileCards = page.locator('.md\\:hidden > div');
  }

  /**
   * Navigate to the dashboard
   */
  async goto(): Promise<void> {
    await this.page.goto('/leads');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click the logout button
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  /**
   * Click the "Ver Landing" link
   */
  async goToLanding(): Promise<void> {
    await this.landingLink.click();
  }

  /**
   * Assert that the dashboard page loaded correctly
   */
  async expectPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  /**
   * Assert that the user was redirected to login
   */
  async expectRedirectToLogin(): Promise<void> {
    await this.page.waitForURL('**/login', { timeout: 10000 });
    expect(this.page.url()).toContain('/login');
  }

  /**
   * Assert that the user was redirected to landing page
   */
  async expectRedirectToLanding(): Promise<void> {
    await this.page.waitForURL('/', { timeout: 5000 });
    expect(this.page.url()).toBe(this.page.url().replace(/\/leads.*/, '/'));
  }

  /**
   * Get the total registros count from stats card
   *
   * @returns The total count
   */
  async getTotalRegistros(): Promise<number> {
    const text = await this.totalRegistrosCard.locator('.text-3xl').textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  /**
   * Get the "Hoy" (today) count from stats card
   *
   * @returns The today count
   */
  async getTodayCount(): Promise<number> {
    const text = await this.hoyCard.locator('.text-3xl').textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  /**
   * Get the current limit from stats card
   *
   * @returns The current limit, or null if disabled (shown as "—")
   */
  async getCurrentLimit(): Promise<number | null> {
    const text = await this.limiteActualCard.locator('.text-3xl').textContent();
    const trimmed = text?.trim();
    return trimmed === '—' ? null : parseInt(trimmed || '0', 10);
  }

  /**
   * Get the remaining slots from stats card
   *
   * @returns The remaining slots, or null if limit is disabled
   */
  async getRemainingSlots(): Promise<number | null> {
    const text = await this.cuposRestantesCard.locator('.text-3xl').textContent();
    const trimmed = text?.trim();
    return trimmed === '—' ? null : parseInt(trimmed || '0', 10);
  }

  /**
   * Update the patient limit
   *
   * @param limit - The new limit value
   */
  async updateLimit(limit: number): Promise<void> {
    await this.limitInput.fill(String(limit));
    await this.limitUpdateButton.click();
  }

  /**
   * Assert that the limit was updated successfully
   */
  async expectLimitUpdateSuccess(): Promise<void> {
    await expect(this.limitSuccessMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Assert that the limit update failed
   */
  async expectLimitUpdateError(): Promise<void> {
    await expect(this.limitErrorMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Search for leads using the search input
   *
   * @param query - The search query
   */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(300); // Wait for filter to apply
  }

  /**
   * Clear the search input
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.page.waitForTimeout(300);
  }

  /**
   * Get the number of visible lead rows in the table
   *
   * @returns The count of visible rows (excluding header and "no results" row)
   */
  async getLeadsCount(): Promise<number> {
    // Check if "no results" message is visible
    const noResults = await this.noResultsMessage.isVisible();
    if (noResults) {
      return 0;
    }

    // Count actual data rows
    const rows = await this.tableRows.all();
    return rows.length;
  }

  /**
   * Get all lead names currently visible in the table
   *
   * @returns Array of lead names
   */
  async getVisibleLeadNames(): Promise<string[]> {
    const nameLocators = this.page.locator('tbody tr td:nth-child(2) span.font-semibold');
    const count = await nameLocators.count();

    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await nameLocators.nth(i).textContent();
      if (name) {
        names.push(name.trim());
      }
    }

    return names;
  }

  /**
   * Assert that no results message is visible
   */
  async expectNoResults(): Promise<void> {
    await expect(this.noResultsMessage).toBeVisible();
  }

  /**
   * Assert that results are visible (no "no results" message)
   */
  async expectHasResults(): Promise<void> {
    await expect(this.noResultsMessage).not.toBeVisible();
  }

  /**
   * Assert that a specific lead name is visible in the table
   *
   * @param name - The lead name to find
   */
  async expectLeadVisible(name: string): Promise<void> {
    await expect(this.page.locator('tbody', { hasText: name })).toBeVisible();
  }

  /**
   * Assert that a specific lead name is NOT visible in the table
   *
   * @param name - The lead name to check
   */
  async expectLeadNotVisible(name: string): Promise<void> {
    await expect(this.page.locator('tbody', { hasText: name })).not.toBeVisible();
  }

  /**
   * Wait for the dashboard to finish loading
   */
  async waitForLoadingToFinish(): Promise<void> {
    await this.page.waitForTimeout(500);
    await expect(this.loadingSpinner).not.toBeVisible();
  }

  /**
   * Assert that the loading spinner is visible
   */
  async expectLoading(): Promise<void> {
    await expect(this.loadingSpinner).toBeVisible();
  }

  /**
   * Assert that an error message is displayed
   */
  async expectError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }

  /**
   * Get the result count text (e.g., "5 registros encontrados")
   *
   * @returns The result count text or null if not visible
   */
  async getResultCountText(): Promise<string | null> {
    try {
      return await this.resultCount.textContent({ timeout: 2000 });
    } catch {
      return null;
    }
  }

  /**
   * Reload the page (useful for testing session persistence)
   */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Assert that stats cards display correct values
   *
   * @param expected - Expected stat values
   */
  async expectStatsMatch(expected: {
    total: number;
    today: number;
    limit: number | null;
    remaining: number | null;
  }): Promise<void> {
    const total = await this.getTotalRegistros();
    const today = await this.getTodayCount();
    const limit = await this.getCurrentLimit();
    const remaining = await this.getRemainingSlots();

    expect(total).toBe(expected.total);
    expect(today).toBe(expected.today);
    expect(limit).toBe(expected.limit);
    expect(remaining).toBe(expected.remaining);
  }
}
