import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { JoinCodeError, useClassActions } from './useClassActions'
import { isFirebaseConfigured } from '../../lib/firebase'

export function JoinClassPage() {
  const profile = useCurrentUser()
  const { joinClassByCode } = useClassActions()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setError(null)
    setIsSubmitting(true)
    try {
      await joinClassByCode(code, profile)
      navigate('/board')
    } catch (err) {
      setError(err instanceof JoinCodeError ? err.message : '참여 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-xl font-bold text-slate-900">학급 참여하기</h1>
      <p className="mb-6 text-sm text-slate-500">
        선생님께 받은 참여 코드를 입력하면 내 기록 공간이 바로 만들어져요.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="참여 코드 (예: AB3XQ9)"
          maxLength={6}
          className="rounded-md border border-slate-300 px-3 py-2 text-center text-lg font-semibold uppercase tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          disabled={!isFirebaseConfigured || isSubmitting}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={!isFirebaseConfigured || isSubmitting || !code.trim()}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '참여하는 중...' : '참여하기'}
        </button>
      </form>
    </div>
  )
}
