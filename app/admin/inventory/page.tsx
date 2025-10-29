import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { InventoryFilters } from "@/components/inventory/inventory-filters"
import { InventoryGrid } from "@/components/inventory/inventory-grid"

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

async function getInventoryItems(userId: string | null) {
  if (!userId) return []

  const supabase = await getSupabaseServerClient()
  const { data: items } = await supabase
    .from("inventory")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return items || []
}

export default async function InventoryPage() {
  const user = await getUser()
  const inventoryItems = await getInventoryItems(user?.id || null)

  const { DEMO_USER, DEMO_INVENTORY_ITEMS } = await import("@/lib/demo-data")
  const displayUser = user || DEMO_USER
  const displayItems = inventoryItems.length > 0 ? inventoryItems : DEMO_INVENTORY_ITEMS

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-6">
        <div className="mb-6 p-4 rounded-lg bg-card border border-border inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-primary">📦</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold text-foreground">{displayItems.length}</p>
          </div>
        </div>

        {!user && (
          <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-amber-500">
              You are viewing demo inventory.{" "}
              <a href="/login" className="underline font-medium">
                Login
              </a>{" "}
              to see your items.
            </p>
          </div>
        )}
        <InventoryFilters />
        <InventoryGrid items={displayItems} />
      </main>
    </div>
  )
}
