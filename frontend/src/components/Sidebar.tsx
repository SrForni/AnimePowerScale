'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart2,
  Trophy,
  History,
  Settings,
  Gamepad2,
  CircleHelp,
  Newspaper
} from 'lucide-react'

const navItems = [
  { name: 'Juego', href: '/game/select-mode', icon: <Gamepad2 className="w-5 h-5" /> },
  { name: 'Rankings', href: '/rankings', icon: <Trophy className="w-5 h-5" /> },
  { name: 'Historial', href: '/history', icon: <History className="w-5 h-5" /> },
  { name: 'Estadísticas', href: '/stats', icon: <BarChart2 className="w-5 h-5" /> },
  { name: 'Noticias', href: '/news', icon: <Newspaper className="w-5 h-5" /> },
  { name: 'Ajustes', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  { name: 'Ayuda', href: '/help', icon: <CircleHelp className="w-5 h-5" /> },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 min-h-screen bg-gray-900 text-white shadow-lg hidden md:flex flex-col px-4 py-6 space-y-6">
      <div className="text-2xl font-bold tracking-wide mb-6 text-center">
        Anime Power Scale
      </div>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-gray-700'}
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
