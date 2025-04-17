import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { personajes } from '@/lib/db-config';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Lista de términos prohibidos
const excludedTerms = [
  'Verse', 'Arc', 'Saga', 'Movie', 'Techniques', 'Abilities',
  'Forms', 'Transformations', 'Statistics', 'Equipment', 'Gallery', 'Netflix', 'Category:'
];

// Utilidad para limpiar y comparar nombres
function normalizeText(text: string) {
  return text.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/gi, '').trim();
}

// Sleep para retry
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry máximo
const MAX_RETRIES = 3;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get('nombre');

  if (!nombre) {
    return NextResponse.json({ error: 'Parámetro "nombre" es requerido' }, { status: 400 });
  }

  console.log('🔍 Buscando personaje:', nombre);

  try {
    // Paso 1: Búsqueda inicial
    const searchResponse = await axios.get('https://vsbattles.fandom.com/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: nombre,
        format: 'json',
      },
    });

    const searchResults = searchResponse.data.query.search.map((result: any) => result.title);
    console.log('🔍 Resultados de búsqueda:', searchResults);

    // Paso 2: Filtrar resultados no deseados
    const filteredResults = searchResults.filter((title: string) => {
      const lowerTitle = title.toLowerCase();
      const lowerNombre = nombre.toLowerCase();

      const noExcluded = !excludedTerms.some(term => lowerTitle.includes(term.toLowerCase()));
      const matchesName = normalizeText(title).includes(normalizeText(nombre));

      return noExcluded && matchesName;
    });

    console.log('✅ Resultados filtrados:', filteredResults);

    if (filteredResults.length === 0) {
      return NextResponse.json({ error: 'No se encontraron personajes válidos' }, { status: 404 });
    }

    // Función para procesar candidato (para usar en retries)
    const processCandidate = async (candidate: string): Promise<any | null> => {
      const wikiUrl = `https://vsbattles.fandom.com/api.php?action=parse&page=${encodeURIComponent(candidate)}&format=json`;

      // Paso 3: Verificar si ya existe en la base de datos
      const existingPersonaje = await db.query.personajes.findFirst({
        where: eq(personajes.url_wiki, wikiUrl),
      });

      if (existingPersonaje) {
        console.log('✅ Personaje encontrado en la base de datos');
        return existingPersonaje;
      }

      // Paso 4: Extraer datos desde la API
      const detailResponse = await axios.get(wikiUrl);
      const html = detailResponse.data.parse.text['*'];
      const $ = cheerio.load(html);

      // Extraer tier
      let tier = 'No especificado';
      $('a[title="Tiering System"]').each((_, el) => {
        const parent = $(el).closest('p');
        const rawText = parent.text();
        const match = rawText.match(/Tier:\s*(.+)/i);
        if (match) {
          tier = match[1].trim();
        }
      });

      // Extraer imagen
      const imageUrl = $('figure a img').first().attr('src') || null;

      console.log('🔍 Tier encontrado:', tier);
      console.log('🔍 Imagen encontrada:', imageUrl);

      // Si no se encontró tier, devolver null para retry
      if (!tier || tier === 'No especificado') return null;

      // Paso 5: Guardar en base de datos
      const newPersonaje = await db.insert(personajes).values({
        nombre: candidate,
        anime: 'Desconocido', // Por ahora como hablamos, lo dejamos como placeholder
        tier,
        url_wiki: wikiUrl,
        imagen_url: imageUrl,
      }).returning();

      console.log('✅ Personaje guardado en la base de datos');
      return newPersonaje[0];
    };

    // Paso 6: Intentar procesar candidatos con retry
    let retries = 0;
    let result = null;

    const candidates = [...filteredResults];

    while (retries < MAX_RETRIES && candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const selectedCandidate = candidates.splice(randomIndex, 1)[0];

      console.log('✨ Probando candidato:', selectedCandidate);

      result = await processCandidate(selectedCandidate);

      if (result) break;

      retries++;
      if (retries < MAX_RETRIES) {
        console.log(`🔄 Retry ${retries}/${MAX_RETRIES}...`);
        await sleep(1000); // Espera de 1s entre intentos
      }
    }

    if (!result) {
      return NextResponse.json({ error: 'No se pudo obtener información válida del personaje' }, { status: 404 });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('⨯ Error general:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
