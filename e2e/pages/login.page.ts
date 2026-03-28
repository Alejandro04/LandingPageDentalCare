import { Page, expect, Locator } from '@playwright/test';

/**
 * Page Object Model for the Admin Login Page
 *
 * This class encapsulates all interactions with the admin login page,
 * including authentication and error handling.
 */
export class LoginPage {
  // Page reference (public for test access)
  readonly page: Page;

  // Form field locators (public for test access)
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  // Message locators
  private readonly errorMessage: Locator;

  // Page element locators
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.bg-rose-50');
    this.pageTitle = page.locator('text=Acceso restringido');
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill the password field
   *
   * @param password - The password to enter
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Submit the login form
   */
  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Perform login with provided password
   *
   * @param password - The admin password
   */
  async login(password: string): Promise<void> {
    await this.fillPassword(password);
    await this.submitForm();
  }

  /**
   * Assert that an error message is visible
   */
  async expectError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Assert that a specific error message text is visible
   *
   * @param message - Expected error message text
   */
  async expectErrorWithText(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  /**
   * Assert that no error message is visible
   */
  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  /**
   * Assert that the page redirected to dashboard
   * (checks URL contains /leads)
   */
  async expectRedirectToDashboard(): Promise<void> {
    await this.page.waitForURL('**/leads', { timeout: 10000 });
    expect(this.page.url()).toContain('/leads');
  }

  /**
   * Assert that we're still on the login page (no redirect)
   */
  async expectStillOnLoginPage(): Promise<void> {
    await this.page.waitForTimeout(1000);
    expect(this.page.url()).toContain('/login');
  }

  /**
   * Assert that the submit button is disabled (loading state)
   */
  async expectSubmitButtonDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  /**
   * Assert that the submit button is enabled
   */
  async expectSubmitButtonEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }

  /**
   * Assert that the login page loaded correctly
   */
  async expectPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Get the current cookie value for dental_auth
   *
   * @returns The cookie value or null if not set
   */
  async getAuthCookie(): Promise<string | null> {
    const cookies = await this.page.context().cookies();
    const authCookie = cookies.find((cookie) => cookie.name === 'dental_auth');
    return authCookie?.value || null;
  }

  /**
   * Assert that the auth cookie is set
   */
  async expectAuthCookieSet(): Promise<void> {
    const cookieValue = await this.getAuthCookie();
    expect(cookieValue).toBe('authenticated');
  }

  /**
   * Assert that the auth cookie is NOT set
   */
  async expectNoAuthCookie(): Promise<void> {
    const cookieValue = await this.getAuthCookie();
    expect(cookieValue).toBeNull();
  }

  /**
   * Clear all cookies (simulate logout)
   */
  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  /**
   * Wait for navigation to complete after login
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForURL('**/leads', { timeout: 10000 });
  }
}
