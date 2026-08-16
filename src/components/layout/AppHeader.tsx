import { Link, useLocation } from 'react-router-dom'
import { RoleSwitcher } from '../RoleSwitcher'
import { useCurrentUser } from '../../hooks/useCurrentUser'

const TEACHER_LINKS = [
  { to: '/teacher', label: '공지 보드' },
  { to: '/teacher/roster', label: '학생 명단' },
  { to: '/teacher/schedule', label: '수업 일정' },
]

const STUDENT_LINKS = [{ to: '/board', label: '내 보드' }]

export function AppHeader() {
  const { role } = useCurrentUser()
  const { pathname } = useLocation()
  const links = role === 'teacher' ? TEACHER_LINKS : STUDENT_LINKS

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-slate-900">
            수업용 칸반보드
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname === link.to
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <RoleSwitcher />
      </div>
    </header>
  )
}
