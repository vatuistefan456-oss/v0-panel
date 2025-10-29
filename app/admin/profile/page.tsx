import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileCharts } from "@/components/profile/profile-charts"
import { TransactionHistory } from "@/components/profile/transaction-history"

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

async function getTransactions(userId: string | null) {
  if (!userId) return []

  const supabase = await getSupabaseServerClient()
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  return transactions || []
}

export default async function ProfilePage() {
  const user = await getUser()

  const { DEMO_USER } = await import("@/lib/demo-data")
  const displayUser = user || DEMO_USER

  const transactions = await getTransactions(user?.id || null)

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
              to see your actual profile.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProfileStats user={displayUser} />
            <ProfileCharts user={displayUser} />
            <TransactionHistory transactions={transactions} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">{/* Additional profile widgets can go here */}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
