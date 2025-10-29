"use client"

import { ArrowLeft, Bell, Coins, DollarSign, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { logoutAction } from "@/app/actions/auth"

interface TopHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  user?: {
    username: string
    credits?: number
    real_money?: number
  }
  isGuest?: boolean
  onMenuClick?: () => void
}

export function TopHeader({ title, subtitle, showBack = false, user, isGuest = false, onMenuClick }: TopHeaderProps) {
  const router = useRouter()
  const credits = user?.credits || 1500
  const realMoney = user?.real_money || 25.5

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Menu Button (Mobile) + Back Button + Title */}
        <div className="flex items-center gap-2 md:gap-4">
          {onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          )}

          {showBack && (
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-sm md:text-lg font-bold text-primary">CS</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-semibold text-foreground">{title}</h1>
              {subtitle && <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Right: Credits, Real Money, Notifications, User Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Credits Balance */}
          <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-lg bg-card border border-border">
            <Coins className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
            <span className="text-xs md:text-sm font-medium text-foreground">{credits.toLocaleString()}</span>
          </div>

          {/* Real Money Balance */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-foreground">${realMoney.toFixed(2)}</span>
          </div>

          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-accent text-sm">
                    <p className="font-medium">Welcome to CS2 Panel!</p>
                    <p className="text-xs text-muted-foreground">Get started by exploring the shop</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2 md:px-4">
                <Avatar className="w-6 h-6 md:w-8 md:h-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs md:text-sm">
                    {user?.username?.charAt(0).toUpperCase() || "D"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">{user?.username || "DemoPlayer"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isGuest ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={logoutAction}>
                      <button type="submit" className="w-full text-left">
                        Logout
                      </button>
                    </form>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
