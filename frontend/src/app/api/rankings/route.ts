import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rankings } from '@/lib/db-config'


// GET: Obtener todos los rankings
export async function GET() {
  try {
    const allRankings = await db.select().from(rankings)
    return NextResponse.json({ data: allRankings })
  } catch (error) {
    console.error('Error al obtener rankings:', error)
    return NextResponse.json({ error: 'Error al obtener rankings' }, { status: 500 })
  }
}

// POST: Crear un nuevo ranking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { usuario_id, modo_id, puntuacion } = body

    if (!usuario_id || !modo_id || puntuacion === undefined) {
      return NextResponse.json({ error: 'Faltan campos: usuario_id, modo_id, puntuacion' }, { status: 400 })
    }

    const newRanking = await db.insert(rankings).values({
      usuario_id,
      modo_id,
      puntuacion
    }).returning()

    return NextResponse.json({ message: 'Ranking creado', data: newRanking })
  } catch (error) {
    console.error('Error al crear ranking:', error)
    return NextResponse.json({ error: 'Error al crear ranking' }, { status: 500 })
  }
}
