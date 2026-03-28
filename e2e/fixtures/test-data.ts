/**
 * Test Data Fixtures
 *
 * This file contains predefined test data for E2E tests.
 * Using hardcoded data makes tests more predictable and easier to debug.
 */

/**
 * Valid adult lead (18+) with all fields
 */
export const adultLead = {
  nombre: 'Juan Carlos Pérez',
  email: 'juan.perez@example.com',
  telefono: '0414-7501234',
  cedula: 'V-12345678',
  edad: '35',
};

/**
 * Valid minor lead (<18) without cedula
 */
export const minorLead = {
  nombre: 'María Isabel López',
  email: 'maria.lopez@example.com',
  telefono: '0424-9876543',
  cedula: '',
  edad: '15',
};

/**
 * Adult lead without email (optional field)
 */
export const leadWithoutEmail = {
  nombre: 'Pedro José Martínez',
  email: '',
  telefono: '0412-5554444',
  cedula: 'V-87654321',
  edad: '28',
};

/**
 * Elder patient lead
 */
export const elderLead = {
  nombre: 'Ana María García',
  email: 'ana.garcia@example.com',
  telefono: '0416-1112222',
  cedula: 'V-11223344',
  edad: '68',
};

/**
 * Young adult (exactly 18)
 */
export const youngAdultLead = {
  nombre: 'Carlos Eduardo Ramos',
  email: 'carlos.ramos@example.com',
  telefono: '0426-7778888',
  cedula: 'V-99887766',
  edad: '18',
};

/**
 * Minor at edge case (17 years old)
 */
export const almostAdultLead = {
  nombre: 'Sofía Valentina Torres',
  email: 'sofia.torres@example.com',
  telefono: '0414-3334444',
  cedula: '',
  edad: '17',
};

/**
 * Multiple leads for bulk testing
 */
export const bulkLeads = [
  {
    nombre: 'Roberto Díaz',
    email: 'roberto@example.com',
    telefono: '0414-1111111',
    cedula: 'V-11111111',
    edad: '25',
  },
  {
    nombre: 'Luisa Fernández',
    email: 'luisa@example.com',
    telefono: '0424-2222222',
    cedula: 'V-22222222',
    edad: '32',
  },
  {
    nombre: 'Miguel Sánchez',
    email: 'miguel@example.com',
    telefono: '0412-3333333',
    cedula: 'V-33333333',
    edad: '45',
  },
  {
    nombre: 'Carmen Rodríguez',
    email: 'carmen@example.com',
    telefono: '0416-4444444',
    cedula: 'V-44444444',
    edad: '29',
  },
  {
    nombre: 'José González',
    email: 'jose@example.com',
    telefono: '0426-5555555',
    cedula: 'V-55555555',
    edad: '38',
  },
];

/**
 * Leads for search testing (with varied data)
 */
export const searchLeads = [
  {
    nombre: 'Alexandra Mendoza',
    email: 'alexandra@test.com',
    telefono: '0414-9990001',
    cedula: 'V-10101010',
    edad: '26',
  },
  {
    nombre: 'Alejandro Castro',
    email: 'alejandro@test.com',
    telefono: '0424-9990002',
    cedula: 'V-20202020',
    edad: '34',
  },
  {
    nombre: 'María Alexandra Ruiz',
    email: 'maria.ruiz@test.com',
    telefono: '0412-9990003',
    cedula: 'V-30303030',
    edad: '41',
  },
];

/**
 * Invalid lead data (for validation testing)
 */
export const invalidLeads = {
  // Adult without cedula (should fail)
  adultWithoutCedula: {
    nombre: 'Pedro Sin Cédula',
    email: 'pedro@example.com',
    telefono: '0414-9999999',
    cedula: '',
    edad: '25',
  },

  // Missing nombre (should fail)
  missingNombre: {
    nombre: '',
    email: 'test@example.com',
    telefono: '0414-8888888',
    cedula: 'V-88888888',
    edad: '30',
  },

  // Missing telefono (should fail)
  missingTelefono: {
    nombre: 'Sin Teléfono',
    email: 'test@example.com',
    telefono: '',
    cedula: 'V-77777777',
    edad: '30',
  },

  // Missing edad (should fail)
  missingEdad: {
    nombre: 'Sin Edad',
    email: 'test@example.com',
    telefono: '0414-6666666',
    cedula: 'V-66666666',
    edad: '',
  },
};

/**
 * Generate a unique lead with timestamp-based uniqueness
 * Useful for tests that need unique data each run
 *
 * @param overrides - Optional overrides for specific fields
 * @returns A unique lead object
 */
export function generateUniqueLead(
  overrides?: Partial<{
    nombre: string;
    email: string;
    telefono: string;
    cedula: string;
    edad: string;
  }>
): {
  nombre: string;
  email: string;
  telefono: string;
  cedula: string;
  edad: string;
} {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);

  return {
    nombre: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    telefono: `0414-${random.toString().padStart(7, '0')}`,
    cedula: `V-${timestamp.toString().slice(-8)}`,
    edad: String(Math.floor(Math.random() * 50) + 18),
    ...overrides,
  };
}

/**
 * Generate multiple unique leads
 *
 * @param count - Number of leads to generate
 * @param baseAge - Base age for adults (default 18+)
 * @returns Array of unique leads
 */
export function generateUniqueLeads(
  count: number,
  baseAge: number = 18
): Array<{
  nombre: string;
  email: string;
  telefono: string;
  cedula: string;
  edad: string;
}> {
  const leads = [];

  for (let i = 0; i < count; i++) {
    const timestamp = Date.now() + i;
    leads.push({
      nombre: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      telefono: `0414-${(1000000 + i).toString()}`,
      cedula: `V-${(10000000 + i).toString()}`,
      edad: String(baseAge + i),
    });
  }

  return leads;
}

/**
 * Get today's date at midnight for consistent date testing
 */
export function getTodayMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Get yesterday's date at midnight
 */
export function getYesterdayMidnight(): Date {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
}
