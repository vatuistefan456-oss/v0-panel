"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateBannerSettings(settings: {
  text: string
  textColor: string
  borderColor: string
  bgColor: string
  enabled: boolean
}) {
  try {
    const supabase = await getSupabaseServerClient()

    // Update each setting
    const updates = [
      { key: "vip_banner_text", value: settings.text },
      { key: "vip_banner_text_color", value: settings.textColor },
      { key: "vip_banner_border_color", value: settings.borderColor },
      { key: "vip_banner_bg_color", value: settings.bgColor },
      { key: "vip_banner_enabled", value: settings.enabled.toString() },
    ]

    for (const update of updates) {
      await supabase.from("site_settings").upsert(
        {
          setting_key: update.key,
          setting_value: update.value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" },
      )
    }

    revalidatePath("/admin/shop")
    revalidatePath("/admin/settings")
    return { success: true, message: "Banner settings updated successfully" }
  } catch (error) {
    console.error("[v0] Error updating banner settings:", error)
    return { success: false, message: "Failed to update banner settings" }
  }
}

export async function updateNavigationOrder(
  items: Array<{ key: string; label: string; order: number; visible: boolean }>,
) {
  try {
    const supabase = await getSupabaseServerClient()

    for (const item of items) {
      await supabase.from("navigation_order").upsert(
        {
          item_key: item.key,
          display_order: item.order,
          is_visible: item.visible,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "item_key" },
      )
    }

    revalidatePath("/admin")
    return { success: true, message: "Navigation order updated successfully" }
  } catch (error) {
    console.error("[v0] Error updating navigation order:", error)
    return { success: false, message: "Failed to update navigation order" }
  }
}

export async function updateShopItemOrder(items: Array<{ id: number; order: number; category: string }>) {
  try {
    const supabase = await getSupabaseServerClient()

    for (const item of items) {
      await supabase.from("shop_item_order").upsert(
        {
          item_id: item.id,
          display_order: item.order,
          category: item.category,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "item_id" },
      )
    }

    revalidatePath("/admin/shop")
    revalidatePath("/admin/shop-management")
    return { success: true, message: "Shop item order updated successfully" }
  } catch (error) {
    console.error("[v0] Error updating shop item order:", error)
    return { success: false, message: "Failed to update shop item order" }
  }
}
