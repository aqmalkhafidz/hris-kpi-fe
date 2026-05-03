import { useAuth } from '@features/auth/context/auth-context';
import type { UserRole } from '@features/auth/types';
import { Badge } from '@shared/ui/badge';
import { Link, LinkProps, useRouterState } from '@tanstack/react-router';
import { ReactNode } from 'react';
import { Icon } from './icon';

type SidebarItem = {
  id: string;
  label: string;
  icon: ReactNode;
  link: LinkProps;
  badge?: string;
  roles: UserRole[];
};

type SidebarGroup = {
  id: string;
  label?: string;
  items: SidebarItem[];
};

const GROUPS: SidebarGroup[] = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Icon.dash,
        link: { to: '/dashboard' },
        roles: ['staff', 'sl', 'hodept', 'hodiv'],
      },
      {
        id: 'hr-dashboard',
        label: 'Dashboard',
        icon: Icon.dash,
        link: { to: '/hr/dashboard' },
        roles: ['hr'],
      },
    ],
  },
  {
    id: 'appraisal',
    label: 'Appraisal',
    items: [
      {
        id: 'self-appraisal',
        label: 'Self-Appraisal',
        icon: Icon.target,
        link: { to: '/self-appraisal' },
        roles: ['staff', 'sl'],
      },
      {
        id: 'team-reviews-sl',
        label: 'Team Reviews',
        icon: Icon.team,
        link: { to: '/review/sl/$appraisalId', params: { appraisalId: '3' } },
        badge: '2',
        roles: ['sl'],
      },
      {
        id: 'team-reviews-hodept',
        label: 'Team Reviews',
        icon: Icon.team,
        link: { to: '/review/hod/$appraisalId', params: { appraisalId: '1' } },
        badge: '2',
        roles: ['hodept'],
      },
      {
        id: 'team-reviews-hodiv',
        label: 'Team Reviews',
        icon: Icon.team,
        link: {
          to: '/review/hodiv/$appraisalId',
          params: { appraisalId: '1' },
        },
        badge: '2',
        roles: ['hodiv'],
      },
      {
        id: 'history',
        label: 'History Appraisal',
        icon: Icon.clock,
        link: { to: '/history-appraisal' },
        roles: ['staff', 'sl', 'hodept', 'hodiv'],
      },
    ],
  },
  {
    id: 'hr',
    label: 'HR Console',
    items: [
      {
        id: 'hr-organization',
        label: 'Organization',
        icon: Icon.building,
        link: { to: '/hr/organization' },
        roles: ['hr'],
      },
      {
        id: 'hr-templates',
        label: 'KRA Templates',
        icon: Icon.layers,
        link: { to: '/hr/kra-templates' },
        roles: ['hr'],
      },
      {
        id: 'hr-cycles',
        label: 'Cycles',
        icon: Icon.cycle,
        link: { to: '/hr/cycles' },
        roles: ['hr'],
      },
      {
        id: 'hr-reports',
        label: 'Reports',
        icon: Icon.paper,
        link: { to: '/hr/reports' },
        roles: ['hr'],
      },
    ],
  },
];

interface AppSidebarProps {
  open?: boolean;
  minimized?: boolean;
  onClose?: () => void;
}

export function AppSidebar({
  open = false,
  minimized = false,
  onClose,
}: AppSidebarProps = {}) {
  const { location } = useRouterState();
  const path = location.pathname;
  const { user } = useAuth();
  if (!user) return null;

  const isHr = user.role === 'hr';
  const homeLink: LinkProps = isHr
    ? { to: '/hr/dashboard' }
    : { to: '/dashboard' };
  const visibleGroups = GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(user.role)),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}
      <aside
        onClick={() => {
          const isDesktop = window.innerWidth >= 1024;
          if (!isDesktop) onClose?.();
        }}
        className={`fixed inset-y-0 left-0 z-40 flex h-screen shrink-0 transform flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-0 lg:z-0 lg:translate-x-0 ${
          minimized ? 'w-20 px-2 py-6' : 'w-64 px-5 py-6'
        } ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <Link {...homeLink} className="flex items-center gap-2.5 px-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M5 17l4-9 3 6 3-4 4 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {!minimized && (
            <div>
              <p className="text-sm font-bold tracking-tight text-gray-800 dark:text-white">
                Performa
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {isHr ? 'HR Console' : 'Employee'}
              </p>
            </div>
          )}
        </Link>

        <nav className={`mt-6 flex flex-col ${minimized ? 'gap-2' : 'gap-4'}`}>
          {visibleGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1">
              {!minimized && group.label && (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const target = String(item.link.to ?? '');
                const isActive =
                  path === target ||
                  (target.length > 0 && path.startsWith(target + '/'));
                return (
                  <Link
                    key={item.id}
                    {...item.link}
                    className={`group flex items-center rounded-xl transition-colors ${
                      minimized
                        ? 'h-10 w-10 justify-center'
                        : 'gap-3 px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
                    }`}
                    title={minimized ? item.label : undefined}
                  >
                    <span
                      className={
                        isActive
                          ? 'text-brand-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }
                    >
                      {item.icon}
                    </span>
                    {!minimized && (
                      <>
                        <span className="flex-1 text-sm font-medium">
                          {item.label}
                        </span>
                        {item.badge && <Badge tone="brand">{item.badge}</Badge>}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
