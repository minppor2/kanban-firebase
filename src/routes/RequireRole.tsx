import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { Role } from '../types/models'

// Guards against the demo role switcher leaving a role-specific page mounted
// after the active mock role changes mid-session (e.g. switching from
// teacher to student while sitting on /teacher).
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const currentUser = useCurrentUser()
  if (currentUser.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}
