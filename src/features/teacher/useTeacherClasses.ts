import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../../lib/firebase'
import type { ClassDoc } from '../../types/models'

export function useTeacherClasses(teacherId: string) {
  const [classes, setClasses] = useState<ClassDoc[]>([])
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const q = query(collection(db, 'classes'), where('teacherId', '==', teacherId))
    const unsubscribe = onSnapshot(q, (snap) => {
      setClasses(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as ClassDoc)
          .sort((a, b) => b.createdAt - a.createdAt),
      )
      setIsLoading(false)
    })
    return unsubscribe
  }, [teacherId])

  return { classes, isLoading }
}
