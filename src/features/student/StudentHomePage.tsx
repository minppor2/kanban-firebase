import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useCurrentClass } from '../../hooks/useCurrentClass'
import { useClassDoc } from '../../hooks/useClassDoc'
import { BoardPage } from '../board/BoardPage'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export function StudentHomePage() {
  const { uid } = useCurrentUser()
  const { membership, isLoading: isMembershipLoading } = useCurrentClass()
  const { classDoc } = useClassDoc(membership?.classId)

  if (isMembershipLoading) return <p className="text-sm text-slate-500">불러오는 중...</p>
  if (!membership) return <p className="text-sm text-slate-500">먼저 학급에 참여해주세요.</p>

  return (
    <div className="flex flex-col gap-8">
      {classDoc && classDoc.schedule.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-600">수업 일정</h2>
          <div className="flex flex-wrap gap-2">
            {classDoc.schedule
              .slice()
              .sort((a, b) => a.day - b.day || a.period - b.period)
              .map((entry, i) => (
                <span
                  key={i}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {DAY_LABELS[entry.day]}요일 {entry.period}교시{entry.label ? ` · ${entry.label}` : ''}
                </span>
              ))}
          </div>
        </section>
      )}

      {classDoc && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-600">선생님 공지</h2>
          <BoardPage
            classId={membership.classId}
            ownerId={classDoc.teacherId}
            ownerType="teacher_announcements"
            mode="readonly"
            onlyPublic
            emptyMessage="아직 공개된 공지가 없습니다."
          />
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-600">내 기록</h2>
        <BoardPage classId={membership.classId} ownerId={uid} ownerType="student_board" mode="edit" />
      </section>
    </div>
  )
}
