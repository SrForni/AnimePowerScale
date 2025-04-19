'use client'

import { useEffect, useState } from 'react'

interface Partida {
  usuario_id: string
  nombre_usuario: string
  nombre_anime: string
  numero_casillas: number
  puntuacion: number
}

interface EntradaRanking {
  usuario_id: string
  nombre_usuario: string
  victorias: number
  nombre_anime: string
  numero_casillas: number
}

export default function RankingsPage() {
  const [partidas, setPartidas] = useState<Partida[]>([])
  const [ranking, setRanking] = useState<EntradaRanking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPartidas() {
      try {
        const res = await fetch('http://localhost:3000/api/partidas')
        const json = await res.json()
        const data: Partida[] = json.data || []

        // Agrupar por usuario y modo
        const agrupado: Record<string, EntradaRanking> = {}

        data.forEach((p) => {
          if (p.puntuacion === 1) {
            const clave = `${p.usuario_id}-${p.nombre_anime}-${p.numero_casillas}`

            if (!agrupado[clave]) {
              agrupado[clave] = {
                usuario_id: p.usuario_id,
                nombre_usuario: p.nombre_usuario,
                victorias: 1,
                nombre_anime: p.nombre_anime,
                numero_casillas: p.numero_casillas,
              }
            } else {
              agrupado[clave].victorias++
            }
          }
        })

        const ordenado = Object.values(agrupado).sort((a, b) => b.victorias - a.victorias)
        setRanking(ordenado)
      } catch (err) {
        console.error('Error al obtener partidas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPartidas()
  }, [])

  return (
    <div className="w-full h-full px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Ranking Global</h1>

      {loading ? (
        <p className="text-gray-300">Cargando ranking...</p>
      ) : ranking.length === 0 ? (
        <p className="text-gray-400">No hay partidas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-700 text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 border border-gray-700">Usuario</th>
                <th className="px-4 py-2 border border-gray-700">Anime</th>
                <th className="px-4 py-2 border border-gray-700">Dificultad</th>
                <th className="px-4 py-2 border border-gray-700">Victorias</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r) => (
                <tr key={`${r.usuario_id}-${r.nombre_anime}-${r.numero_casillas}`} className="hover:bg-gray-800">
                  <td className="px-4 py-2 border border-gray-700">{r.nombre_usuario || r.usuario_id}</td>
                  <td className="px-4 py-2 border border-gray-700">{r.nombre_anime}</td>
                  <td className="px-4 py-2 border border-gray-700">{r.numero_casillas}</td>
                  <td className="px-4 py-2 border border-gray-700 font-semibold">{r.victorias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
