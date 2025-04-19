'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, LogOut, Trash2, Palette, HelpCircle, UserCog } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <div className="w-full min-h-screen px-6 py-10 text-white bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <UserCog className="h-7 w-7 text-yellow-400" />
          Ajustes de Usuario
        </h1>

        {/* Información del usuario */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            Información de tu cuenta
          </h2>
          <p><span className="font-medium text-gray-300">Usuario:</span> {session?.user?.nombre_usuario || session?.user?.name}</p>
          <p><span className="font-medium text-gray-300">Correo:</span> {session?.user?.email}</p>
        </div>

        {/* Acciones */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white mb-2">Acciones rápidas</h2>

          <Button variant="secondary" className="flex items-center gap-2 text-gray-300 border border-gray-600 cursor-not-allowed" disabled>
            <User className="h-4 w-4" />
            Cambiar nombre de usuario (próximamente)
          </Button>

          <Button variant="secondary" className="flex items-center gap-2 text-gray-300 border border-gray-600 cursor-not-allowed" disabled>
            <Palette className="h-4 w-4" />
            Cambiar tema (próximamente)
          </Button>

          <Button variant="secondary" className="flex items-center gap-2 text-gray-300 border border-gray-600 cursor-not-allowed" disabled>
            <Trash2 className="h-4 w-4" />
            Eliminar cuenta (próximamente)
          </Button>

          <a
            href="/help"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm underline mt-2"
          >
            <HelpCircle className="h-4 w-4" />
            Ver reglas del juego
          </a>
        </div>

        {/* Logout */}
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 w-fit flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
