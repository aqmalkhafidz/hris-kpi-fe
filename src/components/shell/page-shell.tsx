import { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  breadcrumb?: string
  primary?: ReactNode
  sidebar?: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="flex-1">
      {children}
    </main>
  )
}
