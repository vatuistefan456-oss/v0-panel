import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Add credits to player from CS2 plugin (for gameplay rewards)
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")

    if (apiKey !== process.env.CS2_PLUGIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerClient()
    const body = await request.json()
    const { steamId, credits, reason } = body

    if (!steamId || !credits) {
      return NextResponse.json({ error: "Steam ID and credits are required" }, { status: 400 })
    }

    // Get or create player balance
    const { data: existingBalance } = await supabase
      .from("player_balances")
      .select("*")
      .eq("steam_id", steamId)
      .single()

    if (existingBalance) {
      // Update existing balance
      await supabase
        .from("player_balances")
        .update({
          credits_balance: existingBalance.credits_balance + credits,
          updated_at: new Date().toISOString(),
        })
        .eq("steam_id", steamId)
    } else {
      // Create new balance
      await supabase.from("player_balances").insert({
        steam_id: steamId,
        credits_balance: credits,
      })
    }

    // Log transaction
    await supabase.from("transactions").insert({
      steam_id: steamId,
      transaction_type: "gameplay_reward",
      credits_amount: credits,
      description: reason || "Gameplay reward",
    })

    return NextResponse.json({
      success: true,
      message: `Added ${credits} credits to player ${steamId}`,
    })
  } catch (error: any) {
    console.error("[v0] Error adding credits:", error)
    return NextResponse.json(
      {
        error: "Failed to add credits",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
