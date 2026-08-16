import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import type { ClassDoc } from '../types/models'

export function useClassDoc(classId: string | undefined) {
  const [classDoc, setClassDoc] = useState<ClassDoc | null>(null)
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured && Boolean(classId))

  useEffect(() => {
    if (!isFirebaseConfigured || !classId) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const unsubscribe = onSnapshot(doc(db, 'classes', classId), (snap) => {
      setClassDoc(snap.exists() ? ({ id: snap.id, ...snap.data() } as ClassDoc) : null)
      setIsLoading(false)
    })
    return unsubscribe
  }, [classId])

  return { classDoc, isLoading }
}
