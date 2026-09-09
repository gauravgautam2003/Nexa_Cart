'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '../ui/Loader'

export function AuthGuard({ children, isAuthenticated, loading = false, redirectTo = '/login' }: { children: ReactNode; isAuthenticated: boolean; loading?: boolean; redirectTo?: string }) {
  const router = useRouter()
  useEffect(() => { if (!loading && !isAuthenticated) router.replace(redirectTo) }, [isAuthenticated, loading, redirectTo, router])
  if (loading || !isAuthenticated) return <Loader />
  return children
}

export default AuthGuard