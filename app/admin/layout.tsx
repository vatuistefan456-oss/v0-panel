import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { AdminLayoutClient } from "@/components/admin-layout-client"

async function getUser() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return null
    }

    const supabase = await getSupabaseServerClient()
    const { data: user } = await supabase.from("users").select("*").eq("id", sessionCookie.value).maybeSingle()

    return user
  } catch (error) {
    console.error("[v0] Error fetching user:", error)
    return null
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  const displayUser = user || {
    username: "DemoPlayer",
    steam_name: "Demo Player (Guest Mode)",
  }

  return (
    <AdminLayoutClient user={displayUser} isGuest={!user}>
      {children}
    </AdminLayoutClient>
  )
}
