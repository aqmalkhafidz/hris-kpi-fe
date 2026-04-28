import { AppSidebar } from '@shared/layouts/app-sidebar';
import { Footer } from '@shared/layouts/footer';
import { Header } from '@shared/layouts/header';
import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  const handleMenuClick = () => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      setSidebarMinimized((m) => !m);
    } else {
      setSidebarOpen((o) => !o);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-page,#f4f1ea)] dark:bg-gray-950">
      <AppSidebar
        open={sidebarOpen}
        minimized={sidebarMinimized}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuClick={handleMenuClick} />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
