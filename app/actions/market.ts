"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function listItemOnMarket(itemId: string, price: number) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return { success: false, message: "Not authenticated" }
    }

    const supabase = await getSupabaseServerClient()

    // Get the item
    const { data: item } = await supabase.from("inventory").select("*").eq("id", itemId).single()

    if (!item) {
      return { success: false, message: "Item not found" }
    }

    if (item.user_id !== sessionCookie.value) {
      return { success: false, message: "Unauthorized" }
    }

    if (item.is_locked) {
      return { success: false, message: "Cannot list locked items" }
    }

    if (item.equipped_t || item.equipped_ct) {
      return { success: false, message: "Cannot list equipped items. Unequip first." }
    }

    // Calculate tax
    const taxPercentage = 30
    const taxAmount = Math.floor(price * (taxPercentage / 100))

    // Create listing
    await supabase.from("market_listings").insert({
      seller_id: sessionCookie.value,
      inventory_item_id: itemId,
      price,
      quantity: 1,
      tax_percentage: taxPercentage,
      tax_amount: taxAmount,
    })

    revalidatePath("/admin/market")
    return { success: true, message: "Item listed successfully!" }
  } catch (error) {
    console.error("[v0] List item error:", error)
    return { success: false, message: "Failed to list item" }
  }
}

export async function purchaseMarketItem(listingId: string) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return { success: false, message: "Not authenticated" }
    }

    const supabase = await getSupabaseServerClient()

    // Get buyer
    const { data: buyer } = await supabase.from("users").select("*").eq("id", sessionCookie.value).single()

    if (!buyer) {
      return { success: false, message: "User not found" }
    }

    // Get listing with item details
    const { data: listing } = await supabase
      .from("market_listings")
      .select("*, inventory_item:inventory(*)")
      .eq("id", listingId)
      .single()

    if (!listing) {
      return { success: false, message: "Listing not found" }
    }

    if (listing.seller_id === sessionCookie.value) {
      return { success: false, message: "Cannot purchase your own listing" }
    }

    const totalPrice = listing.price + (listing.tax_amount || 0)

    if (buyer.credits < totalPrice) {
      return { success: false, message: "Insufficient credits" }
    }

    // Deduct credits from buyer
    await supabase
      .from("users")
      .update({ credits: buyer.credits - totalPrice })
      .eq("id", buyer.id)

    // Add credits to seller (minus tax)
    const { data: seller } = await supabase.from("users").select("credits").eq("id", listing.seller_id).single()

    if (seller) {
      await supabase
        .from("users")
        .update({ credits: seller.credits + listing.price })
        .eq("id", listing.seller_id)
    }

    // Transfer item to buyer
    await supabase.from("inventory").update({ user_id: buyer.id }).eq("id", listing.inventory_item_id)

    // Delete listing
    await supabase.from("market_listings").delete().eq("id", listingId)

    // Record transactions
    await supabase.from("transactions").insert([
      {
        user_id: buyer.id,
        transaction_type: "purchase",
        item_name: listing.inventory_item.item_name,
        amount_credits: totalPrice,
        description: `Purchased ${listing.inventory_item.item_name} from market`,
      },
      {
        user_id: listing.seller_id,
        transaction_type: "sale",
        item_name: listing.inventory_item.item_name,
        amount_credits: listing.price,
        description: `Sold ${listing.inventory_item.item_name} on market`,
      },
    ])

    revalidatePath("/admin/market")
    return { success: true, message: "Item purchased successfully!" }
  } catch (error) {
    console.error("[v0] Purchase market item error:", error)
    return { success: false, message: "Failed to purchase item" }
  }
}

export async function cancelListing(listingId: string) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return { success: false, message: "Not authenticated" }
    }

    const supabase = await getSupabaseServerClient()

    // Get listing
    const { data: listing } = await supabase.from("market_listings").select("*").eq("id", listingId).single()

    if (!listing) {
      return { success: false, message: "Listing not found" }
    }

    if (listing.seller_id !== sessionCookie.value) {
      return { success: false, message: "Unauthorized" }
    }

    // Delete listing
    await supabase.from("market_listings").delete().eq("id", listingId)

    revalidatePath("/admin/market")
    return { success: true, message: "Listing cancelled successfully!" }
  } catch (error) {
    console.error("[v0] Cancel listing error:", error)
    return { success: false, message: "Failed to cancel listing" }
  }
}
