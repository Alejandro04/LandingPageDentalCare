import { pool } from '@/lib/db';

/**
 * Database Utilities for E2E Tests
 *
 * These functions provide a clean API for managing test database state.
 * All functions use environment variables to determine table names.
 */

/**
 * Clear all leads from the test database
 */
export async function clearLeads(): Promise<void> {
  const tableName = process.env.TABLE_LEAD_CONTACTS;
  if (!tableName) {
    throw new Error('TABLE_LEAD_CONTACTS environment variable is not set');
  }

  await pool.query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
}

/**
 * Clear the patient limit table
 */
export async function clearLimit(): Promise<void> {
  const tableName = process.env.LIMIT_TABLE;
  if (!tableName) {
    throw new Error('LIMIT_TABLE environment variable is not set');
  }

  await pool.query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
}

/**
 * Set the patient appointment limit
 * Uses upsert pattern: if limit exists, update; otherwise insert
 *
 * @param limit - The new limit (0 to disable limiting)
 */
export async function setPatientLimit(limit: number): Promise<void> {
  const tableName = process.env.LIMIT_TABLE;
  if (!tableName) {
    throw new Error('LIMIT_TABLE environment variable is not set');
  }

  // Clear existing limit first
  await clearLimit();

  // Insert new limit
  await pool.query(
    `INSERT INTO ${tableName} (limite) VALUES ($1)`,
    [limit]
  );
}

/**
 * Insert a lead into the test database
 *
 * @param data - Lead data (cedula and email are optional)
 * @returns The inserted lead record
 */
export async function insertLead(data: {
  nombre: string;
  email?: string;
  telefono: string;
  cedula?: string;
  edad: string;
  created_at?: Date;
}): Promise<any> {
  const tableName = process.env.TABLE_LEAD_CONTACTS;
  if (!tableName) {
    throw new Error('TABLE_LEAD_CONTACTS environment variable is not set');
  }

  const { rows } = await pool.query(
    `INSERT INTO ${tableName}
     (nombre, email, telefono, cedula, edad, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.nombre,
      data.email ?? null,
      data.telefono,
      data.cedula ?? null,
      data.edad,
      data.created_at ?? new Date(),
    ]
  );

  return rows[0];
}

/**
 * Insert multiple leads in bulk
 *
 * @param leads - Array of lead data
 * @returns Array of inserted lead records
 */
export async function insertLeads(
  leads: Array<{
    nombre: string;
    email?: string;
    telefono: string;
    cedula?: string;
    edad: string;
    created_at?: Date;
  }>
): Promise<any[]> {
  const insertedLeads: any[] = [];

  for (const lead of leads) {
    const inserted = await insertLead(lead);
    insertedLeads.push(inserted);
  }

  return insertedLeads;
}

/**
 * Get the total count of leads in the database
 *
 * @returns The number of leads
 */
export async function getLeadCount(): Promise<number> {
  const tableName = process.env.TABLE_LEAD_CONTACTS;
  if (!tableName) {
    throw new Error('TABLE_LEAD_CONTACTS environment variable is not set');
  }

  const { rows } = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
  return parseInt(rows[0].count, 10);
}

/**
 * Get leads created today
 *
 * @returns The number of leads created today
 */
export async function getTodayLeadCount(): Promise<number> {
  const tableName = process.env.TABLE_LEAD_CONTACTS;
  if (!tableName) {
    throw new Error('TABLE_LEAD_CONTACTS environment variable is not set');
  }

  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM ${tableName}
     WHERE DATE(created_at) = CURRENT_DATE`
  );
  return parseInt(rows[0].count, 10);
}

/**
 * Get the current patient limit
 *
 * @returns The current limit, or null if no limit is set
 */
export async function getCurrentLimit(): Promise<number | null> {
  const tableName = process.env.LIMIT_TABLE;
  if (!tableName) {
    throw new Error('LIMIT_TABLE environment variable is not set');
  }

  const { rows } = await pool.query(
    `SELECT limite FROM ${tableName} LIMIT 1`
  );

  return rows.length > 0 ? rows[0].limite : null;
}

/**
 * Find a lead by specific criteria
 *
 * @param criteria - Search criteria
 * @returns The matching lead or null
 */
export async function findLead(criteria: {
  nombre?: string;
  email?: string;
  telefono?: string;
  cedula?: string;
}): Promise<any | null> {
  const tableName = process.env.TABLE_LEAD_CONTACTS;
  if (!tableName) {
    throw new Error('TABLE_LEAD_CONTACTS environment variable is not set');
  }

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (criteria.nombre !== undefined) {
    conditions.push(`nombre = $${paramIndex++}`);
    values.push(criteria.nombre);
  }
  if (criteria.email !== undefined) {
    conditions.push(`email = $${paramIndex++}`);
    values.push(criteria.email);
  }
  if (criteria.telefono !== undefined) {
    conditions.push(`telefono = $${paramIndex++}`);
    values.push(criteria.telefono);
  }
  if (criteria.cedula !== undefined) {
    conditions.push(`cedula = $${paramIndex++}`);
    values.push(criteria.cedula);
  }

  if (conditions.length === 0) {
    throw new Error('At least one search criterion is required');
  }

  const { rows } = await pool.query(
    `SELECT * FROM ${tableName} WHERE ${conditions.join(' AND ')} LIMIT 1`,
    values
  );

  return rows.length > 0 ? rows[0] : null;
}

/**
 * Reset database to clean state for testing
 * Clears all leads and sets default patient limit to 50
 */
export async function resetDatabase(): Promise<void> {
  await clearLeads();
  await setPatientLimit(50);
}
