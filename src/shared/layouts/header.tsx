import { useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Avatar } from './avatar'
import { Icon } from './icon'
import { useAuth } from '@features/auth/context/auth-context'
import { applyTheme, getInitialTheme, toggleTheme, ThemeMode } from '@shared/lib/theme'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps = {}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme())
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate({ to: '/login' })
  }

  const handleThemeToggle = () => {
    const next = toggleTheme(theme)
    setTheme(next)
    applyTheme(next)
  }

  if (!user) return null

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-md dark:border-gray-800/60 dark:bg-gray-950/80">
      <div className="flex h-14 items-center gap-3 px-6">

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-white/[0.08] lg:hidden"
        >
          {Icon.menu}
        </button>

        {/* Search */}
        <div className="relative hidden md:block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {Icon.search}
          </span>
          <input
            type="text"
            placeholder="Search…"
            className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-10 text-sm text-gray-700 placeholder:text-gray-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:bg-gray-800"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1 py-px font-mono text-[10px] leading-none text-gray-400 dark:border-gray-700 dark:bg-gray-900">
            ⌘K
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">

          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label="Toggle dark mode"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.04] dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-white/[0.08]"
          >
            <span className="text-base leading-none">{theme === 'dark' ? '☾' : '☼'}</span>
          </button>

          {/* Profile */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-1.5 py-1 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.04] dark:hover:border-gray-700 dark:hover:bg-white/[0.08]"
            >
              <Avatar initials={user.initials} size="sm" tone="brand" />
              <div className="hidden pr-1 text-left lg:block">
                <p className="text-sm font-semibold leading-tight text-gray-800 dark:text-white/90">{user.name}</p>
                <p className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">{user.position}</p>
              </div>
              <span className="hidden pr-0.5 text-gray-400 lg:block">{Icon.chevDown}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg shadow-gray-200/60 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/30">
                <div className="mb-1 border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{user.position}</p>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); navigate({ to: '/my-account' }) }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                >
                  {Icon.user} My Account
                </button>
                <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-error-700 transition hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
