"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function purchaseItem(itemId: string, paymentMethod: "credits" | "real_money") {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return { success: false, message: "Not authenticated" }
    }

    const supabase = await getSupabaseServerClient()

    // Get user
    const { data: user } = await supabase.from("users").select("*").eq("id", sessionCookie.value).single()

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Get shop item
    const { data: item } = await supabase.from("shop_items").select("*").eq("id", itemId).single()

    if (!item || !item.is_active) {
      return { success: false, message: "Item not available" }
    }

    // Check stock
    if (item.stock !== -1 && item.stock <= 0) {
      return { success: false, message: "Item out of stock" }
    }

    // Calculate price with VIP discount
    const vipDiscount = user.vip_tier === "LEGEND" ? 0.8 : user.vip_tier === "DEFAULT" ? 0.7 : 1
    let finalPrice = 0
    let paymentField = ""

    if (paymentMethod === "credits") {
      if (!item.price_credits) {
        return { success: false, message: "Item cannot be purchased with credits" }
      }
      finalPrice = Math.floor(item.price_credits * vipDiscount)
      paymentField = "credits"

      if (user.credits < finalPrice) {
        return { success: false, message: "Insufficient credits" }
      }
    } else {
      if (!item.price_real_money) {
        return { success: false, message: "Item cannot be purchased with real money" }
      }
      finalPrice = Number.parseFloat((item.price_real_money * vipDiscount).toFixed(2))
      paymentField = "real_money_balance"

      if (user.real_money_balance < finalPrice) {
        return { success: false, message: "Insufficient balance" }
      }
    }

    // Deduct payment
    const newBalance = paymentMethod === "credits" ? user.credits - finalPrice : user.real_money_balance - finalPrice

    await supabase
      .from("users")
      .update({ [paymentField]: newBalance })
      .eq("id", user.id)

    // Update stock if not unlimited
    if (item.stock !== -1) {
      await supabase
        .from("shop_items")
        .update({ stock: item.stock - 1 })
        .eq("id", itemId)
    }

    // Record transaction
    await supabase.from("transactions").insert({
      user_id: user.id,
      transaction_type: "purchase",
      item_name: item.name,
      amount_credits: paymentMethod === "credits" ? finalPrice : 0,
      amount_real_money: paymentMethod === "real_money" ? finalPrice : 0,
      description: `Purchased ${item.name} from shop`,
    })

    // If it's a credit package, add credits to user
    if (item.category === "credits") {
      const creditsToAdd = Number.parseInt(item.name.match(/\d+/)?.[0] || "0")
      await supabase
        .from("users")
        .update({ credits: user.credits + creditsToAdd })
        .eq("id", user.id)
    }

    revalidatePath("/admin/shop")
    return { success: true, message: `Successfully purchased ${item.name}!` }
  } catch (error) {
    console.error("[v0] Purchase error:", error)
    return { success: false, message: "Failed to complete purchase" }
  }
}
