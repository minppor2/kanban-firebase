export type Role = 'teacher' | 'student'

export type OwnerType = 'teacher_announcements' | 'student_board'

export type Visibility = 'private' | 'public'

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  role: Role
  createdAt: number
}

export interface ScheduleEntry {
  day: number // 0 = Sunday .. 6 = Saturday
  period: number
  label?: string
}

export interface ClassDoc {
  id: string
  name: string
  teacherId: string
  joinCode: string
  schedule: ScheduleEntry[]
  createdAt: number
}

export interface JoinCodeDoc {
  code: string
  classId: string
  active: boolean
  createdAt: number
}

export interface MembershipDoc {
  id: string // `${classId}_${userId}`
  classId: string
  userId: string
  role: Role
  displayName: string
  joinedAt: number
}

export interface ListDoc {
  id: string
  classId: string
  ownerId: string
  ownerType: OwnerType
  title: string
  order: number
  createdAt: number
}

export interface CardDoc {
  id: string
  listId: string
  classId: string
  ownerId: string
  ownerType: OwnerType
  title: string
  description: string
  order: number
  visibility: Visibility
  createdAt: number
  updatedAt: number
}
