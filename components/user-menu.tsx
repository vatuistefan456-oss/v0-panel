"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, UserCircle, ExternalLink } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { useTransition } from "react"
import { toast } from "sonner"

interface UserMenuProps {
  user: {
    username: string
    steam_name: string | null
    steam_avatar_url: string | null
    steam_id: string
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logout()
      if (result.success) {
        toast.success("Logged out successfully")
      }
    })
  }

  const openSteamProfile = () => {
    window.open(`https://steamcommunity.com/profiles/${user.steam_id}`, "_blank")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {user.steam_avatar_url ? (
            <img
              src={user.steam_avatar_url || "/placeholder.svg"}
              alt={user.username}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="hidden md:inline">{user.steam_name || user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.username}</p>
            {user.steam_name && <p className="text-xs text-muted-foreground">{user.steam_name}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/admin/profile" className="cursor-pointer">
            <UserCircle className="w-4 h-4 mr-2" />
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openSteamProfile}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Steam Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
