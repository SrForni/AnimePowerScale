"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, Trophy, XCircle, Loader2, History, Gamepad2, ArrowUpDown } from "lucide-react"

interface Partida {
  id: number
  nombre_anime: string
  numero_casillas: number
  fecha: string
  puntuacion: number
}

// Map anime names to their theme colors
const animeColors: Record<string, { bg: string; text: string; border: string }> = {
  Naruto: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-300",
  },
  "One Piece": {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
  },
  Bleach: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-300",
  },
  "Dragon Ball": {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
  },
  // Default fallback
  default: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
  },
}

// Helper function to get difficulty text
const getDifficultyText = (casillas: number) => {
  switch (casillas) {
    case 5:
      return "Fácil"
    case 7:
      return "Media"
    case 9:
      return "Difícil"
    default:
      return `${casillas} casillas`
  }
}

export default function HistoryPage() {
  const [partidas, setPartidas] = useState<Partida[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    async function fetchPartidas() {
      try {
        const res = await fetch("http://localhost:3000/api/partidas")
        const json = await res.json()
        console.log("🧪 Respuesta JSON:", json)

        const data = json.data || []
        sortPartidas(data, sortOrder)
      } catch (err) {
        console.error("Error al cargar las partidas:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPartidas()
  }, [sortOrder])

  const sortPartidas = (data: Partida[], order: "asc" | "desc") => {
    const ordenadas = [...data].sort((a: Partida, b: Partida) => {
      const dateA = new Date(a.fecha).getTime()
      const dateB = new Date(b.fecha).getTime()
      return order === "desc" ? dateB - dateA : dateA - dateB
    })
    setPartidas(ordenadas)
  }

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc"
    setSortOrder(newOrder)
    sortPartidas(partidas, newOrder)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <History className="h-8 w-8 text-purple-400" />
            Historial de Partidas
          </h1>

          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortOrder === "desc" ? "Más recientes primero" : "Más antiguas primero"}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
            <p className="text-xl text-gray-300">Cargando historial de partidas...</p>
          </div>
        ) : partidas.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-10 text-center">
            <Gamepad2 className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No hay partidas registradas</h2>
            <p className="text-gray-500 mb-6">¡Juega tu primera partida para comenzar tu historial!</p>
            <link
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Jugar ahora
            </link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partidas.map((p) => {
              const colorScheme = animeColors[p.nombre_anime] || animeColors.default
              const { date, time } = formatDate(p.fecha)

              return (
                <div
                  key={p.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`${colorScheme.bg} ${colorScheme.text} px-4 py-3 font-bold flex justify-between items-center`}
                  >
                    <span className="flex items-center gap-2">{p.nombre_anime}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${colorScheme.border}`}>
                      {getDifficultyText(p.numero_casillas)}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{time}</span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-center gap-3 py-3 px-4 rounded-lg ${
                        p.puntuacion === 1
                          ? "bg-green-900/20 text-green-400 border border-green-800/50"
                          : "bg-red-900/20 text-red-400 border border-red-800/50"
                      }`}
                    >
                      {p.puntuacion === 1 ? (
                        <>
                          <Trophy className="h-6 w-6" />
                          <span className="font-bold text-lg">Victoria</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6" />
                          <span className="font-bold text-lg">Derrota</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {partidas.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
            Mostrando {partidas.length} {partidas.length === 1 ? "partida" : "partidas"}
          </div>
        )}
      </div>
    </div>
  )
}