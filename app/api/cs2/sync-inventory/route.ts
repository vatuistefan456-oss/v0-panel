import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Sync player inventory from website to CS2 server
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")

    if (apiKey !== process.env.CS2_PLUGIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerClient()
    const body = await request.json()
    const { steamId } = body

    if (!steamId) {
      return NextResponse.json({ error: "Steam ID is required" }, { status: 400 })
    }

    // Get player inventory
    const { data: inventory, error } = await supabase
      .from("inventory")
      .select(`
        *,
        cs2_cases:item_id (case_name, case_key),
        cs2_skins:item_id (skin_name, skin_key, weapon_type, rarity),
        cs2_agents:item_id (agent_name, agent_key, faction),
        cs2_charms:item_id (charm_name, charm_key)
      `)
      .eq("steam_id", steamId)
      .order("acquired_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      inventory: inventory || [],
    })
  } catch (error: any) {
    console.error("[v0] Error syncing inventory:", error)
    return NextResponse.json(
      {
        error: "Failed to sync inventory",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
