-- Script para crear tablas de prueba en Supabase
-- Ejecuta este SQL en tu proyecto Supabase

-- Tabla de leads de prueba
CREATE TABLE IF NOT EXISTS prod_contact_lead_123_test (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(50) NOT NULL,
  cedula VARCHAR(50),
  edad VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de límite de pacientes de prueba
CREATE TABLE IF NOT EXISTS patients_limit_prod_123_test (
  id SERIAL PRIMARY KEY,
  limite INTEGER NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verificar que las tablas se crearon
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('prod_contact_lead_123_test', 'patients_limit_prod_123_test');

-- Opcional: Limpiar datos si existen
TRUNCATE TABLE prod_contact_lead_123_test RESTART IDENTITY CASCADE;
TRUNCATE TABLE patients_limit_prod_123_test RESTART IDENTITY CASCADE;

-- Insertar límite inicial
INSERT INTO patients_limit_prod_123_test (limite) VALUES (50);
