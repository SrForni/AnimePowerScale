'use client'

import ModeSelector from '@/components/ModeSelector'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function SelectModePage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log('📡 Estado de sesión:', status)
    if (status === 'authenticated') {
      console.log('🧠 Usuario logueado:', session?.user)
    }
    if (status === 'unauthenticated') {
      console.log('🔐 No hay sesión activa')
    }
  }, [session, status])

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white overflow-hidden">
      <ModeSelector />
    </div>
  )
}
