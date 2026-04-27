import { Link, useRouterState } from '@tanstack/react-router'
import { Icon } from './icon'
import { useAuth } from '@features/auth/context/auth-context'
import { Badge } from './sidebar-badge'

const ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',      icon: Icon.dash,   to: '/dashboard' as const },
  { id: 'self-appraisal', label: 'Self-Appraisal', icon: Icon.target, to: '/self-appraisal' as const },
  { id: 'my-account',     label: 'My Account',     icon: Icon.user,   to: '/my-account' as const },
]

export function EmployeeSidebar() {
  const { location } = useRouterState()
  const path = location.pathname
  const { user } = useAuth()
  const canReview = user?.role === 'sl' || user?.role === 'hodept' || user?.role === 'hodiv'
  const reviewTo = user?.role === 'sl' ? '/review/sl/a3' : user?.role === 'hodept' ? '/review/hod/a1' : '/review/hodiv/a1'
  const items = canReview
    ? [...ITEMS.slice(0, 2), { id: 'team-reviews', label: 'Team Reviews', icon: Icon.team, to: reviewTo as any, badge: '2' }, ITEMS[2]]
    : ITEMS

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-gray-900 lg:flex">
      <Link to="/dashboard" className="flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M5 17l4-9 3 6 3-4 4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-gray-800 dark:text-white">Performa</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Employee</p>
        </div>
      </Link>

      <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">Menu</p>
      <nav className="mt-2 flex flex-col gap-1">
        {items.map(item => {
          const isActive = path === item.to || path.startsWith(item.to + '/')
          return (
            <Link key={item.id} to={item.to}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
              }`}>
              <span className={isActive ? 'text-brand-500' : 'text-gray-400 group-hover:text-gray-500'}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {'badge' in item && <Badge tone="brand">{item.badge}</Badge>}
            </Link>
          )
        })}
      </nav>

      {user?.role === 'hr' && (
        <Link to="/hr/dashboard" className="mt-auto block rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-white p-4 hover:border-brand-300 dark:border-gray-800 dark:from-brand-500/10 dark:to-transparent">
          <p className="text-xs font-semibold text-gray-800 dark:text-white/90">Switch to HR Console</p>
          <p className="mt-1 text-[11px] leading-snug text-gray-500 dark:text-gray-400">Manage cycles, distribution, reports.</p>
        </Link>
      )}
    </aside>
  )
}
