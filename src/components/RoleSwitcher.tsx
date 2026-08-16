import { useCurrentUser, useSetActiveRole } from '../hooks/useCurrentUser'
import type { Role } from '../types/models'

export function RoleSwitcher() {
  const { role, displayName } = useCurrentUser()
  const setActiveRole = useSetActiveRole()

  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span className="hidden sm:inline">보기</span>
      <select
        value={role}
        onChange={(e) => setActiveRole(e.target.value as Role)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="teacher">교사 · {role === 'teacher' ? displayName : '김선생'}</option>
        <option value="student">학생 · {role === 'student' ? displayName : '학생1'}</option>
      </select>
    </label>
  )
}
