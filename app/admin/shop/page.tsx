import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { ShopPageContent } from "@/components/shop/shop-page-content"

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

async function getShopItems() {
  const supabase = await getSupabaseServerClient()
  const { data: items } = await supabase
    .from("shop_items")
    .select("*")
    .eq("is_active", true)
    .eq("published_to_store", true)
    .order("display_order")

  return items || []
}

export default async function ShopPage() {
  const user = await getUser()
  const shopItems = await getShopItems()

  return <ShopPageContent user={user} shopItems={shopItems} />
}
