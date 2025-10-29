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

    const body = await request.json()
    const { steamId, itemType, itemId, quantity = 1, reason } = body

    if (!steamId || !itemType || !itemId) {
      return NextResponse.json(
        {
          error: "Steam ID, item type, and item ID are required",
        },
        { status: 400 },
      )
    }

    // Validate item type
    const validTypes = ["case", "skin", "agent", "charm"]
    if (!validTypes.includes(itemType)) {
      return NextResponse.json(
        {
          error: "Invalid item type. Must be: case, skin, agent, or charm",
        },
        { status: 400 },
      )
    }

    // Get item details based on type
    let itemName = ""
    let tableName = ""

    switch (itemType) {
      case "case":
        tableName = "cs2_cases"
        const { data: caseData } = await supabase.from("cs2_cases").select("case_name").eq("id", itemId).single()
        itemName = caseData?.case_name || "Unknown Case"
        break
      case "skin":
        tableName = "cs2_skins"
        const { data: skinData } = await supabase.from("cs2_skins").select("skin_name").eq("id", itemId).single()
        itemName = skinData?.skin_name || "Unknown Skin"
        break
      case "agent":
        tableName = "cs2_agents"
        const { data: agentData } = await supabase.from("cs2_agents").select("agent_name").eq("id", itemId).single()
        itemName = agentData?.agent_name || "Unknown Agent"
        break
      case "charm":
        tableName = "cs2_charms"
        const { data: charmData } = await supabase.from("cs2_charms").select("charm_name").eq("id", itemId).single()
        itemName = charmData?.charm_name || "Unknown Charm"
        break
    }

    // Add items to player inventory
    for (let i = 0; i < quantity; i++) {
      // Add to inventory table (you'll need to create this)
      await supabase.from("inventory").insert({
        steam_id: steamId,
        item_type: itemType,
        item_id: itemId,
        item_name: itemName,
        acquired_from: "admin_gift",
        acquired_at: new Date().toISOString(),
      })
    }

    // Log admin action
    await supabase.from("admin_actions").insert({
      admin_steam_id: user.id,
      action_type: "add_items",
      target_steam_id: steamId,
      details: { itemType, itemId, itemName, quantity, reason },
    })

    return NextResponse.json({
      success: true,
      message: `Successfully added ${quantity}x ${itemName} to player inventory`,
    })
  } catch (error: any) {
    console.error("[v0] Error adding items:", error)
    return NextResponse.json(
      {
        error: "Failed to add items",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
