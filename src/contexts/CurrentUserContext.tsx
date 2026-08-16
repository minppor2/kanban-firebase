import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import { MOCK_STUDENT, MOCK_TEACHER } from '../lib/mockUsers'
import type { Role, UserProfile } from '../types/models'

const ACTIVE_ROLE_STORAGE_KEY = 'kanban-mock-active-role'

interface CurrentUserContextValue {
  profile: UserProfile
  isLoading: boolean
  setActiveRole: (role: Role) => void
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

function readStoredRole(): Role {
  const stored = localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY)
  return stored === 'teacher' || stored === 'student' ? stored : 'teacher'
}

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<Role>(readStoredRole)

  const profile = activeRole === 'teacher' ? MOCK_TEACHER : MOCK_STUDENT

  const setActiveRole = (role: Role) => {
    localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role)
    setActiveRoleState(role)
  }

  // Mirrors the active mock profile into Firestore so users/{uid} really
  // exists once a real project is configured, even without real login.
  useEffect(() => {
    if (!isFirebaseConfigured) return
    setDoc(
      doc(db, 'users', profile.uid),
      { ...profile, createdAt: Date.now() },
      { merge: true },
    ).catch(() => {
      // Best-effort mirror; board screens surface their own configuration
      // banners, so a failed write here doesn't need its own UI.
    })
  }, [profile])

  const value = useMemo(
    () => ({ profile, isLoading: false, setActiveRole }),
    [profile],
  )

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}
