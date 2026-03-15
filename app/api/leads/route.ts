import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// Obtenemos el nombre de la tabla de la variable de entorno
const TABLE_NAME = process.env.TABLE_LEAD_CONTACTS

export async function GET() {
  try {
    // Usamos template literals para inyectar el nombre de la tabla
    const { rows } = await pool.query(
      `SELECT * FROM ${TABLE_NAME} ORDER BY created_at DESC`
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Error al obtener los registros' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, telefono, cedula, edad } = await req.json()

    if (!nombre || !telefono || !cedula || !edad) {
      return NextResponse.json(
        { error: 'Nombre, teléfono, cédula y edad son requeridos' },
        { status: 400 }
      )
    }

    const { rows } = await pool.query(
      `INSERT INTO ${TABLE_NAME} (nombre, telefono, cedula, edad)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, telefono, cedula, edad]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Error al guardar el registro' },
      { status: 500 }
    )
  }
}