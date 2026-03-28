# Playwright E2E Tests - Aniversario Dental Care

Esta carpeta contiene las pruebas End-to-End (E2E) para el sistema de citas de Aniversario Dental Care, implementadas con [Playwright](https://playwright.dev/).

## Estructura del Proyecto

```
e2e/
├── .auth/                       # Estado de autenticación (gitignored)
│   └── admin.json              # Sesión admin guardada
├── fixtures/                    # Utilidades y datos de prueba
│   ├── database.ts             # Funciones para manejo de BD
│   └── test-data.ts            # Datos de prueba predefinidos
├── pages/                       # Page Object Models
│   ├── landing.page.ts         # Formulario de registro público
│   ├── login.page.ts           # Login de admin
│   └── dashboard.page.ts       # Dashboard de admin
├── auth.setup.ts                # Setup de autenticación global
├── public-registration.spec.ts  # Tests de registro público
├── admin-login.spec.ts          # Tests de login admin
├── admin-dashboard.spec.ts      # Tests de dashboard admin
└── protected-routes.spec.ts     # Tests de middleware
```

## Requisitos Previos

1. **Node.js 20+** instalado
2. **Base de datos de prueba** en Supabase (o PostgreSQL local)
3. **Variables de entorno** configuradas en `.env.test`

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar browsers de Playwright

```bash
npx playwright install chromium
```

### 3. Configurar base de datos de prueba

**Opción A: Crear en Supabase (Recomendado)**

1. Crea un nuevo proyecto o usa el existente
2. Crea las tablas de prueba (con prefijo `test_`):

```sql
-- Tabla de leads
CREATE TABLE test_contact_lead (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(50) NOT NULL,
  cedula VARCHAR(50),
  edad VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de límite de pacientes
CREATE TABLE test_patients_limit (
  id SERIAL PRIMARY KEY,
  limite INTEGER NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Obtén las credenciales de conexión (Transaction pooler y Direct connection)

**Opción B: PostgreSQL Local**

```bash
# Crear base de datos local
createdb dental_care_test

# Ejecutar el mismo SQL de arriba
psql dental_care_test < schema.sql
```

### 4. Configurar `.env.test`

Edita el archivo `.env.test` en la raíz del proyecto con tus credenciales de prueba:

```env
# Test Environment Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Test Database - Transaction Pooler
DATABASE_URL="postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Test Database - Direct Connection
DIRECT_URL="postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Admin Password para tests
ADMIN_PASSWORD="test_password_123"

# Test Tables
TABLE_LEAD_CONTACTS="test_contact_lead"
LIMIT_TABLE="test_patients_limit"

NODE_ENV="test"
```

**IMPORTANTE:** Usa una base de datos separada de producción. No uses las mismas tablas.

## Ejecutar Tests

### Todos los tests

```bash
npm run test:e2e
```

O directamente:

```bash
npx playwright test
```

### Tests específicos

```bash
# Solo tests de registro público
npx playwright test public-registration

# Solo tests de login
npx playwright test admin-login

# Solo tests de dashboard
npx playwright test admin-dashboard

# Solo tests de rutas protegidas
npx playwright test protected-routes
```

### Modo debug

```bash
# Ejecutar en modo debug con UI
npx playwright test --debug

# Ejecutar un test específico en debug
npx playwright test public-registration --debug
```

### Modo headed (ver browser)

```bash
# Ver el navegador mientras se ejecutan los tests
npx playwright test --headed

# Ejecutar en modo slow motion
npx playwright test --headed --slow-mo=1000
```

## Ver Reportes

### Reporte HTML

Después de ejecutar los tests, genera un reporte HTML interactivo:

```bash
npx playwright show-report
```

Esto abrirá automáticamente el reporte en tu navegador.

### Ver última ejecución

```bash
npx playwright show-report
```

## Cobertura de Tests

### Tests de Registro Público (8 tests)

✅ **Happy paths:**
- Adulto (18+) con cédula
- Menor (<18) sin cédula
- Sin email (campo opcional)

⚠️ **Validaciones:**
- Adulto sin cédula debe fallar
- Campos requeridos vacíos
- Toggle dinámico cédula según edad

🎯 **Límites de cupos:**
- Banner visible cuando cupos agotados
- Formulario acepta registros (banner informativo)

🔧 **Manejo de errores:**
- Error API muestra mensaje

### Tests de Login Admin (5 tests)

✅ **Autenticación:**
- Login exitoso redirige a dashboard
- Password incorrecto muestra error

🔒 **Sesión:**
- Sesión persiste al recargar
- Re-autenticación tras limpiar cookie
- Rutas protegidas redirigen a login

### Tests de Dashboard Admin (12 tests)

📊 **Visualización:**
- Muestra todos los registros
- Stats cards precisos

🔍 **Búsqueda:**
- Filtrar por nombre, email, teléfono, cédula
- Sin resultados muestra mensaje

⚙️ **Gestión de límite:**
- Actualizar límite exitosamente
- Límite 0 deshabilita

🚪 **Logout:**
- Limpia cookie y redirige

### Tests de Rutas Protegidas (10 tests)

🔐 **Middleware:**
- Bloquea acceso no autenticado
- Valida cookies correctamente
- Maneja expiración de sesión

## Scripts NPM

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## CI/CD

Los tests se ejecutan automáticamente en GitHub Actions al hacer push o crear un PR. Ver `.github/workflows/e2e-tests.yml`.

**Requisitos para CI:**
- Configurar secret `TEST_ADMIN_PASSWORD` en GitHub
- El workflow crea una base de datos PostgreSQL automáticamente

## Troubleshooting

### Error: Cannot connect to database

**Causa:** Variables de entorno incorrectas o base de datos no accesible.

**Solución:**
1. Verifica que `.env.test` tenga las credenciales correctas
2. Prueba la conexión con `psql` o un cliente PostgreSQL
3. Verifica que las tablas existan con los nombres correctos

### Error: ADMIN_PASSWORD is not set

**Causa:** Variable de entorno `ADMIN_PASSWORD` no está configurada.

**Solución:**
1. Verifica que `.env.test` tenga `ADMIN_PASSWORD` definido
2. Reinicia el servidor de desarrollo si está corriendo

### Tests fallan con timeout

**Causa:** El servidor de desarrollo no está corriendo o está lento.

**Solución:**
1. Asegúrate de que `npm run dev` esté corriendo
2. O descomenta `webServer` en `playwright.config.ts` para iniciar automáticamente
3. Aumenta el timeout en `playwright.config.ts` si es necesario

### Error: Table does not exist

**Causa:** Las tablas de prueba no existen en la base de datos.

**Solución:**
1. Ejecuta el SQL de creación de tablas (ver sección "Configurar base de datos de prueba")
2. Verifica que `TABLE_LEAD_CONTACTS` y `LIMIT_TABLE` en `.env.test` coincidan con los nombres de las tablas

### Browser not found

**Causa:** Los navegadores de Playwright no están instalados.

**Solución:**
```bash
npx playwright install chromium
```

## Mejores Prácticas

1. **No modificar datos de producción:** Siempre usa una base de datos de prueba separada
2. **Ejecutar tests localmente:** Antes de hacer push, ejecuta los tests localmente
3. **Verificar reportes:** Revisa el reporte HTML para entender fallos
4. **Usar Page Objects:** No uses selectores directos en los tests, usa los Page Objects
5. **Limpieza automática:** Los tests limpian la BD antes de cada ejecución

## Recursos

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Debugging Tests](https://playwright.dev/docs/debug)

## Contacto

Para dudas o problemas con los tests, contacta al equipo de desarrollo.
