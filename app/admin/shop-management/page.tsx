import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { ShopManagement } from "@/components/admin/shop-management"
import { ShopItemOrder } from "@/components/admin/shop-item-order"
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

async function getShopItems() {
  const supabase = await getSupabaseServerClient()

  const { data: items } = await supabase.from("shop_items").select("*").order("category")

  const { data: orders } = await supabase.from("shop_item_order").select("*")

  // Create a map of item orders by item_id
  const orderMap = new Map()
  if (orders) {
    orders.forEach((order: any) => {
      orderMap.set(order.item_id, order.display_order)
    })
  }

  // Map items with their order
  const itemsWithOrder = (items || []).map((item: any) => ({
    ...item,
    order: orderMap.get(item.id) || item.display_order || 999,
  }))

  return itemsWithOrder
}

export default async function ShopManagementPage() {
  const user = await getUser()
  const shopItems = await getShopItems()

  const { DEMO_USER } = await import("@/lib/demo-data")
  const displayUser = user || DEMO_USER

  return (
    <main className="container mx-auto px-4 py-6">
      {!user && (
        <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-sm text-amber-500">
            You are viewing in demo mode.{" "}
            <a href="/login" className="underline font-medium">
              Login
            </a>{" "}
            to manage shop items.
          </p>
        </div>
      )}

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manage">Manage Items</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Items</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <ShopManagement items={shopItems} isDemo={!user} />
        </TabsContent>

        <TabsContent value="reorder">
          <ShopItemOrder items={shopItems} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
