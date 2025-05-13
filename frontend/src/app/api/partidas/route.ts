import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { partidas, modos, user } from '@/lib/db-config'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const data = await db
      .select({
        id: partidas.id,
        usuario_id: partidas.usuario_id,
        nombre_usuario: user.nombre_usuario,
        nombre_anime: modos.nombre_anime,
        numero_casillas: modos.numero_casillas,
        puntuacion: partidas.puntuacion,
        fecha: partidas.fecha,
      })
      .from(partidas)
      .leftJoin(modos, eq(partidas.modo_id, modos.id))
      .leftJoin(user, eq(partidas.usuario_id, user.id))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error al obtener partidas:', error)
    return NextResponse.json({ error: 'Error al obtener partidas' }, { status: 500 })
  }
}
// POST: Crear una nueva partida
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('🛠️ POST /api/partidas - Body recibido:', body) // 👈 AÑADE ESTO
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
