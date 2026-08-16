import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useCurrentClass } from '../hooks/useCurrentClass'

export function RootRedirect() {
  const { role } = useCurrentUser()
  const { membership, isLoading } = useCurrentClass()

  if (role === 'teacher') return <Navigate to="/teacher" replace />
  if (isLoading) return <p className="text-sm text-slate-500">불러오는 중...</p>
  return <Navigate to={membership ? '/board' : '/join'} replace />
}
