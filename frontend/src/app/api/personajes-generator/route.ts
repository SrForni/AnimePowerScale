import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const animeName = searchParams.get('anime')
  const cantidadParam = searchParams.get('cantidad')
  const cantidad = parseInt(cantidadParam || '0')

  if (!animeName || isNaN(cantidad) || cantidad <= 0) {
    return NextResponse.json(
      { error: 'Parámetros "anime" y "cantidad" son obligatorios y válidos.' },
      { status: 400 }
    )
  }

  try {
    // GraphQL Query
    const query = `
      query ($search: String, $perPage: Int) {
        Media(search: $search, type: ANIME) {
          characters(perPage: $perPage, sort: [ROLE, RELEVANCE, FAVOURITES_DESC]) {
            edges {
              node {
                name {
                  full
                }
              }
            }
          }
        }
      }
    `

    const variables = {
      search: animeName,
      perPage: 30,
    }

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    })

    const data = await response.json()

    const nombres = data.data.Media.characters.edges
      .map((char: any) => char.node.name.full)
      .filter((nombre: string) => nombre.includes(' ')) // Asegurarse de que tenga nombre + apellido

    if (nombres.length === 0) {
      return NextResponse.json({ error: 'No se encontraron personajes relevantes.' }, { status: 404 })
    }

    const seleccionados = nombres
      .sort(() => Math.random() - 0.5)
      .slice(0, cantidad)

    return NextResponse.json(seleccionados)
  } catch (error) {
    console.error('⛔ Error al obtener personajes de AniList:', error)
    return NextResponse.json({ error: 'Error al obtener personajes desde AniList.' }, { status: 500 })
  }
}
