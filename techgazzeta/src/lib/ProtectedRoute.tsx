'use client'

import { ReactNode, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {

    if (!isLoading && !accessToken) {
      router.replace('/features/auth/login')
    }
  }, [accessToken, isLoading, router])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!accessToken) {
    return null
  }

  return <>{children}</>
}