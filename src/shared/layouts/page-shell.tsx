import { ReactNode } from 'react'

type MaxWidth = '5xl' | '6xl' | '7xl' | 'full'

interface PageShellProps {
  children: ReactNode
  breadcrumb?: string
  primary?: ReactNode
  sidebar?: ReactNode
  maxWidth?: MaxWidth
}

const WIDTH: Record<MaxWidth, string> = {
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full:  'max-w-none',
}

export function PageShell({ children, maxWidth = '7xl' }: PageShellProps) {
  return (
    <main className="flex-1">
      <div className={`mx-auto ${WIDTH[maxWidth]} space-y-6 px-6 py-8 lg:px-8`}>
        {children}
      </div>
    </main>
  )
}
