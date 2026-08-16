import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../../lib/firebase'
import type { MembershipDoc } from '../../types/models'

export function useRoster(classId: string | undefined) {
  const [students, setStudents] = useState<MembershipDoc[]>([])
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured && Boolean(classId))

  useEffect(() => {
    if (!isFirebaseConfigured || !classId) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const q = query(
      collection(db, 'memberships'),
      where('classId', '==', classId),
      where('role', '==', 'student'),
    )
    const unsubscribe = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MembershipDoc))
      setIsLoading(false)
    })
    return unsubscribe
  }, [classId])

  return { students, isLoading }
}
