'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <div className="w-full h-full px-6 py-10 text-white flex flex-col items-start gap-6">
      <h1 className="text-3xl font-bold">Ajustes de Usuario</h1>
      <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
        Cerrar sesión
      </Button>
    </div>
  )
}
