"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Shield,
  Trophy,
  Settings,
  BookOpen,
  ShoppingBag,
  Grid3x3,
  AlertTriangle,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  LogOut,
  X,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/app/actions/auth"

interface SidebarNavProps {
  user: {
    username: string
    steam_name?: string
  }
  isGuest: boolean
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  {
    label: "Discord",
    href: "https://discord.gg/your-server",
    icon: MessageCircle,
    external: true,
  },
  {
    label: "Help",
    href: "/help",
    icon: HelpCircle,
  },
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Admins",
    href: "/admin/admins",
    icon: Shield,
  },
  {
    label: "Restrictions",
    href: "/admin/restrictions",
    icon: AlertTriangle,
  },
  {
    label: "Shop",
    href: "/admin/shop",
    icon: ShoppingCart,
    badge: "-35%",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Package,
  },
  {
    label: "Recipes",
    href: "/admin/recipes",
    icon: BookOpen,
    badge: "NEW",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    label: "Item market",
    href: "/admin/market",
    icon: ShoppingBag,
  },
  {
    label: "All items",
    href: "/admin/all-items",
    icon: Grid3x3,
  },
  {
    label: "Ranks",
    href: "/ranks",
    icon: Trophy,
  },
]

export function SidebarNav({ user, isGuest, isOpen, onClose }: SidebarNavProps) {
  const pathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0", // Always visible on desktop
          isOpen ? "translate-x-0" : "-translate-x-full", // Slide in/out on mobile
        )}
      >
        <div className="lg:hidden absolute top-4 right-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">RO</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">RO LLG</h1>
              <p className="text-xs text-muted-foreground">CS2 Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              if (item.external) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={onClose}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative",
                    isActive
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {item.badge && (
                    <span className={cn("ml-auto px-2 py-0.5 text-xs font-semibold rounded border", item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}

            {/* Settings Dropdown */}
            <div>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Settings className="w-5 h-5" />
                Settings
                <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform", isSettingsOpen && "rotate-180")} />
              </button>

              {isSettingsOpen && (
                <div className="mt-1 ml-8 space-y-1">
                  <Link
                    href="/admin/shop-management"
                    className={cn(
                      "block px-3 py-2 text-sm rounded-lg transition-colors",
                      pathname === "/admin/shop-management"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    onClick={onClose}
                  >
                    Shop Management
                  </Link>
                  <Link
                    href="/admin/settings"
                    className={cn(
                      "block px-3 py-2 text-sm rounded-lg transition-colors",
                      pathname === "/admin/settings"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    onClick={onClose}
                  >
                    Site Settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* User Info at Bottom */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user.steam_name || "Guest"}</p>
            </div>
          </div>

          {isGuest ? (
            <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <form action={logoutAction}>
              <Button variant="outline" size="sm" className="w-full bg-transparent" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </form>
          )}
        </div>
      </aside>
    </>
  )
}
