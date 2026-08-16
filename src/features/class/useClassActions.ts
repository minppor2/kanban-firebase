import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { generateJoinCode, membershipId } from '../../lib/ids'
import type { UserProfile } from '../../types/models'

const DEFAULT_STUDENT_LISTS = ['할 일', '진행중', '완료']

export class JoinCodeError extends Error {}

export function useClassActions() {
  async function createClass(name: string, teacher: UserProfile): Promise<string> {
    const classRef = doc(collection(db, 'classes'))
    const code = generateJoinCode()
    const now = Date.now()

    const batch = writeBatch(db)
    batch.set(classRef, {
      name,
      teacherId: teacher.uid,
      joinCode: code,
      schedule: [],
      createdAt: now,
    })
    batch.set(doc(db, 'joinCodes', code), {
      code,
      classId: classRef.id,
      active: true,
      createdAt: now,
    })
    batch.set(doc(db, 'memberships', membershipId(classRef.id, teacher.uid)), {
      classId: classRef.id,
      userId: teacher.uid,
      role: 'teacher',
      displayName: teacher.displayName,
      joinedAt: now,
    })
    await batch.commit()

    return classRef.id
  }

  async function joinClassByCode(rawCode: string, student: UserProfile): Promise<string> {
    const code = rawCode.trim().toUpperCase()
    const codeSnap = await getDoc(doc(db, 'joinCodes', code))
    if (!codeSnap.exists() || codeSnap.data().active !== true) {
      throw new JoinCodeError('유효하지 않은 참여 코드입니다.')
    }
    const classId = codeSnap.data().classId as string

    await setDoc(
      doc(db, 'memberships', membershipId(classId, student.uid)),
      {
        classId,
        userId: student.uid,
        role: 'student',
        displayName: student.displayName,
        joinedAt: Date.now(),
      },
      { merge: true },
    )

    await seedDefaultListsIfMissing(classId, student.uid)

    return classId
  }

  return { createClass, joinClassByCode }
}

async function seedDefaultListsIfMissing(classId: string, studentUid: string) {
  const existing = await getDocs(
    query(
      collection(db, 'lists'),
      where('classId', '==', classId),
      where('ownerId', '==', studentUid),
      where('ownerType', '==', 'student_board'),
    ),
  )
  if (!existing.empty) return

  const batch = writeBatch(db)
  DEFAULT_STUDENT_LISTS.forEach((title, index) => {
    const listRef = doc(collection(db, 'lists'))
    batch.set(listRef, {
      classId,
      ownerId: studentUid,
      ownerType: 'student_board',
      title,
      order: (index + 1) * 1000,
      createdAt: Date.now(),
    })
  })
  await batch.commit()
}
