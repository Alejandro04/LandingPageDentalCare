import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM lead_contacts ORDER BY created_at DESC'
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
    const { nombre, telefono, cedula } = await req.json()

    if (!nombre || !telefono || !cedula) {
      return NextResponse.json(
        { error: 'Nombre, teléfono y cédula son requeridos' },
        { status: 400 }
      )
    }

    const { rows } = await pool.query(
      `INSERT INTO lead_contacts (nombre, telefono, cedula)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, telefono, cedula]
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
