"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function banUser(username: string, reason: string, durationMinutes: number | null) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return { success: false, message: "Not authenticated" }
    }

    const supabase = await getSupabaseServerClient()

    // Find target user
    const { data: targetUser } = await supabase.from("users").select("*").eq("username", username).single()

    if (!targetUser) {
      return { success: false, message: "User not found" }
    }

    // Calculate expiration
    const expiresAt = durationMinutes ? new Date(Date.now() + durationMinutes * 60 * 1000).toISOString() : null

    // Create ban
    await supabase.from("bans").insert({
      user_id: targetUser.id,
      admin_id: sessionCookie.value,
      reason,
      duration: durationMinutes,
      expires_at: expiresAt,
      is_active: true,
    })

    // Log admin action
    await supabase.from("admin_actions").insert({
      admin_id: sessionCookie.value,
      target_user_id: targetUser.id,
      action_type: "ban",
      reason,
      duration: durationMinutes,
      expires_at: expiresAt,
    })

    revalidatePath("/admin/moderation")
    return { success: true, message: `Successfully banned ${username}` }
  } catch (error) {
    console.error("[v0] Ban user error:", error)
    return { success: false, message: "Failed to ban user" }
  }
}

export async function muteUser(username: string, reason: string, durationMinutes: number | null) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return { success: false, message: "Not authenticated" }
    }

    const supabase = await getSupabaseServerClient()

    // Find target user
    const { data: targetUser } = await supabase.from("users").select("*").eq("username", username).single()

    if (!targetUser) {
      return { success: false, message: "User not found" }
    }

    // Calculate expiration
    const expiresAt = durationMinutes ? new Date(Date.now() + durationMinutes * 60 * 1000).toISOString() : null

    // Create mute
    await supabase.from("mutes").insert({
      user_id: targetUser.id,
      admin_id: sessionCookie.value,
      reason,
      duration: durationMinutes,
      expires_at: expiresAt,
      is_active: true,
    })

    // Log admin action
    await supabase.from("admin_actions").insert({
      admin_id: sessionCookie.value,
      target_user_id: targetUser.id,
      action_type: "mute",
      reason,
      duration: durationMinutes,
      expires_at: expiresAt,
    })

    revalidatePath("/admin/moderation")
    return { success: true, message: `Successfully muted ${username}` }
  } catch (error) {
    console.error("[v0] Mute user error:", error)
    return { success: false, message: "Failed to mute user" }
  }
}

export async function revokeBan(banId: string) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return { success: false, message: "Not authenticated" }
    }

    const supabase = await getSupabaseServerClient()

    await supabase.from("bans").update({ is_active: false }).eq("id", banId)

    revalidatePath("/admin/moderation")
    return { success: true, message: "Ban revoked successfully" }
  } catch (error) {
    console.error("[v0] Revoke ban error:", error)
    return { success: false, message: "Failed to revoke ban" }
  }
}

export async function revokeMute(muteId: string) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return { success: false, message: "Not authenticated" }
    }

    const supabase = await getSupabaseServerClient()

    await supabase.from("mutes").update({ is_active: false }).eq("id", muteId)

    revalidatePath("/admin/moderation")
    return { success: true, message: "Mute revoked successfully" }
  } catch (error) {
    console.error("[v0] Revoke mute error:", error)
    return { success: false, message: "Failed to revoke mute" }
  }
}
