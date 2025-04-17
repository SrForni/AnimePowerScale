import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { partidas } from '@/lib/db-config'


// GET: Obtener todas las partidas
export async function GET() {
  try {
    const allPartidas = await db.select().from(partidas)
    return NextResponse.json({ data: allPartidas })
  } catch (error) {
    console.error('Error al obtener partidas:', error)
    return NextResponse.json({ error: 'Error al obtener partidas' }, { status: 500 })
  }
}

// POST: Crear una nueva partida
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { usuario_id, modo_id, puntuacion } = body

    if (!usuario_id || !modo_id || puntuacion === undefined) {
      return NextResponse.json({ error: 'Faltan campos: usuario_id, modo_id, puntuacion' }, { status: 400 })
    }

    const newPartida = await db.insert(partidas).values({
      usuario_id,
      modo_id,
      puntuacion
    }).returning()

    return NextResponse.json({ message: 'Partida creada', data: newPartida })
  } catch (error) {
    console.error('Error al crear partida:', error)
    return NextResponse.json({ error: 'Error al crear partida' }, { status: 500 })
  }
}
