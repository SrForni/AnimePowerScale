// components/GameBoard.tsx
'use client'

import { useState } from 'react'

interface GameBoardProps {
  anime: string
  casillas: number
}

export default function GameBoard({ anime, casillas }: GameBoardProps) {
  const [board, setBoard] = useState<(string | null)[]>(Array(casillas).fill(null))

  return (
    <div className="w-full max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold text-center text-indigo-800">
        Anime: {anime} – {casillas} Casillas
      </h2>

      {/* Casillas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {board.map((char, i) => (
          <div
            key={i}
            className="h-24 flex items-center justify-center border-2 border-dashed border-indigo-300 rounded-lg bg-white shadow-sm"
          >
            {char ? char : <span className="text-gray-400">Casilla {i + 1}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
