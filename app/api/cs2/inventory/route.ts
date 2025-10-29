import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { validateApiKey } from "@/lib/api-key-validation"

export async function GET(request: NextRequest) {
  // Validate API key
  const apiKeyValidation = await validateApiKey(request)
  if (!apiKeyValidation.valid) {
    return NextResponse.json({ success: false, error: apiKeyValidation.error }, { status: apiKeyValidation.status })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const steamId = searchParams.get("steam_id")

    if (!steamId) {
      return NextResponse.json({ success: false, error: "Steam ID is required" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Get user
    const { data: user, error: userError } = await supabase.from("users").select("id").eq("steam_id", steamId).single()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Get inventory items
    const { data: items, error: itemsError } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (itemsError) {
      console.error("Error fetching inventory:", itemsError)
      return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      items: items || [],
    })
  } catch (error) {
    console.error("Error in inventory API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
