import { Link, LinkProps, useRouterState } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { Icon } from './icon'
import { useAuth } from '@features/auth/context/auth-context'
import { Badge } from '@shared/ui/badge'

type SidebarItem = {
  id: string
  label: string
  icon: ReactNode
  link: LinkProps
  badge?: string
}

const STATIC_ITEMS: SidebarItem[] = [
  { id: 'dashboard',      label: 'Dashboard',      icon: Icon.dash,   link: { to: '/dashboard' } },
  { id: 'self-appraisal', label: 'Self-Appraisal', icon: Icon.target, link: { to: '/self-appraisal' } },
  { id: 'my-account',     label: 'My Account',     icon: Icon.user,   link: { to: '/my-account' } },
]

function teamReviewItem(role: 'sl' | 'hodept' | 'hodiv'): SidebarItem {
  const link: LinkProps =
    role === 'sl'     ? { to: '/review/sl/$appraisalId',    params: { appraisalId: 'a3' } } :
    role === 'hodept' ? { to: '/review/hod/$appraisalId',   params: { appraisalId: 'a1' } } :
                        { to: '/review/hodiv/$appraisalId', params: { appraisalId: 'a1' } }
  return { id: 'team-reviews', label: 'Team Reviews', icon: Icon.team, link, badge: '2' }
}

export function EmployeeSidebar() {
  const { location } = useRouterState()
  const path = location.pathname
  const { user } = useAuth()
  const canReview = user?.role === 'sl' || user?.role === 'hodept' || user?.role === 'hodiv'
  const items: SidebarItem[] = canReview && user
    ? [...STATIC_ITEMS.slice(0, 2), teamReviewItem(user.role as 'sl' | 'hodept' | 'hodiv'), STATIC_ITEMS[2]]
    : STATIC_ITEMS

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
          const target = String(item.link.to ?? '')
          const isActive = path === target || (target.length > 0 && path.startsWith(target + '/'))
          return (
            <Link key={item.id} {...item.link}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
              }`}>
              <span className={isActive ? 'text-brand-500' : 'text-gray-400 group-hover:text-gray-500'}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && <Badge tone="brand">{item.badge}</Badge>}
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
