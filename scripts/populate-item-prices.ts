// Script to populate item prices from CS2 skins API
import { generatePricesByRarity, upsertItemPrice } from "../app/actions/item-prices"

interface CS2Skin {
  id: string
  name: string
  weapon: { name: string }
  pattern: { name: string }
  rarity: { name: string }
  paint_index: string
}

async function populateItemPrices() {
  try {
    console.log("[v0] Fetching CS2 skins data...")
    const response = await fetch("https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json")
    const skins: CS2Skin[] = await response.json()

    console.log(`[v0] Found ${skins.length} skins. Populating prices...`)

    let successCount = 0
    let errorCount = 0

    for (const skin of skins) {
      const weaponName = skin.weapon?.name || ""
      const skinName = skin.pattern?.name || ""
      const rarity = skin.rarity?.name || "Consumer Grade"
      const paintIndex = skin.paint_index || ""

      if (!weaponName || !skinName) {
        console.log(`[v0] Skipping skin with missing data: ${skin.id}`)
        continue
      }

      const prices = generatePricesByRarity(rarity)

      const result = await upsertItemPrice(
        weaponName,
        skinName,
        rarity,
        prices.normalMin,
        prices.normalMax,
        prices.stattrakMin,
        prices.stattrakMax,
        prices.souvenirMin,
        prices.souvenirMax,
        paintIndex,
      )

      if (result.success) {
        successCount++
        if (successCount % 100 === 0) {
          console.log(`[v0] Processed ${successCount} items...`)
        }
      } else {
        errorCount++
        console.error(`[v0] Failed to upsert ${weaponName} | ${skinName}:`, result.error)
      }
    }

    console.log(`[v0] Completed! Success: ${successCount}, Errors: ${errorCount}`)
  } catch (error) {
    console.error("[v0] Error populating item prices:", error)
  }
}

populateItemPrices()
