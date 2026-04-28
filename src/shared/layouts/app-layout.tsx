import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@shared/layouts/app-sidebar'
import { Header } from '@shared/layouts/header'
import { Footer } from '@shared/layouts/footer'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex min-h-screen bg-[var(--bg-page,#f4f1ea)] dark:bg-gray-950">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}
