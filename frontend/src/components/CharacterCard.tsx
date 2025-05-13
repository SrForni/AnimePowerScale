'use client'

import Image from 'next/image'

type Personaje = {
  nombre: string
  tier: string
  imagen_url: string
}

// URL de imagen por defecto en caso de error
const DEFAULT_IMAGE = 'https://i.imgur.com/cUmqQkv.png'

export default function CharacterCard({ personaje }: { personaje?: Personaje }) {
  if (!personaje) return null

  const isGif = personaje.imagen_url?.toLowerCase().endsWith('.gif')
  const imageSrc = personaje.imagen_url || DEFAULT_IMAGE

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-lg border-2 border-indigo-200">
      <Image
        src={imageSrc}
        alt={personaje.nombre}
        fill
        sizes="100%"
        className="object-contain"
        priority
        unoptimized={isGif}
        onError={() => {
          // Si la imagen falla, usar la imagen por defecto
          const imgs = document.querySelectorAll(`img[alt="${personaje.nombre}"]`)
          imgs.forEach(img => {
            if (img.src !== DEFAULT_IMAGE) {
              img.src = DEFAULT_IMAGE
            }
          })
        }}
      />
      <div className="absolute bottom-0 w-full bg-black/50 text-white text-sm sm:text-base font-semibold text-center px-1 py-1">
        {personaje.nombre}
      </div>
    </div>
  )
}