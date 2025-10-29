import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get player balance (using user.id as steam_id for now)
    const { data: balance } = await supabase
      .from("player_balances")
      .select("real_money_balance, credits_balance")
      .eq("steam_id", user.id)
      .single()

    if (!balance) {
      return NextResponse.json({
        realMoney: 0,
        credits: 0,
      })
    }

    return NextResponse.json({
      realMoney: Number.parseFloat(balance.real_money_balance) || 0,
      credits: balance.credits_balance || 0,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching balance:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch balance",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
