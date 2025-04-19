"use client"

import { useEffect, useState } from "react"
import { Medal, Trophy, Award, Loader2, Users, Filter, Gamepad2 } from "lucide-react"

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

// Map anime names to their theme colors
const animeColors: Record<string, { bg: string; text: string; border: string; light: string }> = {
  Naruto: {
    bg: "bg-orange-600",
    text: "text-orange-100",
    border: "border-orange-500",
    light: "bg-orange-500/10",
  },
  "One Piece": {
    bg: "bg-blue-600",
    text: "text-blue-100",
    border: "border-blue-500",
    light: "bg-blue-500/10",
  },
  Bleach: {
    bg: "bg-purple-600",
    text: "text-purple-100",
    border: "border-purple-500",
    light: "bg-purple-500/10",
  },
  "Dragon Ball": {
    bg: "bg-yellow-600",
    text: "text-yellow-100",
    border: "border-yellow-500",
    light: "bg-yellow-500/10",
  },
  // Default fallback
  default: {
    bg: "bg-gray-600",
    text: "text-gray-100",
    border: "border-gray-500",
    light: "bg-gray-500/10",
  },
}

// Helper function to get difficulty text
const getDifficultyText = (casillas: number) => {
  switch (casillas) {
    case 5:
      return "Fácil"
    case 7:
      return "Media"
    case 8:
      return "Difícil"
    default:
      return `${casillas} casillas`
  }
}

// Helper function to get medal component
const getMedalIcon = (position: number) => {
  switch (position) {
    case 0:
      return <Trophy className="h-6 w-6 text-yellow-400" />
    case 1:
      return <Medal className="h-6 w-6 text-gray-300" />
    case 2:
      return <Medal className="h-6 w-6 text-amber-600" />
    default:
      return <span className="text-lg font-bold text-gray-400">{position + 1}</span>
  }
}

