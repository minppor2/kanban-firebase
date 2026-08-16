import type { UserProfile } from '../types/models'

export const MOCK_TEACHER: UserProfile = {
  uid: 'mock-teacher-uid',
  displayName: '김선생',
  email: 'teacher@example.com',
  role: 'teacher',
  createdAt: 0,
}

export const MOCK_STUDENT: UserProfile = {
  uid: 'mock-student-uid',
  displayName: '학생1',
  email: 'student@example.com',
  role: 'student',
  createdAt: 0,
}
