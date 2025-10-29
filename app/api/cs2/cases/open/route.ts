import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { validateApiKey } from "@/lib/api-key-validation"
import casesConfig from "@/CS2Plugin/cases-config.json"

export async function POST(request: NextRequest) {
  const apiKeyValidation = await validateApiKey(request)
  if (!apiKeyValidation.valid) {
    return NextResponse.json({ success: false, error: apiKeyValidation.error }, { status: apiKeyValidation.status })
  }

  try {
    const { steamId, caseId } = await request.json()

    if (!steamId || !caseId) {
      return NextResponse.json({ success: false, error: "Missing steamId or caseId" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    const { data: player, error: playerError } = await supabase
      .from("users")
      .select("*")
      .eq("steam_id", steamId)
      .single()

    if (playerError || !player) {
      return NextResponse.json({ success: false, error: "Player not found" }, { status: 404 })
    }

    const caseData = casesConfig.cases.find((c) => c.id === caseId)
    if (!caseData) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 })
    }

    if (player.credits < caseData.price) {
      return NextResponse.json({ success: false, error: "Not enough credits" }, { status: 400 })
    }

    const rarity = determineRarity()
    const isStatTrak = Math.random() * 100 < casesConfig.dropRates.statTrakChance

    const items = caseData.contents[rarity]
    const selectedItem = items[Math.floor(Math.random() * items.length)]

    const { floatValue, wear } = generateFloatAndWear(selectedItem)

    const itemValue = calculateItemValue(rarity, floatValue, isStatTrak)

    const newCredits = player.credits - caseData.price

    await supabase.from("users").update({ credits: newCredits }).eq("steam_id", steamId)

    const { error: inventoryError } = await supabase.from("inventory").insert({
      user_id: player.id,
      item_name: selectedItem.name,
      item_type: rarity === "rare" ? "knife" : "weapon",
      rarity: rarity,
      float_value: floatValue,
      wear: wear,
      is_stattrak: isStatTrak,
      value: itemValue,
      case_id: caseId,
    })

    if (inventoryError) {
      console.error("[v0] Error adding item to inventory:", inventoryError)
    }

    const skinName = isStatTrak ? `StatTrak™ ${selectedItem.name}` : selectedItem.name
    const chatMessage = casesConfig.chatMessages.caseOpened
      .replace("{player}", player.username || player.steam_name)
      .replace("{skin}", skinName)
      .replace("{wear}", `${floatValue.toFixed(2)}`)
      .replace("{credits}", caseData.price.toString())

    return NextResponse.json({
      success: true,
      item: {
        name: selectedItem.name,
        rarity: rarity,
        floatValue: floatValue,
        wear: wear,
        isStatTrak: isStatTrak,
        value: itemValue,
      },
      chatMessage: chatMessage,
      isRare: rarity === "rare" || rarity === "covert",
      newCredits: newCredits,
    })
  } catch (error) {
    console.error("[v0] Error opening case:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

function determineRarity(): string {
  const roll = Math.random() * 100

  if (roll < casesConfig.dropRates.rare) {
    return "rare"
  } else if (roll < casesConfig.dropRates.rare + casesConfig.dropRates.covert) {
    return "covert"
  } else if (roll < casesConfig.dropRates.rare + casesConfig.dropRates.covert + casesConfig.dropRates.classified) {
    return "classified"
  } else if (
    roll <
    casesConfig.dropRates.rare +
      casesConfig.dropRates.covert +
      casesConfig.dropRates.classified +
      casesConfig.dropRates.restricted
  ) {
    return "restricted"
  } else {
    return "milSpec"
  }
}

function generateFloatAndWear(item: any): { floatValue: number; wear: string } {
  const minFloat = item.minFloat || 0.0
  const maxFloat = item.maxFloat || 1.0
  const floatValue = minFloat + Math.random() * (maxFloat - minFloat)

  let wear = "Factory New"
  if (floatValue >= casesConfig.wearRanges.battleScarred.min) {
    wear = "Battle-Scarred"
  } else if (floatValue >= casesConfig.wearRanges.wellWorn.min) {
    wear = "Well-Worn"
  } else if (floatValue >= casesConfig.wearRanges.fieldTested.min) {
    wear = "Field-Tested"
  } else if (floatValue >= casesConfig.wearRanges.minimalWear.min) {
    wear = "Minimal Wear"
  }

  return { floatValue, wear }
}

function calculateItemValue(rarity: string, floatValue: number, isStatTrak: boolean): number {
  let baseValue = 100

  switch (rarity) {
    case "rare":
      baseValue = 50000
      break
    case "covert":
      baseValue = 5000
      break
    case "classified":
      baseValue = 1000
      break
    case "restricted":
      baseValue = 300
      break
    case "milSpec":
      baseValue = 100
      break
  }

  const floatMultiplier = 1 + (1 - floatValue) * 0.5

  const statTrakMultiplier = isStatTrak ? 1.3 : 1.0

  return Math.floor(baseValue * floatMultiplier * statTrakMultiplier)
}
