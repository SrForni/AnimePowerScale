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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-900 to-indigo-900 text-white px-4 py-10 space-y-8">
        <h1 className="text-3xl font-bold">
          {estadoJuego === 'jugando' ? 'Coloca al personaje' : estadoJuego === 'ganado' ? '¡Ganaste! 🎉' : 'Has perdido 😢'}
        </h1>

        {estadoJuego === 'jugando' && personajes[actual] && (
          <DraggableCard personaje={personajes[actual]} />
        )}

        {cargando && <div className="text-white">Cargando personaje...</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {casillas.map((p, i) => (
            <DropSlot
              key={i}
              index={i}
              personaje={p}
              onDrop={handleDrop}
              estaJugando={estadoJuego === 'jugando'}
            />
          ))}
        </div>

        {estadoJuego !== 'jugando' && (
          <Button onClick={() => window.location.reload()}>Volver a jugar</Button>
        )}
      </div>
    </DndProvider>
  )
}