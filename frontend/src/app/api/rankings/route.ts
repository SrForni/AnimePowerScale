import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { partidas, modos, user } from '@/lib/db-config'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allPartidas = await db
      .select({
        id: partidas.id,
        usuario_id: partidas.usuario_id,
        nombre_usuario: user.nombre_usuario,
        nombre_anime: modos.nombre_anime,
        numero_casillas: modos.numero_casillas,
        fecha: partidas.fecha,
        puntuacion: partidas.puntuacion
      })
      .from(partidas)
      .leftJoin(modos, eq(partidas.modo_id, modos.id))
      .leftJoin(user, eq(partidas.usuario_id, user.id)) // 👈 esto es lo nuevo

    return NextResponse.json({ data: allPartidas })
  } catch (error) {
    console.error('Error al obtener partidas:', error)
    return NextResponse.json({ error: 'Error al obtener partidas' }, { status: 500 })
  }
}

