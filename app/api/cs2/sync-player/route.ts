import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { validateApiKey, checkRateLimit } from "@/lib/api-key-validation"

// Sync player data from CS2 server
export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 })
  }

  try {
    const {
      steam_id,
      steam_name,
      steam_avatar_url,
      credits,
      kills,
      deaths,
      headshots,
      wins,
      matches_played,
      time_played,
      mvp,
    } = await request.json()

    if (!steam_id) {
      return NextResponse.json({ error: "Steam ID is required" }, { status: 400 })
    }

    const rateLimit = checkRateLimit(`sync-player:${steam_id}`, 1, 60000)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait before syncing again." }, { status: 429 })
    }

    const supabase = getSupabaseServerClient()

    // Check if user exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("steam_id", steam_id).maybeSingle()

    const updateData: any = {
      steam_name,
      steam_avatar_url,
      updated_at: new Date().toISOString(),
    }

    // Only update stats if provided
    if (credits !== undefined) updateData.credits = credits
    if (kills !== undefined) updateData.kills = kills
    if (deaths !== undefined) updateData.deaths = deaths
    if (headshots !== undefined) updateData.headshots = headshots
    if (wins !== undefined) updateData.wins = wins
    if (matches_played !== undefined) updateData.matches_played = matches_played
    if (time_played !== undefined) updateData.time_played = time_played
    if (mvp !== undefined) updateData.mvp = mvp

    if (existingUser) {
      // Update existing user
      const { error } = await supabase.from("users").update(updateData).eq("steam_id", steam_id)

      if (error) throw error
    } else {
      // Create new user
      const { error } = await supabase.from("users").insert({
        steam_id,
        ...updateData,
        credits: credits || 0,
        real_money_balance: 0,
        created_at: new Date().toISOString(),
      })

      if (error) throw error
    }

    return NextResponse.json({
      success: true,
      message: "Player data synced successfully",
    })
  } catch (error) {
    console.error("[v0] Error syncing player:", error)
    return NextResponse.json({ error: "Failed to sync player data" }, { status: 500 })
  }
}
