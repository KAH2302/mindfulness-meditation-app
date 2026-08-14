import { NavLink } from 'react-router-dom'
import { ko } from '../i18n/ko'

const links = [
  { to: '/', label: ko.navHome, end: true },
  { to: '/meditation', label: ko.navMeditation, end: false },
  { to: '/history', label: ko.navHistory, end: false },
  { to: '/music', label: ko.navMusic, end: false },
]

export function TopNav() {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-md"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-2">
        {links.map((link) => (
          <li key={link.to} className="flex-1">
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center rounded-lg px-2 py-2 text-sm tracking-wide transition',
                  isActive
                    ? 'text-[var(--color-ivory)]'
                    : 'text-[var(--color-ivory-muted)]/70 hover:text-[var(--color-ivory)]',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      'mb-1 h-1 w-1 rounded-full transition',
                      isActive ? 'bg-[var(--color-ivory)]' : 'bg-transparent',
                    ].join(' ')}
                  />
                  {link.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
