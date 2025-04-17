import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { personajes } from '@/lib/db-config'


// GET: Obtener todos los personajes
export async function GET() {
  try {
    const allPersonajes = await db.select().from(personajes)

    return NextResponse.json({ data: allPersonajes })
  } catch (error) {
    console.error('Error al obtener personajes:', error)
    return NextResponse.json({ error: 'Error al obtener personajes' }, { status: 500 })
  }
}

// POST: Crear un nuevo personaje
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validación rápida (puedes mejorarla con zod si quieres)
    const { nombre, anime, tier, url_wiki, imagen_url } = body

    if (!nombre || !anime || !tier || !url_wiki) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, anime, tier, url_wiki' },
        { status: 400 }
      )
    }

    const newPersonaje = await db.insert(personajes).values({
      nombre,
      anime,
      tier,
      url_wiki,
      imagen_url // opcional, puede ser undefined
    }).returning()

    return NextResponse.json({ message: 'Personaje creado', data: newPersonaje })
  } catch (error) {
    console.error('Error al crear personaje:', error)
    return NextResponse.json({ error: 'Error al crear personaje' }, { status: 500 })
  }
}
