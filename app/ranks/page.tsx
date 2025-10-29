import { Suspense } from "react"
import { RanksFilters } from "@/components/ranks/ranks-filters"
import { RanksTable } from "@/components/ranks/ranks-table"
import { TopHeader } from "@/components/top-header"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

async function getUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  const supabase = await getSupabaseServerClient()
  const { data: user } = await supabase.from("users").select("*").eq("id", sessionCookie.value).maybeSingle()

  return user
}

export default async function RanksPage() {
  const user = await getUser()
  const { DEMO_USER } = await import("@/lib/demo-data")
  const displayUser = user || DEMO_USER

  return (
    <div className="min-h-screen bg-background">
      <TopHeader
        title="Ranks"
        subtitle="View player rankings and statistics"
        showBack={true}
        user={displayUser}
        isGuest={!user}
      />

      <main className="container mx-auto px-6 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <RanksFilters />
          <RanksTable />
        </Suspense>
      </main>
    </div>
  )
}
