// components/DropSlot.tsx
'use client'

import { useDrop } from 'react-dnd'
import CharacterCard from '@/components/CharacterCard'

// Tipo local de personaje
type Personaje = {
  nombre: string
  tier: string
  imagen_url: string
}

const ItemTypes = {
  PERSONAJE: 'personaje',
}

type Props = {
  index: number
  personaje: Personaje | null
  onDrop: (index: number, personaje: Personaje) => void
  estaJugando: boolean
}

export default function DropSlot({ index, personaje, onDrop, estaJugando }: Props) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
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
    }),
    [index, personaje, onDrop, estaJugando]
  )

  const isActive = isOver && canDrop

  return (
    <div
      ref={drop}
      className={`w-60 h-60 border-2 border-dashed rounded-xl flex items-center justify-center text-white text-sm text-center p-1
        ${isActive ? 'bg-green-800/30 border-green-400' : 'bg-white/10 border-white'}
        ${canDrop && !isOver ? 'border-yellow-400' : ''}
        ${!estaJugando && personaje === null ? 'opacity-50' : ''}`}
    >
      {personaje ? (
        <CharacterCard personaje={personaje} small />
      ) : (
        `Casilla ${index + 1}`
      )}
    </div>
  )
}
