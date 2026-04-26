import { Outlet } from '@tanstack/react-router'
import { HRSidebar } from '../components/shell/hr-sidebar'

export function HrLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-page,#f4f1ea)] dark:bg-gray-950">
      <HRSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
