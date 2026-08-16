import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { ConfigBanner } from './ConfigBanner'

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ConfigBanner />
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
