import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check if admin is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Add admin role check here
    // For now, any authenticated user can add balance (you should restrict this)

    const body = await request.json()
    const { steamId, realMoney, credits, reason } = body

    if (!steamId) {
      return NextResponse.json({ error: "Steam ID is required" }, { status: 400 })
    }

    // Get or create player balance
    const { data: existingBalance } = await supabase
      .from("player_balances")
      .select("*")
      .eq("steam_id", steamId)
      .single()

    if (existingBalance) {
      // Update existing balance
      const updates: any = { updated_at: new Date().toISOString() }

      if (realMoney !== undefined && realMoney !== null) {
        updates.real_money_balance = existingBalance.real_money_balance + realMoney
      }

      if (credits !== undefined && credits !== null) {
        updates.credits_balance = existingBalance.credits_balance + credits
      }

      const { error: updateError } = await supabase.from("player_balances").update(updates).eq("steam_id", steamId)

      if (updateError) throw updateError
    } else {
      // Create new balance
      const { error: insertError } = await supabase.from("player_balances").insert({
        steam_id: steamId,
        real_money_balance: realMoney || 0,
        credits_balance: credits || 0,
      })

      if (insertError) throw insertError
    }

    // Log transaction
    if (realMoney || credits) {
      await supabase.from("transactions").insert({
        steam_id: steamId,
        transaction_type: "admin_add_balance",
        amount: realMoney || null,
        credits_amount: credits || null,
        description: reason || "Admin added balance",
        admin_steam_id: user.id,
      })
    }

    // Log admin action
    await supabase.from("admin_actions").insert({
      admin_steam_id: user.id,
      action_type: "add_balance",
      target_steam_id: steamId,
      details: { realMoney, credits, reason },
    })

    return NextResponse.json({
      success: true,
      message: "Balance added successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error adding balance:", error)
    return NextResponse.json(
      {
        error: "Failed to add balance",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
