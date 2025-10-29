"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updatePlayerBalance(
  playerId: string,
  type: "credits" | "money",
  operation: "add" | "subtract",
  amount: number,
) {
  try {
    const supabase = await getSupabaseServerClient()

    // Get current balance
    const { data: player } = await supabase
      .from("users")
      .select("credits, real_money_balance")
      .eq("id", playerId)
      .single()

    if (!player) {
      return { success: false, message: "Player not found" }
    }

    let newValue: number
    if (type === "credits") {
      newValue = operation === "add" ? player.credits + amount : player.credits - amount
      if (newValue < 0) newValue = 0

      await supabase.from("users").update({ credits: newValue }).eq("id", playerId)
    } else {
      newValue = operation === "add" ? player.real_money_balance + amount : player.real_money_balance - amount
      if (newValue < 0) newValue = 0

      await supabase.from("users").update({ real_money_balance: newValue }).eq("id", playerId)
    }

    // Log transaction
    await supabase.from("transactions").insert({
      user_id: playerId,
      transaction_type: operation === "add" ? "admin_credit" : "admin_debit",
      amount_credits: type === "credits" ? amount : 0,
      amount_real_money: type === "money" ? amount : 0,
      description: `Admin ${operation} ${amount} ${type}`,
    })

    revalidatePath("/admin/players")
    return {
      success: true,
      message: `Successfully ${operation === "add" ? "added" : "subtracted"} ${amount} ${type}`,
    }
  } catch (error) {
    console.error("[v0] Error updating player balance:", error)
    return { success: false, message: "Failed to update balance" }
  }
}

export async function createShopItem(itemData: {
  category: string
  name: string
  description: string
  price_credits: number | null
  price_real_money: number | null
  discount_percentage: number
  image_url: string | null
  stock: number
  published_to_store?: boolean // Added published_to_store field
}) {
  try {
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from("shop_items").insert({
      ...itemData,
      published_to_store: itemData.published_to_store ?? true, // Default to true
    })

    if (error) throw error

    revalidatePath("/admin/shop-management")
    revalidatePath("/admin/shop")
    return { success: true, message: "Shop item created successfully" }
  } catch (error) {
    console.error("[v0] Error creating shop item:", error)
    return { success: false, message: "Failed to create shop item" }
  }
}

export async function updateShopItem(
  itemId: string,
  itemData: Partial<{
    name: string
    description: string
    price_credits: number | null
    price_real_money: number | null
    discount_percentage: number
    stock: number
    is_active: boolean
  }>,
) {
  try {
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from("shop_items").update(itemData).eq("id", itemId)

    if (error) throw error

    revalidatePath("/admin/shop-management")
    revalidatePath("/admin/shop")
    return { success: true, message: "Shop item updated successfully" }
  } catch (error) {
    console.error("[v0] Error updating shop item:", error)
    return { success: false, message: "Failed to update shop item" }
  }
}

export async function deleteShopItem(itemId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from("shop_items").delete().eq("id", itemId)

    if (error) throw error

    revalidatePath("/admin/shop-management")
    revalidatePath("/admin/shop")
    return { success: true, message: "Shop item deleted successfully" }
  } catch (error) {
    console.error("[v0] Error deleting shop item:", error)
    return { success: false, message: "Failed to delete shop item" }
  }
}

export async function getAdmins() {
  try {
    const supabase = await getSupabaseServerClient()

    const { data: admins, error } = await supabase
      .from("admins")
      .select(
        `
        id,
        steam_id,
        steam_name,
        created_at,
        admin_groups (
          group_name
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (error) throw error

    // Get warnings for each admin
    const adminsWithData = await Promise.all(
      (admins || []).map(async (admin) => {
        // Get warnings (limit to 5 most recent)
        const { data: warnings } = await supabase
          .from("admin_warnings")
          .select("id, warning_message, issued_by_name, created_at")
          .eq("admin_id", admin.id)
          .order("created_at", { ascending: false })
          .limit(5)

        // Get activity for current week
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        weekStart.setHours(0, 0, 0, 0)

        const { data: activity } = await supabase
          .from("admin_activity")
          .select("*")
          .eq("admin_id", admin.id)
          .eq("week_start", weekStart.toISOString().split("T")[0])
          .single()

        return {
          id: admin.id,
          steam_id: admin.steam_id,
          steam_name: admin.steam_name,
          group_name: admin.admin_groups?.group_name || "No Group",
          warnings: warnings || [],
          admin_since: admin.created_at,
          last_connection: activity?.last_connection || admin.created_at,
          weekly_activity: {
            day_1_hours: activity?.day_1_hours || 0,
            day_1_actions: activity?.day_1_actions || "0/0/0",
            day_2_hours: activity?.day_2_hours || 0,
            day_2_actions: activity?.day_2_actions || "0/0/0",
            day_3_hours: activity?.day_3_hours || 0,
            day_3_actions: activity?.day_3_actions || "0/0/0",
            day_4_hours: activity?.day_4_hours || 0,
            day_4_actions: activity?.day_4_actions || "0/0/0",
          },
        }
      }),
    )

    return { success: true, data: adminsWithData }
  } catch (error) {
    console.error("[v0] Error fetching admins:", error)
    return { success: false, error: "Failed to fetch admins" }
  }
}

export async function addAdminWarning(adminId: string, warningMessage: string) {
  try {
    const supabase = await getSupabaseServerClient()

    // Get current user info (you may need to adjust this based on your auth setup)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if admin already has 5 warnings
    const { data: existingWarnings } = await supabase.from("admin_warnings").select("id").eq("admin_id", adminId)

    if (existingWarnings && existingWarnings.length >= 5) {
      return { success: false, error: "Admin already has maximum warnings (5)" }
    }

    const { error } = await supabase.from("admin_warnings").insert({
      admin_id: adminId,
      warning_message: warningMessage,
      issued_by_steam_id: user.id,
      issued_by_name: user.email || "Admin",
    })

    if (error) throw error

    revalidatePath("/admin/admins")
    return { success: true, message: "Warning added successfully" }
  } catch (error) {
    console.error("[v0] Error adding warning:", error)
    return { success: false, error: "Failed to add warning" }
  }
}

export async function deleteAdminWarning(warningId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from("admin_warnings").delete().eq("id", warningId)

    if (error) throw error

    revalidatePath("/admin/admins")
    return { success: true, message: "Warning deleted successfully" }
  } catch (error) {
    console.error("[v0] Error deleting warning:", error)
    return { success: false, error: "Failed to delete warning" }
  }
}
