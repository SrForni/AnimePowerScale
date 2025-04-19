'use client'

import { BookOpenCheck, Info, Sparkles } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="w-full min-h-screen px-6 py-10 text-white bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <BookOpenCheck className="h-8 w-8 text-yellow-400" />
          Cómo jugar
        </h1>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-indigo-300">
            <Info className="h-5 w-5" />
            Objetivo del juego
          </div>
          <p className="text-gray-300">
            El objetivo de <span className="text-yellow-300 font-semibold">Anime Power Scale</span> es colocar correctamente a los personajes de anime según su nivel de poder, basándote en sus niveles oficiales según la wiki de VS Battles.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-indigo-300">
            <Sparkles className="h-5 w-5" />
            ¿Cómo funciona?
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Al comenzar una partida, se te mostrará un personaje aleatorio del anime y dificultad seleccionados.</li>
            <li>Debes arrastrar el personaje a la posición correcta dentro de una serie de casillas vacías.</li>
            <li>Tu objetivo es mantener el orden correcto de poder (de menor a mayor) a medida que avanzas.</li>
            <li>Si colocas un personaje en el orden incorrecto, perderás la partida.</li>
            <li>Si completas todas las casillas en orden correcto, ¡ganas!</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-indigo-300">
            <Info className="h-5 w-5" />
            Niveles de dificultad
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><span className="text-green-400 font-semibold">Fácil:</span> 5 personajes</li>
            <li><span className="text-yellow-400 font-semibold">Media:</span> 7 personajes</li>
            <li><span className="text-red-400 font-semibold">Difícil:</span> 9 personajes</li>
          </ul>
          <p className="text-gray-400 text-sm">
            Cuanto mayor la dificultad, más personajes deberás ordenar correctamente.
          </p>
        </div>

        <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-700">
          ¿Listo para demostrar tus conocimientos? ¡Comienza una partida desde el menú de juego!
        </div>
      </div>
    </div>
  )
}
