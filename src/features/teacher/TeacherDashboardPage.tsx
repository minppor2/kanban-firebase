import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useClassDoc } from '../../hooks/useClassDoc'
import { BoardPage } from '../board/BoardPage'

export function TeacherDashboardPage() {
  const { classId } = useParams<{ classId: string }>()
  const { uid } = useCurrentUser()
  const { classDoc, isLoading } = useClassDoc(classId)
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return <p className="text-sm text-slate-500">불러오는 중...</p>
  }
  if (!classId || !classDoc) {
    return <p className="text-sm text-slate-500">학급을 찾을 수 없습니다.</p>
  }

  async function handleCopy() {
    if (!classDoc) return
    await navigator.clipboard.writeText(classDoc.joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900">{classDoc.name}</h1>
          <p className="text-sm text-slate-500">학생 참여 코드</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-slate-100 px-3 py-1.5 font-mono text-lg font-bold tracking-widest text-slate-800">
            {classDoc.joinCode}
          </span>
          <button
            onClick={handleCopy}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {copied ? '복사됨!' : '복사'}
          </button>
        </div>
      </div>

      <h2 className="mb-2 text-sm font-semibold text-slate-600">공지 보드</h2>
      <BoardPage classId={classId} ownerId={uid} ownerType="teacher_announcements" mode="edit" />
    </div>
  )
}
