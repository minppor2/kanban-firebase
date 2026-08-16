import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import { useCurrentUser } from './useCurrentUser'
import type { MembershipDoc } from '../types/models'

interface CurrentClassState {
  membership: MembershipDoc | null
  isLoading: boolean
}

// Derived live from `memberships` (rather than cached on the user profile)
// so it never goes stale relative to what the student actually joined.
export function useCurrentClass(): CurrentClassState {
  const { uid } = useCurrentUser()
  const [membership, setMembership] = useState<MembershipDoc | null>(null)
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const q = query(collection(db, 'memberships'), where('userId', '==', uid))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const first = snapshot.docs[0]
        setMembership(first ? ({ id: first.id, ...first.data() } as MembershipDoc) : null)
        setIsLoading(false)
      },
      () => setIsLoading(false),
    )
    return unsubscribe
  }, [uid])

  return { membership, isLoading }
}
