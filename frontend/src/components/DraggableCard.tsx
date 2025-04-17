// components/DraggableCard.tsx
'use client'

import { useDrag } from 'react-dnd'
import CharacterCard from '@/components/CharacterCard'
import type { Personaje } from '@/types'

const ItemTypes = {
  PERSONAJE: 'personaje',
}

export default function DraggableCard({ personaje, onDragEnd }: { 
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
    },
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