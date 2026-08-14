import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { TopNav } from './TopNav'

export function AppLayout() {
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  // Hide top nav only while an active timed session is running (immersive).
  const hideNav = pathname === '/meditation' && params.get('run') === '1'

  return (
    <div className="relative min-h-full bg-[var(--color-moss-deep)] text-[var(--color-ivory)]">
      {!hideNav && <TopNav />}
      <main className={hideNav ? 'min-h-full' : 'min-h-full pt-16'}>
        <Outlet />
      </main>
    </div>
  )
}
