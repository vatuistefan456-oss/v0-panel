"use server"

import { createServerClient } from "@/lib/supabase-server"

export async function checkSetupStatus() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("admin_config").select("is_configured").single()

  if (error || !data) {
    return false
  }

  return data.is_configured
}

export async function setupRootAdmin(steamId: string, siteName: string) {
  const supabase = await createServerClient()

  try {
    // Check if already configured
    const { data: existingConfig } = await supabase.from("admin_config").select("is_configured").single()

    if (existingConfig?.is_configured) {
      return { success: false, error: "Setup already completed" }
    }

    // Create admin config
    const { error: configError } = await supabase.from("admin_config").insert({
      root_admin_steam_id: steamId,
      site_name: siteName,
      is_configured: true,
    })

    if (configError) throw configError

    // Create root admin
    const { error: adminError } = await supabase.from("admins").insert({
      steam_id: steamId,
      is_root: true,
      immunity_level: 99,
    })

    if (adminError) throw adminError

    return { success: true }
  } catch (error) {
    console.error("Setup error:", error)
    return { success: false, error: "Failed to complete setup" }
  }
}
