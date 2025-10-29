"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  User,
  Shield,
  Search,
  Trophy,
  Settings,
  Users,
  Wrench,
  UserCog,
  UsersRound,
  ChevronDown,
  Crown,
  BookOpen,
  ShoppingBag,
  Grid3x3,
  AlertTriangle,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"

interface AdminNavProps {
  userPermissions?: {
    isRoot?: boolean
  }
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Shop",
    href: "/admin/shop",
    icon: ShoppingCart,
    badge: "-35%",
    badgeVariant: "destructive" as const,
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
    badgeVariant: "default" as const,
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
  {
    label: "Profile",
    href: "/admin/profile",
    icon: User,
  },
  {
    label: "Restrictions",
    href: "/admin/restrictions",
    icon: AlertTriangle,
  },
  {
    label: "Moderation",
    href: "/admin/moderation",
    icon: Shield,
  },
  {
    label: "Players",
    href: "/admin/players",
    icon: Users,
  },
  {
    label: "Admins",
    href: "/admin/admins",
    icon: Shield,
  },
  {
    label: "Manage Admins+Vips",
    icon: Shield,
    children: [
      {
        label: "Admin Groups",
        href: "/admin/admin-groups",
        icon: UsersRound,
      },
      {
        label: "Admin Users",
        href: "/admin/admin-users",
        icon: UserCog,
      },
      {
        label: "VIP Management",
        href: "/admin/vip-management",
        icon: Crown,
      },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    requiresRoot: true,
    children: [
      {
        label: "Shop Mgmt",
        href: "/admin/shop-management",
        icon: Wrench,
      },
      {
        label: "Site Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
  {
    label: "Search Players",
    href: "/search",
    icon: Search,
  },
]

export function AdminNav({ userPermissions }: AdminNavProps) {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const dropdownElement = dropdownRefs.current[openDropdown]
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDropdown])

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }

  return (
    <nav className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-[73px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            if ("requiresRoot" in item && item.requiresRoot && !userPermissions?.isRoot) {
              return null
            }

            const Icon = item.icon

            if ("children" in item && item.children) {
              const isOpen = openDropdown === item.label
              const hasActiveChild = item.children.some((child) => pathname === child.href)

              return (
                <div
                  key={item.label}
                  className="relative"
                  ref={(el) => {
                    dropdownRefs.current[item.label] = el
                  }}
                >
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                      hasActiveChild
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg py-2 min-w-[200px] z-[100]">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon
                        const isActive = pathname === child.href

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                              isActive
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent",
                            )}
                          >
                            <ChildIcon className="w-4 h-4" />
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            // Regular menu items
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 relative",
                  isActive
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {"badge" in item && item.badge && (
                  <Badge variant={item.badgeVariant} className="ml-1 text-xs px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
