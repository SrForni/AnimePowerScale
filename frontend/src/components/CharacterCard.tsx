'use client'

import Image from 'next/image'

type Personaje = {
  nombre: string
  tier: string
  imagen_url: string
}

export default function CharacterCard({ personaje }: { personaje?: Personaje }) {
  if (!personaje) return null

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-60 h-60 relative rounded-xl overflow-hidden shadow-lg border-2 border-indigo-200">
        <Image
          src={personaje.imagen_url}
          alt={personaje.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          priority
          className="object-contain"
        />

      </div>
      <div className="text-xl font-semibold text-indigo-700">{personaje.nombre}</div>
    </div>
  )
}
