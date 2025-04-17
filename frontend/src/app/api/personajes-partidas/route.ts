import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { personajesPartida } from '@/lib/db-config'


// GET: Obtener todos los personajes de partida
export async function GET() {
  try {
    const allPersonajesPartida = await db.select().from(personajesPartida)
    return NextResponse.json({ data: allPersonajesPartida })
  } catch (error) {
    console.error('Error al obtener personajes de partida:', error)
    return NextResponse.json({ error: 'Error al obtener personajes de partida' }, { status: 500 })
  }
}

// POST: Crear un personaje en partida
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { partida_id, personaje_id, orden_asignado, es_correcto } = body

    if (!partida_id || !personaje_id) {
      return NextResponse.json({ error: 'Faltan campos obligatorios: partida_id, personaje_id' }, { status: 400 })
    }

    const newPersonajePartida = await db.insert(personajesPartida).values({
      partida_id,
      personaje_id,
      orden_asignado,
      es_correcto
    }).returning()

    return NextResponse.json({ message: 'Personaje de partida creado', data: newPersonajePartida })
  } catch (error) {
    console.error('Error al crear personaje de partida:', error)
    return NextResponse.json({ error: 'Error al crear personaje de partida' }, { status: 500 })
  }
}
