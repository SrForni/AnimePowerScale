'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from '@/components/ui/button'
import DraggableCard from '@/components/DraggableCard'
import DropSlot from '@/components/DropSlot'

// Tipos
interface Personaje {
  nombre: string
  tier: string
  imagen_url: string
}

type Casilla = Personaje | null

export default function GamePage() {
  const searchParams = useSearchParams()
  const anime = searchParams.get('anime') || ''
  const cantidad = parseInt(searchParams.get('casillas') || '5')

  const [nombres, setNombres] = useState<string[]>([])
  const [personajes, setPersonajes] = useState<Personaje[]>([])
  const [casillas, setCasillas] = useState<Casilla[]>(Array(cantidad).fill(null))
  const [actual, setActual] = useState(0)
  const [estadoJuego, setEstadoJuego] = useState<'jugando' | 'perdido' | 'ganado'>('jugando')
  const [cargando, setCargando] = useState(false)
  const [fallbackIndex, setFallbackIndex] = useState(0)

  const tierRanking: Record<string, number> = {
    '1-A': 1, '1-B': 2, '1-C': 3,
    '2-A': 4, '2-B': 5, '2-C': 6,
    '3-A': 7, '3-B': 8, '3-C': 9,
    '4-A': 10, '4-B': 11, '4-C': 12,
    '5-A': 13, '5-B': 14, '5-C': 15,
    '6-A': 16, '6-B': 17, '6-C': 18,
    '7-A': 19, '7-B': 20, '7-C': 21,
    '8-A': 22, '8-B': 23, '8-C': 24,
    '9-A': 25, '9-B': 26, '9-C': 27,
  }

  const getTierValue = (tier: string): number => {
    const matches = tier.match(/(\d-[A-C])/g)
    if (!matches) return Infinity
  
    const valores = matches
      .map(t => tierRanking[t])
      .filter(v => v !== undefined)
  
    return valores.length > 0 ? Math.min(...valores) : Infinity
  }

  const obtenerNombres = useCallback(async () => {
    setCargando(true)
    try {
      const extra = 5
      const res = await fetch(`/api/personajes-generator?anime=${anime}&cantidad=${cantidad + extra}`)
      const data = await res.json()
      setNombres(data)
    } catch (error) {
      console.error('Error al obtener nombres:', error)
    } finally {
      setCargando(false)
    }
  }, [anime, cantidad])

  const cargarSiguientePersonaje = useCallback(async () => {
    setCargando(true)
    let index = fallbackIndex

    while (index < nombres.length) {
      try {
        const nombre = nombres[index]
        const res = await fetch(`/api/parse-personaje?nombre=${encodeURIComponent(nombre)}`)

        if (!res.ok) throw new Error('Personaje inválido')

        const detalle = await res.json()
        setPersonajes((prev) => [...prev, detalle])
        setFallbackIndex(index + 1)
        break
      } catch (error) {
        console.warn('❌ Fallo personaje, probando siguiente...', nombres[index])
        index++
      }
    }

    setCargando(false)
  }, [nombres, fallbackIndex])

  useEffect(() => {
    if (anime && cantidad > 0) obtenerNombres()
  }, [obtenerNombres])

  useEffect(() => {
    if (estadoJuego === 'jugando' && personajes.length === actual && nombres.length > fallbackIndex) {
      cargarSiguientePersonaje()
    }
  }, [actual, personajes, nombres, estadoJuego, cargarSiguientePersonaje, fallbackIndex])

  const handleDrop = (index: number, personaje: Personaje) => {
    if (casillas[index]) return
    if (personaje !== personajes[actual]) return

    const nuevas = [...casillas]
    nuevas[index] = personaje
    setCasillas(nuevas)

    const tiers = nuevas
      .filter(Boolean)
      .map((p) => getTierValue((p as Personaje).tier))

    const ordenCorrecto = tiers.every((t, i, arr) => i === 0 || arr[i - 1] <= t)

    if (!ordenCorrecto) {
      setEstadoJuego('perdido')
    } else if (actual + 1 >= cantidad) {
      setEstadoJuego('ganado')
    } else {
      setActual((prev) => prev + 1)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden
        ${
          estadoJuego === 'ganado'
            ? 'bg-gradient-to-br from-green-800 to-emerald-900'
            : estadoJuego === 'perdido'
            ? 'bg-gradient-to-br from-red-800 to-rose-900'
            : 'bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-900'
        }
        text-white transition-colors duration-1000`}
      >
        {/* Fondo decorativo */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-5 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat"></div>
  
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full 
                ${estadoJuego === 'ganado' ? 'bg-green-400' : estadoJuego === 'perdido' ? 'bg-red-400' : 'bg-indigo-400'} 
                opacity-20 animate-float`}
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
  
          {estadoJuego === 'ganado' && (
            <div className="absolute inset-0 flex items-center justify-center">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-8 bg-green-400 opacity-60 animate-firework"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animationDuration: `${Math.random() * 2 + 1}s`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
  
        {/* Contenido principal */}
        <div className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-6xl">
          <h1
            className={`text-4xl font-extrabold text-center mb-4 transition-all duration-700
            ${
              estadoJuego === 'ganado'
                ? 'text-green-200 scale-125'
                : estadoJuego === 'perdido'
                ? 'text-red-200'
                : 'text-white'
            }`}
          >
            {estadoJuego === 'jugando'
              ? 'Coloca al personaje en su posición'
              : estadoJuego === 'ganado'
              ? '¡Victoria! 🎉'
              : 'Derrota 😢'}
          </h1>
  
          {estadoJuego === 'jugando' && personajes[actual] && (
            <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
              <DraggableCard personaje={personajes[actual]} />
            </div>
          )}
  
          {cargando && (
            <div className="flex items-center justify-center space-x-2 text-white py-4">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0s]"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
              <span className="ml-2 text-lg font-medium">Cargando personaje...</span>
            </div>
          )}
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            {casillas.map((p, i) => (
              <div key={i} className="transform transition-all duration-300 hover:scale-102">
                <DropSlot index={i} personaje={p} onDrop={handleDrop} estaJugando={estadoJuego === 'jugando'} />
              </div>
            ))}
          </div>
  
          {estadoJuego !== 'jugando' && (
            <div className="flex flex-col items-center gap-6 mt-8 animate-fadeIn">
              <p
                className={`text-xl font-semibold text-center max-w-2xl
                ${estadoJuego === 'ganado' ? 'text-green-200' : 'text-red-200'}`}
              >
                {estadoJuego === 'ganado'
                  ? '¡Has colocado todos los personajes correctamente! Eres un verdadero fan de anime.'
                  : 'El orden no es correcto. ¡No te rindas, inténtalo de nuevo!'}
              </p>
  
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  Volver a jugar
                </button>
  
                {cantidad > 5 && (
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search)
                      params.set('casillas', String(cantidad - 2))
                      window.location.href = `/game?${params.toString()}`
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                  >
                    Nivel más fácil
                  </button>
                )}
  
                {cantidad < 10 && (
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search)
                      params.set('casillas', String(cantidad + 2))
                      window.location.href = `/game?${params.toString()}`
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-bold text-white shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105"
                  >
                    Nivel más difícil
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
  
        <div className="absolute bottom-4 left-4 text-white/70 text-sm">
          Dificultad: {cantidad} casillas
        </div>
      </div>
    </DndProvider>
  )
  
  
}