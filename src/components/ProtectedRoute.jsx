import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'
import { isLocalMode } from '../lib/supabaseClient'

export default function ProtectedRoute({ children, allowLocalMode = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (allowLocalMode && isLocalMode) return children
  if (loading) return <LoadingSpinner message="로그인 상태를 확인하는 중…" />
  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return children
}
