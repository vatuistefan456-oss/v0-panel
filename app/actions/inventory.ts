"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function equipItem(itemId: string, side: "t" | "ct") {
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
      return { success: false, message: "Item is locked" }
    }

    if (item.item_type !== "skin") {
      return { success: false, message: "Only skins can be equipped" }
    }

    // Unequip other items of the same weapon type for this side
    if (item.weapon_type) {
      const field = side === "t" ? "equipped_t" : "equipped_ct"
      await supabase
        .from("inventory")
        .update({ [field]: false })
        .eq("user_id", sessionCookie.value)
        .eq("weapon_type", item.weapon_type)
        .neq("id", itemId)
    }

    // Toggle equip status
    const field = side === "t" ? "equipped_t" : "equipped_ct"
    const newStatus = !item[field]

    await supabase
      .from("inventory")
      .update({ [field]: newStatus })
      .eq("id", itemId)

    revalidatePath("/admin/inventory")
    return {
      success: true,
      message: newStatus ? `Equipped for ${side.toUpperCase()} side` : `Unequipped from ${side.toUpperCase()} side`,
    }
  } catch (error) {
    console.error("[v0] Equip error:", error)
    return { success: false, message: "Failed to equip item" }
  }
}

export async function getPlayersOwningItem(weaponName: string, skinName: string) {
  try {
    const supabase = await getSupabaseServerClient()

    // Query inventory items joined with users table
    const { data, error } = await supabase
      .from("inventory")
      .select(`
        id,
        item_name,
        item_skin,
        wear_value,
        wear_condition,
        quality,
        price,
        created_at,
        user_id,
        users!inner (
          id,
          steam_name,
          steam_avatar_url,
          steam_id
        )
      `)
      .eq("item_name", weaponName)
      .eq("item_skin", skinName)
      .order("wear_value", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching players:", error)
      return { success: false, players: [], count: 0 }
    }

    // Transform the data to match the expected format
    const players =
      data?.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        steamName: item.users?.steam_name || "Unknown Player",
        steamAvatar: item.users?.steam_avatar_url || "",
        steamId: item.users?.steam_id || "",
        wearValue: item.wear_value || 0,
        wearCondition: item.wear_condition || "Factory New",
        quality: item.quality || "Normal",
        price: item.price || 0,
        createdAt: item.created_at,
      })) || []

    return {
      success: true,
      players,
      count: players.length,
    }
  } catch (error) {
    console.error("[v0] Error in getPlayersOwningItem:", error)
    return { success: false, players: [], count: 0 }
  }
}
