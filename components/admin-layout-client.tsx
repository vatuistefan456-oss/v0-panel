"use client"

import type React from "react"
import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { TopHeader } from "@/components/top-header"

interface AdminLayoutClientProps {
  children: React.ReactNode
  user: any
  isGuest: boolean
}

export function AdminLayoutClient({ children, user, isGuest }: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav user={user} isGuest={isGuest} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64">
        <TopHeader
          title="CS2 Admin Panel"
          subtitle="Server Management Dashboard"
          user={user}
          isGuest={isGuest}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