export default function RankingsPage() {
  const [partidas, setPartidas] = useState<Partida[]>([])
  const [ranking, setRanking] = useState<EntradaRanking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null)

  useEffect(() => {
    async function fetchPartidas() {
      try {
        const res = await fetch("http://localhost:3000/api/partidas")
        const json = await res.json()
        const data: Partida[] = json.data || []
        setPartidas(data)
        processRanking(data)
      } catch (err) {
        console.error("Error al obtener partidas:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPartidas()
  }, [])

  useEffect(() => {
    processRanking(partidas)
  }, [filter, partidas, difficultyFilter])

  const processRanking = (data: Partida[]) => {
    // Agrupar por usuario y modo
    const agrupado: Record<string, EntradaRanking> = {}

    data.forEach((p) => {
      if (p.puntuacion === 1) {
        // Apply filters if set
        if (filter && p.nombre_anime !== filter) return
        if (difficultyFilter && p.numero_casillas !== difficultyFilter) return

        const clave = `${p.usuario_id}-${p.nombre_anime}-${p.numero_casillas}`

        if (!agrupado[clave]) {
          agrupado[clave] = {
            usuario_id: p.usuario_id,
            nombre_usuario: p.nombre_usuario || "Jugador Anónimo",
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
  }

  // Get unique anime names for filter
  const animeOptions = Array.from(new Set(partidas.map((p) => p.nombre_anime))).filter(Boolean)

  const difficultyOptions = [5, 7, 8]


  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-400" />
            Ranking Global
          </h1>

          {animeOptions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  className="bg-transparent border-none focus:ring-0 text-gray-300"
                  value={filter || ""}
                  onChange={(e) => setFilter(e.target.value || null)}
                >
                  <option value="">Todos los animes</option>
                  {animeOptions.map((anime) => (
                    <option key={anime} value={anime}>
                      {anime}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg">
                <Gamepad2 className="h-4 w-4 text-gray-400" />
                <select
                  className="bg-transparent border-none focus:ring-0 text-gray-300"
                  value={difficultyFilter?.toString() || ""}
                  onChange={(e) => setDifficultyFilter(e.target.value ? Number.parseInt(e.target.value) : null)}
                >
                  <option value="">Todas las dificultades</option>
                  {difficultyOptions.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {getDifficultyText(difficulty)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
            <p className="text-xl text-gray-300">Cargando ranking global...</p>
          </div>
        ) : ranking.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-10 text-center">
            <Users className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No hay victorias registradas</h2>
            <p className="text-gray-500 mb-6">
              {filter || difficultyFilter
                ? `No hay victorias registradas para ${filter ? filter : "ningún anime"} ${filter && difficultyFilter ? "en" : ""} ${difficultyFilter ? `dificultad ${getDifficultyText(difficultyFilter)}` : ""}`
                : "¡Gana partidas para aparecer en el ranking!"}
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition-colors"
            >
              <Gamepad2 className="inline-block mr-2 h-5 w-5" />
              Jugar ahora
            </a>
          </div>
        ) : (
          <>
            {/* Top 3 Podium for larger screens */}
            {ranking.length >= 2 && (
              <div className="hidden md:flex justify-center items-end mb-12 mt-8 gap-4">
                {/* Second Place */}
                {ranking.length > 1 && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-300 flex items-center justify-center mb-4 overflow-hidden">
                      <span className="text-2xl font-bold">{ranking[1].nombre_usuario.charAt(0)}</span>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{ranking[1].nombre_usuario}</p>
                      <div
                        className={`px-3 py-1 rounded-full text-sm ${
                          animeColors[ranking[1].nombre_anime]?.light || animeColors.default.light
                        } ${animeColors[ranking[1].nombre_anime]?.text || animeColors.default.text} mt-1`}
                      >
                        {ranking[1].nombre_anime}
                      </div>
                      <p className="text-gray-400 text-sm">{getDifficultyText(ranking[1].numero_casillas)}</p>
                      <p className="font-bold text-xl mt-1 flex items-center justify-center">
                        <Award className="h-5 w-5 text-gray-300 mr-1" />
                        {ranking[1].victorias}
                      </p>
                    </div>
                    <div className="h-32 w-24 bg-gray-700 rounded-t-lg mt-4 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-300">2</span>
                    </div>
                  </div>
                )}

                {/* First Place */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-yellow-400 flex items-center justify-center mb-4 overflow-hidden shadow-lg shadow-yellow-500/20">
                    <span className="text-3xl font-bold">{ranking[0].nombre_usuario.charAt(0)}</span>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-2xl">{ranking[0].nombre_usuario}</p>
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        animeColors[ranking[0].nombre_anime]?.light || animeColors.default.light
                      } ${animeColors[ranking[0].nombre_anime]?.text || animeColors.default.text} mt-1`}
                    >
                      {ranking[0].nombre_anime}
                    </div>
                    <p className="text-gray-400 text-sm">{getDifficultyText(ranking[0].numero_casillas)}</p>
                    <p className="font-bold text-2xl mt-1 flex items-center justify-center">
                      <Award className="h-6 w-6 text-yellow-400 mr-1" />
                      {ranking[0].victorias}
                    </p>
                  </div>
                  <div className="h-40 w-32 bg-yellow-600 rounded-t-lg mt-4 flex items-center justify-center">
                    <span className="text-4xl font-bold text-yellow-100">1</span>
                  </div>
                </div>

                {/* Third Place */}
                {ranking.length > 2 && (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gray-800 border-4 border-amber-600 flex items-center justify-center mb-4 overflow-hidden">
                      <span className="text-xl font-bold">{ranking[2].nombre_usuario.charAt(0)}</span>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{ranking[2].nombre_usuario}</p>
                      <div
                        className={`px-3 py-1 rounded-full text-sm ${
                          animeColors[ranking[2].nombre_anime]?.light || animeColors.default.light
                        } ${animeColors[ranking[2].nombre_anime]?.text || animeColors.default.text} mt-1`}
                      >
                        {ranking[2].nombre_anime}
                      </div>
                      <p className="text-gray-400 text-sm">{getDifficultyText(ranking[2].numero_casillas)}</p>
                      <p className="font-bold text-xl mt-1 flex items-center justify-center">
                        <Award className="h-5 w-5 text-amber-600 mr-1" />
                        {ranking[2].victorias}
                      </p>
                    </div>
                    <div className="h-24 w-20 bg-gray-700 rounded-t-lg mt-4 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-300">3</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ranking List */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="grid grid-cols-12 bg-gray-700 py-3 px-4 text-sm font-semibold text-gray-300">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4 md:col-span-3">Usuario</div>
                <div className="col-span-3 md:col-span-3">Anime</div>
                <div className="col-span-2 md:col-span-2">Dificultad</div>
                <div className="col-span-2 md:col-span-3 text-center">Victorias</div>
              </div>

              <div className="divide-y divide-gray-700">
                {ranking.map((entry, index) => {
                  const colorScheme = animeColors[entry.nombre_anime] || animeColors.default
                  const isTopThree = index < 3

                  return (
                    <div
                      key={`${entry.usuario_id}-${entry.nombre_anime}-${entry.numero_casillas}`}
                      className={`grid grid-cols-12 py-3 px-4 items-center ${
                        isTopThree ? colorScheme.light : "hover:bg-gray-750"
                      } transition-colors`}
                    >
                      <div className="col-span-1 flex justify-center">{getMedalIcon(index)}</div>
                      <div className="col-span-4 md:col-span-3 font-medium">{entry.nombre_usuario}</div>
                      <div className="col-span-3 md:col-span-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${colorScheme.bg} ${colorScheme.text}`}>
                          {entry.nombre_anime}
                        </span>
                      </div>
                      <div className="col-span-2 md:col-span-2 text-sm text-gray-300">
                        {getDifficultyText(entry.numero_casillas)}
                      </div>
                      <div className="col-span-2 md:col-span-3 text-center">
                        <span className="font-bold text-lg flex items-center justify-center">
                          <span>{entry.victorias}</span>
                          <Trophy className="h-4 w-4 ml-1 text-yellow-400" />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        <div className="mt-8 text-center text-gray-500">
          Mostrando {ranking.length} {ranking.length === 1 ? "jugador" : "jugadores"} en el ranking
          {filter ? ` para ${filter}` : ""}
          {difficultyFilter ? ` en dificultad ${getDifficultyText(difficultyFilter)}` : ""}
        </div>
      </div>
    </div>
  )
}
