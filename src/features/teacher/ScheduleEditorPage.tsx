import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../../lib/firebase'
import { useClassDoc } from '../../hooks/useClassDoc'
import type { ScheduleEntry } from '../../types/models'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export function ScheduleEditorPage() {
  const { classId } = useParams<{ classId: string }>()
  const { classDoc, isLoading } = useClassDoc(classId)
  const [entries, setEntries] = useState<ScheduleEntry[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (classDoc) setEntries(classDoc.schedule)
  }, [classDoc])

  if (isLoading) return <p className="text-sm text-slate-500">불러오는 중...</p>
  if (!classId || !classDoc) return <p className="text-sm text-slate-500">학급을 찾을 수 없습니다.</p>

  function addEntry() {
    setEntries((prev) => [...prev, { day: 1, period: 1, label: '' }])
  }

  function updateEntry(index: number, patch: Partial<ScheduleEntry>) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)))
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!classId) return
    setIsSaving(true)
    try {
      await updateDoc(doc(db, 'classes', classId), { schedule: entries })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-4 text-lg font-bold text-slate-900">수업 일정</h1>
      <div className="flex flex-col gap-2">
        {entries.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-sm"
          >
            <select
              value={entry.day}
              onChange={(e) => updateEntry(index, { day: Number(e.target.value) })}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            >
              {DAY_LABELS.map((label, day) => (
                <option key={day} value={day}>
                  {label}요일
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={entry.period}
              onChange={(e) => updateEntry(index, { period: Number(e.target.value) })}
              className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm"
              aria-label="교시"
            />
            <input
              value={entry.label ?? ''}
              onChange={(e) => updateEntry(index, { label: e.target.value })}
              placeholder="과목/메모"
              className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
            <button
              onClick={() => removeEntry(index)}
              className="text-xs text-slate-400 hover:text-red-500"
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={addEntry}
          className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-indigo-300"
        >
          + 일정 추가
        </button>
        <button
          onClick={handleSave}
          disabled={!isFirebaseConfigured || isSaving}
          className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  )
}
