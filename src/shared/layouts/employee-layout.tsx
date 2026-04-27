import { Outlet } from '@tanstack/react-router'
import { EmployeeSidebar } from '@shared/layouts/employee-sidebar'
import { Header } from '@shared/layouts/header'

export function EmployeeLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-page,#f4f1ea)] dark:bg-gray-950">
      <EmployeeSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <Outlet />
      </div>
    </div>
  )
}
