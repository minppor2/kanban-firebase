import { useState, type FormEvent } from 'react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useClassActions } from './useClassActions'
import { isFirebaseConfigured } from '../../lib/firebase'

export function CreateClassForm({ onCreated }: { onCreated: (classId: string) => void }) {
  const profile = useCurrentUser()
  const { createClass } = useClassActions()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)
    setIsSubmitting(true)
    try {
      const classId = await createClass(name.trim(), profile)
      onCreated(classId)
    } catch {
      setError('학급 생성 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-xl font-bold text-slate-900">학급 만들기</h1>
      <p className="mb-6 text-sm text-slate-500">
        학급 이름만 입력하면 참여 코드가 자동으로 생성돼요.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="학급 이름 (예: 3학년 2반)"
          className="rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          disabled={!isFirebaseConfigured || isSubmitting}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={!isFirebaseConfigured || isSubmitting || !name.trim()}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '만드는 중...' : '학급 만들기'}
        </button>
      </form>
    </div>
  )
}
