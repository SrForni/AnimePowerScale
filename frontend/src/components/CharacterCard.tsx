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
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-lg border-2 border-indigo-200">
      <Image
        src={personaje.imagen_url}
        alt={personaje.nombre}
        fill
        sizes="100%"
        className="object-contain"
        priority
      />
      <div className="absolute bottom-0 w-full bg-black/50 text-white text-sm sm:text-base font-semibold text-center px-1 py-1">
        {personaje.nombre}
      </div>
    </div>
  )
}
