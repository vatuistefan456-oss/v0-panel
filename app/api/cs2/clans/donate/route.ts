import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { steamId, amount } = await request.json()

    if (!steamId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
    }

    // Get user
    const { data: user } = await supabase.from("users").select("id, credits").eq("steam_id", steamId).single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.credits < amount) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    // Get clan membership
    const { data: membership } = await supabase
      .from("clan_members")
      .select("clan_id, contribution_credits")
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: "Not in a clan" }, { status: 400 })
    }

    // Deduct credits from user
    await supabase
      .from("users")
      .update({ credits: user.credits - amount })
      .eq("id", user.id)

    // Add credits to clan
    await supabase.rpc("increment_clan_credits", {
      p_clan_id: membership.clan_id,
      p_amount: amount,
    })

    // Update member contribution
    await supabase
      .from("clan_members")
      .update({
        contribution_credits: (membership.contribution_credits || 0) + amount,
      })
      .eq("user_id", user.id)
      .eq("clan_id", membership.clan_id)

    // Log transaction
    await supabase.from("transactions").insert({
      user_id: user.id,
      transaction_type: "clan_donation",
      amount_credits: amount,
      description: `Donated ${amount} credits to clan`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error donating to clan:", error)
    return NextResponse.json({ error: "Failed to donate to clan" }, { status: 500 })
  }
}
