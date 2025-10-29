import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { PlayersManagement } from "@/components/admin/players-management"

async function getUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  const supabase = await getSupabaseServerClient()
  const { data: user } = await supabase.from("users").select("*").eq("id", sessionCookie.value).single()

  return user
}

async function getAllPlayers() {
  const supabase = await getSupabaseServerClient()
  const { data: players } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  return players || []
}

export default async function PlayersManagementPage() {
  const user = await getUser()
  const players = await getAllPlayers()

  const { DEMO_USER } = await import("@/lib/demo-data")
  const displayUser = user || DEMO_USER

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-6">
        {!user && (
          <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-amber-500">
              You are viewing in demo mode.{" "}
              <a href="/login" className="underline font-medium">
                Login
              </a>{" "}
              to manage players.
            </p>
          </div>
        )}
        <PlayersManagement players={players} isDemo={!user} />
      </main>
    </div>
  )
}
