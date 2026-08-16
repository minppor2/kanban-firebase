import { useParams } from 'react-router-dom'
import { useCurrentClass } from '../../hooks/useCurrentClass'
import { useRoster } from './useRoster'
import { BoardPage } from '../board/BoardPage'

export function StudentBoardViewPage() {
  const { studentUid } = useParams<{ studentUid: string }>()
  const { membership, isLoading: isMembershipLoading } = useCurrentClass()
  const { students, isLoading: isRosterLoading } = useRoster(membership?.classId)

  if (isMembershipLoading || isRosterLoading) {
    return <p className="text-sm text-slate-500">불러오는 중...</p>
  }
  if (!membership || !studentUid) {
    return <p className="text-sm text-slate-500">학생을 찾을 수 없습니다.</p>
  }

  const student = students.find((s) => s.userId === studentUid)

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-slate-900">
        {student?.displayName ?? '학생'}의 보드
      </h1>
      <p className="mb-4 text-xs text-slate-400">
        학생이 &ldquo;선생님께 공개&rdquo;로 전환한 기록만 표시됩니다.
      </p>
      <BoardPage
        classId={membership.classId}
        ownerId={studentUid}
        ownerType="student_board"
        mode="readonly"
        onlyPublic
        emptyMessage="공개된 기록이 없습니다."
      />
    </div>
  )
}
