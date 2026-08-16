import { useContext } from 'react'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import type { Role, UserProfile } from '../types/models'

export interface CurrentUser extends UserProfile {
  isLoading: boolean
}

// Stable interface: swapping the mock context for real Firebase Auth later
// only requires changing CurrentUserContext's internals — every call site
// that uses useCurrentUser()/useSetActiveRole() stays untouched.
export function useCurrentUser(): CurrentUser {
  const ctx = useContext(CurrentUserContext)
  if (!ctx) throw new Error('useCurrentUser must be used within a CurrentUserProvider')
  return { ...ctx.profile, isLoading: ctx.isLoading }
}

export function useSetActiveRole(): (role: Role) => void {
  const ctx = useContext(CurrentUserContext)
  if (!ctx) throw new Error('useSetActiveRole must be used within a CurrentUserProvider')
  return ctx.setActiveRole
}
