import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { caseId, paymentMethod } = body

    if (!caseId || !paymentMethod) {
      return NextResponse.json(
        {
          error: "Case ID and payment method are required",
        },
        { status: 400 },
      )
    }

    // Get case details
    const { data: caseData, error: caseError } = await supabase.from("cs2_cases").select("*").eq("id", caseId).single()

    if (caseError || !caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    // Get player balance
    const { data: balance } = await supabase.from("player_balances").select("*").eq("steam_id", user.id).single()

    if (!balance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Check if player has enough balance
    if (paymentMethod === "real_money") {
      if (balance.real_money_balance < caseData.price_real_money) {
        return NextResponse.json({ error: "Insufficient real money balance" }, { status: 400 })
      }

      // Deduct real money
      await supabase
        .from("player_balances")
        .update({
          real_money_balance: balance.real_money_balance - caseData.price_real_money,
          total_spent_real_money: balance.total_spent_real_money + caseData.price_real_money,
          updated_at: new Date().toISOString(),
        })
        .eq("steam_id", user.id)
    } else if (paymentMethod === "credits") {
      if (balance.credits_balance < caseData.price_credits) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
      }

      // Deduct credits
      await supabase
        .from("player_balances")
        .update({
          credits_balance: balance.credits_balance - caseData.price_credits,
          total_spent_credits: balance.total_spent_credits + caseData.price_credits,
          updated_at: new Date().toISOString(),
        })
        .eq("steam_id", user.id)
    }

    // Add case to inventory
    await supabase.from("inventory").insert({
      steam_id: user.id,
      item_type: "case",
      item_id: caseId,
      item_name: caseData.case_name,
      acquired_from: "purchase",
    })

    // Log transaction
    await supabase.from("transactions").insert({
      steam_id: user.id,
      transaction_type: "purchase_case",
      amount: paymentMethod === "real_money" ? caseData.price_real_money : null,
      credits_amount: paymentMethod === "credits" ? caseData.price_credits : null,
      description: `Purchased ${caseData.case_name}`,
    })

    // Log purchase
    await supabase.from("player_purchases").insert({
      steam_id: user.id,
      item_type: "case",
      item_id: caseId,
      item_name: caseData.case_name,
      payment_method: paymentMethod,
      amount_paid: paymentMethod === "real_money" ? caseData.price_real_money : null,
      credits_paid: paymentMethod === "credits" ? caseData.price_credits : null,
    })

    return NextResponse.json({
      success: true,
      message: "Case purchased successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error purchasing case:", error)
    return NextResponse.json(
      {
        error: "Failed to purchase case",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
