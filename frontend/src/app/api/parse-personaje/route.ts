import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { personajes } from '@/lib/db-config'
import { eq } from 'drizzle-orm'
import axios from 'axios'
import * as cheerio from 'cheerio'

const excludedTerms = [
  'Verse', 'Arc', 'Saga', 'Movie', 'Techniques', 'Abilities',
  'Forms', 'Transformations', 'Statistics', 'Equipment', 'Gallery', 'Netflix', 'Category:', 'Ultimate'
]

function normalizeText(text) {
  return text.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/gi, '').trim()
}

function invertirNombreSiAplica(nombre) {
  const partes = nombre.trim().split(/\s+/)
  return partes.length === 2 ? `${partes[1]} ${partes[0]}` : null
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function obtenerImagenDesdeAniList(nombre) {
  try {
    const response = await axios.post('https://graphql.anilist.co', {
      query: `
        query ($search: String) {
          Character(search: $search) {
            image {
              large
              medium
            }
          }
        }
      `,
      variables: { search: nombre },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    return response.data?.data?.Character?.image?.large || null
  } catch (error) {
    console.error('⨯ Error buscando imagen en AniList:', error)
    return null
  }
}

const MAX_RETRIES = 3

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const nombre = searchParams.get('nombre')

  if (!nombre) {
    return NextResponse.json({ error: 'Parámetro "nombre" es requerido' }, { status: 400 })
  }

  console.log('🔍 Buscando personaje:', nombre)

  const intentos = [nombre]
  const invertido = invertirNombreSiAplica(nombre)
  if (invertido) intentos.push(invertido)

  try {
    for (const intento of intentos) {
      const searchResponse = await axios.get('https://vsbattles.fandom.com/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: intento,
          format: 'json',
        },
      })

      const searchResults = searchResponse.data.query.search.map((result) => result.title)
      console.log('🔍 Resultados de búsqueda:', searchResults)

      const filteredResults = searchResults.filter((title) => {
        const noExcluded = !excludedTerms.some(term =>
          title.toLowerCase().includes(term.toLowerCase())
        )

        const partesIntento = intento.trim().split(/\s+/)

        if (partesIntento.length === 2) {
          const tituloLimpio = title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/gi, '')
            .split(/\s+/)

          const todasPresentes = partesIntento.every(palabra =>
            tituloLimpio.some(p => p.includes(palabra.toLowerCase()))
          )

          return noExcluded && todasPresentes
        } else {
          const palabras = normalizeText(intento).split(' ')
          const tituloNormalizado = normalizeText(title)

          const todasPresentes = palabras.every(palabra =>
            tituloNormalizado.includes(palabra)
          )

          return noExcluded && todasPresentes
        }
      })

      console.log('✅ Resultados filtrados:', filteredResults)

      if (filteredResults.length === 0) continue

      const processCandidate = async (candidate) => {
        const wikiUrl = `https://vsbattles.fandom.com/api.php?action=parse&page=${encodeURIComponent(candidate)}&format=json`

        const existingPersonaje = await db.query.personajes.findFirst({
          where: eq(personajes.url_wiki, wikiUrl),
        })

        if (existingPersonaje) {
          console.log('✅ Personaje encontrado en la base de datos')
          return existingPersonaje
        }

        const detailResponse = await axios.get(wikiUrl)
        const html = detailResponse.data.parse.text['*']
        const $ = cheerio.load(html)

        let tier = 'No especificado'
        $('a[title="Tiering System"]').each((_, el) => {
          const parent = $(el).closest('p')
          const rawText = parent.text()
          const match = rawText.match(/Tier:\s*(.+)/i)
          if (match) {
            tier = match[1].trim()
          }
        })

        let imageUrl =
          $('figure a img').first().attr('src') ||
          $('.pi-image-thumbnail img').first().attr('src') ||
          null

        const isEmptyImage = imageUrl?.startsWith('data:image') || imageUrl?.includes('base64')
        if (!imageUrl || isEmptyImage) {
          console.log('🔄 Imagen inválida en VS Battles, buscando en AniList...')
          imageUrl = await obtenerImagenDesdeAniList(candidate)
        }

        console.log('🔍 Tier encontrado:', tier)
        console.log('🔍 Imagen encontrada:', imageUrl)

        if (!tier || tier === 'No especificado') return null

        const newPersonaje = await db.insert(personajes).values({
          nombre: candidate,
          anime: 'Desconocido',
          tier,
          url_wiki: wikiUrl,
          imagen_url: imageUrl,
        }).returning()

        console.log('✅ Personaje guardado en la base de datos')
        return newPersonaje[0]
      }

      let retries = 0
      let result = null
      const candidates = [...filteredResults]

      while (retries < MAX_RETRIES && candidates.length > 0) {
        const randomIndex = Math.floor(Math.random() * candidates.length)
        const selectedCandidate = candidates.splice(randomIndex, 1)[0]

        console.log('✨ Probando candidato:', selectedCandidate)

        result = await processCandidate(selectedCandidate)

        if (result) break

        retries++
        if (retries < MAX_RETRIES) {
          console.log(`🔄 Retry ${retries}/${MAX_RETRIES}...`)
          await sleep(1000)
        }
      }

      if (result) return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'No se pudo obtener información válida del personaje' }, { status: 404 })
  } catch (error) {
    console.error('⨯ Error general:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
