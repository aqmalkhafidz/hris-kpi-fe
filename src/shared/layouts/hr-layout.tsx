import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { HRSidebar } from '@shared/layouts/hr-sidebar'
import { Header } from '@shared/layouts/header'
import { Footer } from '@shared/layouts/footer'

export function HrLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex min-h-screen bg-[var(--bg-page,#f4f1ea)] dark:bg-gray-950">
      <HRSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}
