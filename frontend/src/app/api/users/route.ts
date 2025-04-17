import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user } from '@/lib/db-config'


// GET: Obtener todos los usuarios personalizados
export async function GET() {
  try {
    const allUsers = await db.select().from(user)

    return NextResponse.json({ data: allUsers })
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}
