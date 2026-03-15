import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

const LEAD_TABLE = process.env.TABLE_LEAD_CONTACTS
const LIMIT_TABLE = 'patients_limit'

export async function GET() {
  try {
    const [limitResult, countResult] = await Promise.all([
      pool.query(`SELECT limite FROM ${LIMIT_TABLE} ORDER BY id DESC LIMIT 1`),
      pool.query(`SELECT COUNT(*) as total FROM ${LEAD_TABLE}`),
    ])

    const limite = limitResult.rows[0]?.limite ?? 0
    const total = parseInt(countResult.rows[0]?.total ?? '0')

    return NextResponse.json({ limite: Number(limite), total })
  } catch (error) {
    console.error('Error fetching limit:', error)
    return NextResponse.json({ error: 'Error al obtener el límite' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { limite } = await req.json()

    if (limite === undefined || isNaN(Number(limite)) || Number(limite) < 0) {
      return NextResponse.json({ error: 'Límite inválido' }, { status: 400 })
    }

    // Upsert: si existe una fila la actualiza, si no la inserta
    const existing = await pool.query(`SELECT id FROM ${LIMIT_TABLE} ORDER BY id DESC LIMIT 1`)

    if (existing.rows.length > 0) {
      await pool.query(`UPDATE ${LIMIT_TABLE} SET limite = $1 WHERE id = $2`, [limite, existing.rows[0].id])
    } else {
      await pool.query(`INSERT INTO ${LIMIT_TABLE} (limite) VALUES ($1)`, [limite])
    }

    return NextResponse.json({ ok: true, limite: Number(limite) })
  } catch (error) {
    console.error('Error updating limit:', error)
    return NextResponse.json({ error: 'Error al actualizar el límite' }, { status: 500 })
  }
}
