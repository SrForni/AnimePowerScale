import {
  pgTable,
  text,
  integer,
  timestamp,
  serial,
  boolean,
  primaryKey
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

// -----------------------------
// NextAuth Tables
// -----------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified'),
  password: text('password'),
  image: text('image'),
  nombre_usuario: text('nombre_usuario').notNull().unique(),
  fecha_registro: timestamp('fecha_registro').defaultNow()
})

export const account = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').$type<'oauth'>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  (account) => ({
    pk: primaryKey(account.provider, account.providerAccountId)
  })
)

export const session = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull()
})

export const verificationToken = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  (vt) => ({
    pk: primaryKey(vt.identifier, vt.token)
  })
)

// -----------------------------
// Personalizado: tu esquema
// -----------------------------

export const modos = pgTable('modos', {
  id: serial('id').primaryKey(),
  nombre_anime: text('nombre_anime').notNull(),
  numero_casillas: integer('numero_casillas').notNull()
})

export const personajes = pgTable('personajes', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  anime: text('anime').notNull(),
  tier: text('tier').notNull(),
  url_wiki: text('url_wiki').notNull(),
  imagen_url: text('imagen_url')
})

export const partidas = pgTable('partidas', {
  id: serial('id').primaryKey(),
  usuario_id: text('usuario_id').references(() => user.id),
  modo_id: integer('modo_id').references(() => modos.id),
  fecha: timestamp('fecha').defaultNow(),
  puntuacion: integer('puntuacion')
})

export const personajesPartida = pgTable('personajes_partida', {
  id: serial('id').primaryKey(),
  partida_id: integer('partida_id').references(() => partidas.id),
  personaje_id: integer('personaje_id').references(() => personajes.id),
  orden_asignado: integer('orden_asignado'),
  es_correcto: boolean('es_correcto')
})

export const rankings = pgTable('rankings', {
  id: serial('id').primaryKey(),
  usuario_id: text('usuario_id').references(() => user.id),
  modo_id: integer('modo_id').references(() => modos.id),
  puntuacion: integer('puntuacion'),
  fecha: timestamp('fecha').defaultNow()
})

// -----------------------------
// INSERT SCHEMAS (opcional)
// -----------------------------

export const insertUserSchema = createInsertSchema(user)
export const insertModoSchema = createInsertSchema(modos)
export const insertPersonajeSchema = createInsertSchema(personajes)
export const insertPartidaSchema = createInsertSchema(partidas)
export const insertPersonajePartidaSchema = createInsertSchema(personajesPartida)
export const insertRankingSchema = createInsertSchema(rankings)
