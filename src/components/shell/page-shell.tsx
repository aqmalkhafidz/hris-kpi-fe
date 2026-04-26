import { ReactNode } from 'react'
import { Header } from './header'

interface PageShellProps {
  children: ReactNode
  breadcrumb?: string
  primary?: ReactNode
  sidebar?: ReactNode
}

export function PageShell({ children, breadcrumb, primary, sidebar }: PageShellProps) {
  return (
    <div className="flex min-h-screen bg-[var(--bg-page,#f4f1ea)] dark:bg-gray-950">
      {sidebar}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
