import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/lib/db-config';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, nombre_usuario } = body;

    if (!name || !email || !password || !nombre_usuario) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Comprobar si ya existe el email
    const existingEmail = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: 'El correo ya está registrado' },
        { status: 400 }
      );
    }

    // Comprobar si ya existe el nombre de usuario
    const existingUsername = await db
      .select()
      .from(user)
      .where(eq(user.nombre_usuario, nombre_usuario));

    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya está en uso' },
        { status: 400 }
      );
    }

    // Insertar nuevo usuario (sin hashear la contraseña de momento)
    await db.insert(user).values({
      id: uuidv4(),
      name,
      email,
      password, // ¡No recomendado en producción sin hash!
      nombre_usuario,
      fecha_registro: new Date(),
      emailVerified: null,
      image: null,
    });

    return NextResponse.json(
      { message: 'Usuario creado correctamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor' },
      { status: 500 }
    );
  }
}
