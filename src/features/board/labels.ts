import type { OwnerType } from '../../types/models'

interface BoardLabels {
  addListLabel: string
  addCardLabel: string
  visibilityOnLabel: string
  visibilityOffLabel: string
  toggleToPublic: string
  toggleToPrivate: string
}

const STUDENT_BOARD_LABELS: BoardLabels = {
  addListLabel: '목록 추가',
  addCardLabel: '기록 추가',
  visibilityOnLabel: '선생님께 공개',
  visibilityOffLabel: '나만 보기',
  toggleToPublic: '선생님께 공개하기',
  toggleToPrivate: '나만 보기로 전환',
}

const TEACHER_ANNOUNCEMENT_LABELS: BoardLabels = {
  addListLabel: '목록 추가',
  addCardLabel: '공지 추가',
  visibilityOnLabel: '공개됨',
  visibilityOffLabel: '비공개 (초안)',
  toggleToPublic: '공개하기',
  toggleToPrivate: '비공개로 전환',
}

export function getBoardLabels(ownerType: OwnerType): BoardLabels {
  return ownerType === 'teacher_announcements' ? TEACHER_ANNOUNCEMENT_LABELS : STUDENT_BOARD_LABELS
}
