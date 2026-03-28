import { Page, expect, Locator } from '@playwright/test';

/**
 * Page Object Model for the Landing Page (Public Registration Form)
 *
 * This class encapsulates all interactions with the landing page,
 * including form filling, validation, and assertions.
 */
export class LandingPage {
  // Page reference (public for test access)
  readonly page: Page;

  // Form field locators (public for test access)
  readonly nombreInput: Locator;
  readonly emailInput: Locator;
  readonly telefonoInput: Locator;
  readonly edadInput: Locator;
  readonly cedulaInput: Locator;
  readonly submitButton: Locator;

  // Message locators
  readonly successMessage: Locator;
  private readonly errorMessage: Locator;
  private readonly slotFullBanner: Locator;
  private readonly slotCountText: Locator;

  // Cedula label locators
  private readonly cedulaLabel: Locator;
  private readonly cedulaOptionalLabel: Locator;
  private readonly cedulaRequiredMark: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.nombreInput = page.locator('input[name="nombre"]');
    this.emailInput = page.locator('input[name="email"]');
    this.telefonoInput = page.locator('input[name="telefono"]');
    this.edadInput = page.locator('input[name="edad"]');
    this.cedulaInput = page.locator('input[name="cedula"]');
    this.submitButton = page.locator('button[type="submit"]');

    this.successMessage = page.locator('text=Tu solicitud fue enviada');
    this.errorMessage = page.locator('.bg-rose-50');
    this.slotFullBanner = page.locator('text=Cupos de la jornada actual completos');
    this.slotCountText = page.locator('text=/\\d+ de \\d+ cupos disponibles/');

    this.cedulaLabel = page.locator('label', { hasText: 'Cédula de identidad' });
    this.cedulaOptionalLabel = page.locator('text=opcional para menores de edad');
    this.cedulaRequiredMark = this.cedulaLabel.locator('span.text-cyan-500');
  }

  /**
   * Navigate to the landing page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill the registration form with provided data
   *
   * @param data - Form data to fill
   */
  async fillRegistrationForm(data: {
    nombre: string;
    email?: string;
    telefono: string;
    edad: string;
    cedula?: string;
  }): Promise<void> {
    await this.nombreInput.fill(data.nombre);

    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }

    await this.telefonoInput.fill(data.telefono);
    await this.edadInput.fill(data.edad);

    if (data.cedula !== undefined) {
      await this.cedulaInput.fill(data.cedula);
    }
  }

  /**
   * Submit the registration form
   */
  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Fill and submit the form in one action
   *
   * @param data - Form data to fill
   */
  async fillAndSubmitForm(data: {
    nombre: string;
    email?: string;
    telefono: string;
    edad: string;
    cedula?: string;
  }): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.submitForm();
  }

  /**
   * Assert that the success message is visible
   */
  async expectSuccessMessage(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
  }

  /**
   * Assert that an error message is visible
   */
  async expectErrorMessage(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Assert that a specific error message text is visible
   *
   * @param message - Expected error message text
   */
  async expectErrorMessageWithText(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  /**
   * Assert that the slot full banner is visible
   */
  async expectSlotFullBanner(): Promise<void> {
    await expect(this.slotFullBanner).toBeVisible();
  }

  /**
   * Assert that the slot full banner is NOT visible
   */
  async expectNoSlotFullBanner(): Promise<void> {
    await expect(this.slotFullBanner).not.toBeVisible();
  }

  /**
   * Get the available slots text (e.g., "45 de 50 cupos disponibles")
   *
   * @returns The slot count text or null if not visible
   */
  async getAvailableSlots(): Promise<string | null> {
    try {
      return await this.slotCountText.textContent({ timeout: 2000 });
    } catch {
      return null;
    }
  }

  /**
   * Assert that the cedula field is marked as required (asterisk)
   */
  async expectCedulaRequired(): Promise<void> {
    await expect(this.cedulaRequiredMark).toBeVisible();
    await expect(this.cedulaOptionalLabel).not.toBeVisible();

    // Verify the input has the 'required' attribute
    const isRequired = await this.cedulaInput.getAttribute('required');
    expect(isRequired).not.toBeNull();
  }

  /**
   * Assert that the cedula field is marked as optional (for minors)
   */
  async expectCedulaOptional(): Promise<void> {
    await expect(this.cedulaOptionalLabel).toBeVisible();
    await expect(this.cedulaRequiredMark).not.toBeVisible();

    // Verify the input does NOT have the 'required' attribute
    const isRequired = await this.cedulaInput.getAttribute('required');
    expect(isRequired).toBeNull();
  }

  /**
   * Get the form data currently filled in the form
   *
   * @returns Object with current form values
   */
  async getFormValues(): Promise<{
    nombre: string;
    email: string;
    telefono: string;
    edad: string;
    cedula: string;
  }> {
    return {
      nombre: (await this.nombreInput.inputValue()) || '',
      email: (await this.emailInput.inputValue()) || '',
      telefono: (await this.telefonoInput.inputValue()) || '',
      edad: (await this.edadInput.inputValue()) || '',
      cedula: (await this.cedulaInput.inputValue()) || '',
    };
  }

  /**
   * Assert that the form is cleared (all fields empty)
   */
  async expectFormCleared(): Promise<void> {
    await expect(this.nombreInput).toHaveValue('');
    await expect(this.emailInput).toHaveValue('');
    await expect(this.telefonoInput).toHaveValue('');
    await expect(this.edadInput).toHaveValue('');
    await expect(this.cedulaInput).toHaveValue('');
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
   * Wait for the loading state to finish
   */
  async waitForLoadingToFinish(): Promise<void> {
    await this.page.waitForTimeout(500);
    await expect(this.submitButton).toBeEnabled();
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Assert that the page loaded correctly
   */
  async expectPageLoaded(): Promise<void> {
    await expect(this.page.locator('text=Tu salud dental')).toBeVisible();
    await expect(this.page.locator('text=Solicitar Cita')).toBeVisible();
  }

  /**
   * Trigger HTML5 validation by submitting with invalid data
   * Used to test browser validation (required fields, etc.)
   */
  async triggerValidation(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Check if the nombre field has validation error (HTML5)
   *
   * @returns true if the field is invalid
   */
  async isNombreInvalid(): Promise<boolean> {
    const validationMessage = await this.nombreInput.evaluate(
      (input: HTMLInputElement) => input.validationMessage
    );
    return validationMessage.length > 0;
  }

  /**
   * Check if the cedula field has validation error (HTML5)
   *
   * @returns true if the field is invalid
   */
  async isCedulaInvalid(): Promise<boolean> {
    const validationMessage = await this.cedulaInput.evaluate(
      (input: HTMLInputElement) => input.validationMessage
    );
    return validationMessage.length > 0;
  }
}
