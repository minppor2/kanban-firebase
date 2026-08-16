import { isFirebaseConfigured } from '../../lib/firebase'

export function ConfigBanner() {
  if (isFirebaseConfigured) return null

  return (
    <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      Firebase 설정이 필요합니다 — <code className="font-mono">.env.local</code>에{' '}
      <code className="font-mono">VITE_FIREBASE_*</code> 값을 채워 넣기 전까지 실시간 데이터는
      동작하지 않습니다. (README 참고)
    </div>
  )
}
