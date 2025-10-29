import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Get player balance for CS2 plugin
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

    // Get player balance
    const { data: balance } = await supabase.from("player_balances").select("*").eq("steam_id", steamId).single()

    if (!balance) {
      return NextResponse.json({
        steamId,
        realMoneyBalance: 0,
        creditsBalance: 0,
        totalSpentRealMoney: 0,
        totalSpentCredits: 0,
      })
    }

    return NextResponse.json({
      steamId,
      realMoneyBalance: Number.parseFloat(balance.real_money_balance) || 0,
      creditsBalance: balance.credits_balance || 0,
      totalSpentRealMoney: Number.parseFloat(balance.total_spent_real_money) || 0,
      totalSpentCredits: balance.total_spent_credits || 0,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching player balance:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch balance",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
