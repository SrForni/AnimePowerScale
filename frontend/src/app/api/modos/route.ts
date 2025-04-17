import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { modos } from '@/lib/db-config'


// GET: Obtener todos los modos
export async function GET() {
  try {
    const allModos = await db.select().from(modos)
    return NextResponse.json({ data: allModos })
  } catch (error) {
    console.error('Error al obtener modos:', error)
    return NextResponse.json({ error: 'Error al obtener modos' }, { status: 500 })
  }
}

// POST: Crear un nuevo modo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre_anime, numero_casillas } = body

    if (!nombre_anime || numero_casillas === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios: nombre_anime, numero_casillas' }, { status: 400 })
    }

    const newModo = await db.insert(modos).values({
      nombre_anime,
      numero_casillas
    }).returning()

    return NextResponse.json({ message: 'Modo creado', data: newModo })
  } catch (error) {
    console.error('Error al crear modo:', error)
    return NextResponse.json({ error: 'Error al crear modo' }, { status: 500 })
  }
}
