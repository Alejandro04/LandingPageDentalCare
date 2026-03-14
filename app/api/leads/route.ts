import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const leads = await prisma.leadContact.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(leads)
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
    const body = await req.json()
    const { nombre, telefono, cedula } = body

    if (!nombre || !telefono || !cedula) {
      return NextResponse.json(
        { error: 'Nombre, teléfono y cédula son requeridos' },
        { status: 400 }
      )
    }

    const lead = await prisma.leadContact.create({
      data: { nombre, telefono, cedula },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Error al guardar el registro' },
      { status: 500 }
    )
  }
}
