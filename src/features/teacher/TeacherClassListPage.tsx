import { Link, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useTeacherClasses } from './useTeacherClasses'
import { CreateClassForm } from '../class/CreateClassForm'

export function TeacherClassListPage() {
  const { uid } = useCurrentUser()
  const { classes, isLoading } = useTeacherClasses(uid)
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="mb-4 text-lg font-bold text-slate-900">내 학급</h1>
        {isLoading && <p className="text-sm text-slate-500">불러오는 중...</p>}
        {!isLoading && classes.length === 0 && (
          <p className="text-sm text-slate-500">아직 만든 학급이 없습니다. 아래에서 새 학급을 만들어보세요.</p>
        )}
        {!isLoading && classes.length > 0 && (
          <ul className="flex flex-col gap-2">
            {classes.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/teacher/${c.id}`}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-indigo-300"
                >
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className="font-mono text-xs text-slate-400">{c.joinCode}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="max-w-sm">
        <h2 className="mb-2 text-sm font-semibold text-slate-600">새 학급 만들기</h2>
        <CreateClassForm onCreated={(classId) => navigate(`/teacher/${classId}`)} />
      </section>
    </div>
  )
}
