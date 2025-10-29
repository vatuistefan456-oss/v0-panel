import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { validateApiKey } from "@/lib/api-key-validation"

export async function GET(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const steam_id = searchParams.get("steam_id")

    if (!steam_id) {
      return NextResponse.json({ error: "Steam ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { data: user, error } = await supabase.from("users").select("*").eq("steam_id", steam_id).maybeSingle()

    if (error) throw error

    if (!user) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      player: user,
    })
  } catch (error) {
    console.error("[v0] Error fetching player:", error)
    return NextResponse.json({ error: "Failed to fetch player data" }, { status: 500 })
  }
}
