import { Link } from 'react-router-dom'
import { useCurrentClass } from '../../hooks/useCurrentClass'
import { useRoster } from './useRoster'

export function RosterPage() {
  const { membership, isLoading: isMembershipLoading } = useCurrentClass()
  const { students, isLoading: isRosterLoading } = useRoster(membership?.classId)

  if (isMembershipLoading || isRosterLoading) {
    return <p className="text-sm text-slate-500">불러오는 중...</p>
  }

  if (!membership) {
    return <p className="text-sm text-slate-500">먼저 학급을 만들어주세요.</p>
  }

  if (students.length === 0) {
    return <p className="text-sm text-slate-500">아직 참여한 학생이 없습니다.</p>
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-slate-900">학생 명단</h1>
      <ul className="flex flex-col gap-2">
        {students.map((student) => (
          <li key={student.id}>
            <Link
              to={`/teacher/students/${student.userId}`}
              className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-indigo-300"
            >
              <span className="font-medium text-slate-800">{student.displayName}</span>
              <span className="text-xs text-slate-400">보드 보기 →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
