'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CharacterCard from '@/components/CharacterCard'
import { Button } from '@/components/ui/button'

// Tipado del personaje y casilla
type Personaje = {
  nombre: string
  tier: string
  imagen_url: string
}

type Casilla = Personaje | null

const ItemTypes = {
  PERSONAJE: 'personaje',
}

function DraggableCard({ personaje, onDragEnd }: { 
  personaje: Personaje, 
  onDragEnd?: () => void 
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PERSONAJE,
    item: personaje,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop && onDragEnd) {
        onDragEnd()
      }
    }
  }), [personaje, onDragEnd])

  return (
    <div
      ref={drag}
      className={`cursor-grab ${isDragging ? 'opacity-50' : ''}`}
    >
      <CharacterCard personaje={personaje} />
    </div>
  )
}

function DropSlot({
  index,
  personaje,
  onDrop,
  estaJugando
}: {
  index: number
  personaje: Casilla
  onDrop: (index: number, personaje: Personaje) => void
  estaJugando: boolean
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PERSONAJE,
    drop: (item: Personaje) => {
      onDrop(index, item)
      return { dropped: true }
    },
    canDrop: () => estaJugando && personaje === null,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [index, personaje, onDrop, estaJugando])

  const isActive = isOver && canDrop
  
  return (
    <div
      ref={drop}
      className={`w-60 h-60 border-2 border-dashed rounded-xl flex items-center justify-center text-white text-sm text-center p-1
        ${isActive ? 'bg-green-800/30 border-green-400' : 'bg-white/10 border-white'}
        ${canDrop && !isOver ? 'border-yellow-400' : ''}
        ${!estaJugando && personaje === null ? 'opacity-50' : ''}`
      }
    >
      {personaje ? (
        <CharacterCard personaje={personaje} small />
      ) : (
        `Casilla ${index + 1}`
      )}
    </div>
  )
}

export default function GamePage() {
  const searchParams = useSearchParams()
  const anime = searchParams.get('anime') || ''
  const cantidad = parseInt(searchParams.get('casillas') || '5')

  const [nombres, setNombres] = useState<string[]>([])
  const [personajes, setPersonajes] = useState<Personaje[]>([])
  const [casillas, setCasillas] = useState<Casilla[]>(Array(cantidad).fill(null))
  const [actual, setActual] = useState<number>(0)
  const [estadoJuego, setEstadoJuego] = useState<'jugando' | 'perdido' | 'ganado'>('jugando')
  const [cargando, setCargando] = useState<boolean>(false)

  useEffect(() => {
    const obtenerNombres = async () => {
      setCargando(true)
      try {
        const res = await fetch(`/api/personajes-generator?anime=${anime}&cantidad=${cantidad}`)
        const data = await res.json()
        setNombres(data)
      } catch (error) {
        console.error('Error al obtener nombres:', error)
      } finally {
        setCargando(false)
      }
    }

    if (anime && cantidad > 0) obtenerNombres()
  }, [anime, cantidad])

  useEffect(() => {
    const cargarSiguientePersonaje = async () => {
      if (nombres[actual]) {
        setCargando(true)
        try {
          console.log('⚡ Cargando personaje', nombres[actual])
          const res = await fetch(`/api/parse-personaje?nombre=${encodeURIComponent(nombres[actual])}`)
          const detalle = await res.json()
          setPersonajes((prev) => [...prev, detalle])
        } catch (error) {
          console.error('Error al cargar personaje:', error)
        } finally {
          setCargando(false)
        }
      }
    }

    if (estadoJuego === 'jugando' && personajes.length === actual && nombres.length > actual) {
      cargarSiguientePersonaje()
    }
  }, [actual, nombres, personajes, estadoJuego])

  const handleDrop = (index: number, personaje: Personaje) => {
    console.log('🧩 Intentando colocar personaje:', personaje)
    
    // Verificar si la casilla ya está ocupada
    if (casillas[index] !== null) {
      console.warn('⚠️ Casilla ocupada')
      return
    }

    // Verificar que el personaje que se está colocando es el actual
    if (personaje !== personajes[actual]) {
      console.warn('❌ No es el personaje actual que se está intentando colocar')
      return
    }

    // Actualizar el estado de las casillas
    const nuevas = [...casillas]
    nuevas[index] = personaje
    setCasillas(nuevas)

    // Verificar orden de tiers
    const tiers = nuevas
      .filter(Boolean)
      .map((p) => parseInt((p as Personaje).tier.replace(/[^\d]/g, '')))
    
    const ordenCorrecto = tiers.every((t, i, arr) => i === 0 || arr[i - 1] <= t)

    console.log('📊 Tiers:', tiers)
    console.log('✅ Orden correcto:', ordenCorrecto)

    if (!ordenCorrecto) {
      setEstadoJuego('perdido')
    } else if (actual + 1 >= cantidad || actual + 1 >= nombres.length) {
      setEstadoJuego('ganado')
    } else {
      setActual((prev) => prev + 1)
    }
  }

  const reiniciar = () => {
    window.location.reload()
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-900 to-indigo-900 text-white px-4 py-10 space-y-8">
        <h1 className="text-3xl font-bold">
          {estadoJuego === 'jugando'
            ? `Coloca al personaje`
            : estadoJuego === 'ganado'
            ? '¡Ganaste! 🎉'
            : 'Has perdido 😢'}
        </h1>

        {estadoJuego === 'jugando' && personajes[actual] && (
          <DraggableCard 
            personaje={personajes[actual]}
          />
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
          <Button onClick={reiniciar}>Volver a jugar</Button>
        )}
      </div>
    </DndProvider>
  )
}