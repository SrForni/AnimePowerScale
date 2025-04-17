'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const animes = ['Naruto', 'One Piece', 'Bleach', 'Dragon Ball']
const dificultades = [
  { label: 'Fácil', value: 5 },
  { label: 'Media', value: 7 },
  { label: 'Difícil', value: 9 },
]

export default function ModeSelector() {
  const [anime, setAnime] = useState('')
  const [dificultad, setDificultad] = useState<number | null>(null)
  const router = useRouter()

  const handleStart = () => {
    if (anime && dificultad) {
      router.push(`/game?anime=${anime}&casillas=${dificultad}`)
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white overflow-hidden">
      <div className="relative max-w-xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl"></div>

        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">
          Selecciona el modo de juego
        </h1>

        {/* ANIME */}
        <div className="mb-8 relative z-10">
          <h3 className="font-semibold text-xl mb-4 text-pink-200 flex items-center">
            <span className="mr-2 bg-pink-500/20 p-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            Anime
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            {animes.map((name) => (
              <button
                key={name}
                onClick={() => setAnime(name)}
                className={`px-5 py-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  anime === name
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* DIFICULTAD */}
        <div className="mb-10 relative z-10">
          <h3 className="font-semibold text-xl mb-4 text-indigo-200 flex items-center">
            <span className="mr-2 bg-indigo-500/20 p-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                />
              </svg>
            </span>
            Dificultad
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {dificultades.map((dif) => (
              <button
                key={dif.value}
                onClick={() => setDificultad(dif.value)}
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  dificultad === dif.value
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 border-transparent text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                {dif.label}
              </button>
            ))}
          </div>
        </div>

        {/* BOTÓN */}
        <button
          disabled={!anime || !dificultad}
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-pink-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-pink-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative z-10 group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
          <span className="relative flex items-center justify-center">
            Empezar partida
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>

        {/* TEXTO FINAL */}
        {anime && dificultad && (
          <div className="mt-4 text-center text-sm text-indigo-200 animate-pulse">
            ¡Listo para jugar con {anime} en dificultad{' '}
            {dificultad === 5 ? 'Fácil' : dificultad === 7 ? 'Media' : 'Difícil'}!
          </div>
        )}
      </div>
    </div>
  )
}
