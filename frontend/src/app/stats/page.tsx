'use client'

import { useEffect, useState } from 'react'
import { BarChart2, Trophy, XCircle } from 'lucide-react'

interface Partida {
  nombre_anime: string
  numero_casillas: number
  puntuacion: number
}

interface EstadisticaModo {
  nombre_anime: string
  numero_casillas: number
  jugadas: number
  victorias: number
  winrate: number
}

export default function StatsPage() {
  const [estadisticas, setEstadisticas] = useState<EstadisticaModo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPartidas() {
      try {
        const res = await fetch('http://localhost:3000/api/partidas')
        const json = await res.json()
        const data: Partida[] = json.data || []

        // Agrupar partidas por modo (anime + dificultad)
        const mapa: Record<string, EstadisticaModo> = {}

        data.forEach((p) => {
          const clave = `${p.nombre_anime}-${p.numero_casillas}`
          if (!mapa[clave]) {
            mapa[clave] = {
              nombre_anime: p.nombre_anime,
              numero_casillas: p.numero_casillas,
              jugadas: 0,
              victorias: 0,
              winrate: 0,
            }
          }

          mapa[clave].jugadas++
          if (p.puntuacion === 1) mapa[clave].victorias++
        })

        const lista = Object.values(mapa).map((modo) => ({
          ...modo,
          winrate: modo.jugadas > 0 ? Math.round((modo.victorias / modo.jugadas) * 100) : 0,
        }))

        setEstadisticas(lista.sort((a, b) => b.winrate - a.winrate))
      } catch (error) {
        console.error('Error al obtener estadísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartidas()
  }, [])

  const getDificultad = (n: number) => {
    switch (n) {
      case 5: return 'Fácil'
      case 7: return 'Media'
      case 9: return 'Difícil'
      default: return `${n} casillas`
    }
  }

  return (
    <div className="w-full h-full px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BarChart2 className="h-7 w-7 text-indigo-400" />
        Estadísticas Personales
      </h1>

      {loading ? (
        <p className="text-gray-400">Cargando estadísticas...</p>
      ) : estadisticas.length === 0 ? (
        <p className="text-gray-500">Aún no has jugado ninguna partida.</p>
      ) : (
        <div className="space-y-4">
          {estadisticas.map((modo) => (
            <div
              key={`${modo.nombre_anime}-${modo.numero_casillas}`}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{modo.nombre_anime}</h2>
                  <p className="text-sm text-gray-400">Dificultad: {getDificultad(modo.numero_casillas)}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">Jugadas: {modo.jugadas}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <Trophy className="w-4 h-4" /> {modo.victorias}
                  </p>
                  <p className="text-sm text-yellow-400">
                    Winrate: <span className="font-bold">{modo.winrate}%</span>
                  </p>
                </div>
              </div>

              <div className="mt-3 h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${modo.winrate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
