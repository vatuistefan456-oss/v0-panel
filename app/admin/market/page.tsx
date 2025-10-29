import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { MarketListings } from "@/components/market/market-listings"
import { MyListings } from "@/components/market/my-listings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

async function getMarketListings() {
  const supabase = await getSupabaseServerClient()
  const { data: listings } = await supabase
    .from("market_listings")
    .select(
      `
      *,
      seller:users!seller_id(id, username, steam_name),
      inventory_item:inventory(*)
    `,
    )
    .order("created_at", { ascending: false })

  return listings || []
}

async function getUserListings(userId: string | null) {
  if (!userId) return []

  const supabase = await getSupabaseServerClient()
  const { data: listings } = await supabase
    .from("market_listings")
    .select(
      `
      *,
      inventory_item:inventory(*)
    `,
    )
    .eq("seller_id", userId)
    .order("created_at", { ascending: false })

  return listings || []
}

export default async function MarketPage() {
  const user = await getUser()
  const marketListings = await getMarketListings()
  const userListings = await getUserListings(user?.id || null)

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
              to trade items.
            </p>
          </div>
        )}
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="browse">Browse Market</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings ({userListings.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="browse" className="mt-6">
            <MarketListings
              listings={marketListings}
              currentUserId={displayUser.id}
              userCredits={displayUser.credits}
            />
          </TabsContent>
          <TabsContent value="my-listings" className="mt-6">
            <MyListings listings={userListings} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
