/**
 * CS2 Market Price Synchronization Script
 *
 * This script fetches real market prices from the Steam Community Market
 * and updates the database with current pricing in server credits.
 *
 * Usage: Run this script daily/weekly to keep prices current
 */

import { createClient } from "@supabase/supabase-js"

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const PRICE_CONVERSION_RATE = 1000 // 1 USD = 1000 credits
const STEAM_API_DELAY = 3000 // 3 seconds between requests (20 per minute)
const BATCH_SIZE = 100 // Process items in batches

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

interface SteamPriceResponse {
  success: boolean
  lowest_price?: string
  median_price?: string
  volume?: string
}

interface CS2Item {
  id: string
  name: string
  weapon?: { name: string }
  pattern?: { name: string }
  rarity?: { id: string; name: string }
  market_hash_name?: string
}

/**
 * Fetch price from Steam Community Market
 */
async function fetchSteamPrice(marketHashName: string): Promise<number | null> {
  try {
    const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encodeURIComponent(marketHashName)}`

    const response = await fetch(url)
    if (!response.ok) {
      console.error(`[Steam API] Failed to fetch price for ${marketHashName}: ${response.status}`)
      return null
    }

    const data: SteamPriceResponse = await response.json()

    if (!data.success || !data.lowest_price) {
      console.log(`[Steam API] No price data for ${marketHashName}`)
      return null
    }

    // Parse price string (e.g., "$1.50" -> 1.50)
    const priceUSD = Number.parseFloat(data.lowest_price.replace(/[^0-9.]/g, ""))

    if (isNaN(priceUSD)) {
      console.error(`[Steam API] Invalid price format for ${marketHashName}: ${data.lowest_price}`)
      return null
    }

    return priceUSD
  } catch (error) {
    console.error(`[Steam API] Error fetching price for ${marketHashName}:`, error)
    return null
  }
}

/**
 * Convert USD price to credits with min/max range
 */
function convertToCredits(priceUSD: number) {
  const baseCredits = Math.floor(priceUSD * PRICE_CONVERSION_RATE)

  return {
    normalMin: Math.floor(baseCredits * 0.7),
    normalMax: Math.floor(baseCredits * 1.8),
    stattrakMin: Math.floor(baseCredits * 0.7 * 1.5),
    stattrakMax: Math.floor(baseCredits * 1.8 * 1.5),
    souvenirMin: Math.floor(baseCredits * 0.7 * 1.75),
    souvenirMax: Math.floor(baseCredits * 1.8 * 1.75),
  }
}

/**
 * Generate fallback prices based on rarity
 */
function generateFallbackPrices(rarity: string, itemType: "weapon" | "agent" | "charm") {
  const rarityMultipliers: Record<string, number> = {
    rarity_common_weapon: 1,
    rarity_uncommon_weapon: 2,
    rarity_rare_weapon: 5,
    rarity_mythical_weapon: 15,
    rarity_legendary_weapon: 50,
    rarity_ancient_weapon: 150,
    rarity_contraband: 500,
    rarity_common: 1,
    rarity_uncommon: 2,
    rarity_rare: 5,
    rarity_mythical: 15,
    rarity_legendary: 50,
    rarity_ancient: 150,
  }

  const basePrice = itemType === "weapon" ? 100 : itemType === "agent" ? 5000 : 50
  const multiplier = rarityMultipliers[rarity] || 1

  const normalMin = Math.floor(basePrice * multiplier * 0.7)
  const normalMax = Math.floor(basePrice * multiplier * 1.8)

  return {
    normalMin,
    normalMax,
    stattrakMin: Math.floor(normalMin * 1.5),
    stattrakMax: Math.floor(normalMax * 1.5),
    souvenirMin: Math.floor(normalMin * 1.75),
    souvenirMax: Math.floor(normalMax * 1.75),
  }
}

/**
 * Fetch all CS2 items from the API
 */
async function fetchAllCS2Items() {
  console.log("[Sync] Fetching CS2 items from API...")

  const [skinsRes, agentsRes] = await Promise.all([
    fetch("https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json"),
    fetch("https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/agents.json"),
  ])

  const skins = skinsRes.ok ? await skinsRes.json() : []
  const agents = agentsRes.ok ? await agentsRes.json() : []

  console.log(`[Sync] Loaded ${skins.length} skins and ${agents.length} agents`)

  return { skins, agents }
}

/**
 * Update item price in database
 */
async function updateItemPrice(
  itemType: "weapon" | "agent" | "charm",
  weaponName: string,
  skinName: string,
  prices: any,
) {
  const { error } = await supabase.from("item_prices").upsert(
    {
      item_type: itemType,
      weapon_name: weaponName,
      skin_name: skinName || "",
      normal_min: prices.normalMin,
      normal_max: prices.normalMax,
      stattrak_min: prices.stattrakMin,
      stattrak_max: prices.stattrakMax,
      souvenir_min: prices.souvenirMin,
      souvenir_max: prices.souvenirMax,
      last_updated: new Date().toISOString(),
    },
    {
      onConflict: "weapon_name,skin_name",
    },
  )

  if (error) {
    console.error(`[DB] Error updating price for ${weaponName} ${skinName}:`, error)
    return false
  }

  return true
}

/**
 * Process a single item
 */
async function processItem(item: any, itemType: "weapon" | "agent") {
  const weaponName = itemType === "weapon" ? item.weapon?.name : item.name
  const skinName = itemType === "weapon" ? item.pattern?.name : ""
  const marketHashName = item.market_hash_name || `${weaponName} | ${skinName}`.trim()

  console.log(`[Processing] ${marketHashName}`)

  // Try to fetch real market price
  const priceUSD = await fetchSteamPrice(marketHashName)

  let prices
  if (priceUSD && priceUSD > 0) {
    // Use real market price
    prices = convertToCredits(priceUSD)
    console.log(
      `[Price] ${marketHashName}: $${priceUSD.toFixed(2)} USD = ${prices.normalMin}-${prices.normalMax} credits`,
    )
  } else {
    // Use fallback rarity-based pricing
    prices = generateFallbackPrices(item.rarity?.id || "rarity_common", itemType)
    console.log(`[Price] ${marketHashName}: Using fallback pricing (${prices.normalMin}-${prices.normalMax} credits)`)
  }

  // Update database
  const success = await updateItemPrice(itemType, weaponName, skinName, prices)

  if (success) {
    console.log(`[Success] Updated ${marketHashName}`)
  }

  // Rate limiting delay
  await new Promise((resolve) => setTimeout(resolve, STEAM_API_DELAY))
}

/**
 * Main sync function
 */
async function syncMarketPrices() {
  console.log("=".repeat(60))
  console.log("CS2 Market Price Synchronization")
  console.log("=".repeat(60))
  console.log(`Conversion Rate: 1 USD = ${PRICE_CONVERSION_RATE} credits`)
  console.log(`Rate Limit: ${STEAM_API_DELAY}ms delay between requests`)
  console.log("=".repeat(60))

  try {
    // Fetch all items
    const { skins, agents } = await fetchAllCS2Items()
    const totalItems = skins.length + agents.length

    console.log(`\n[Sync] Starting sync for ${totalItems} items...\n`)

    let processed = 0
    let updated = 0
    let failed = 0

    // Process weapons in batches
    console.log("[Sync] Processing weapon skins...")
    for (let i = 0; i < skins.length; i += BATCH_SIZE) {
      const batch = skins.slice(i, i + BATCH_SIZE)

      for (const skin of batch) {
        try {
          await processItem(skin, "weapon")
          updated++
        } catch (error) {
          console.error(`[Error] Failed to process ${skin.weapon?.name} ${skin.pattern?.name}:`, error)
          failed++
        }

        processed++

        if (processed % 10 === 0) {
          console.log(
            `[Progress] ${processed}/${totalItems} items processed (${Math.round((processed / totalItems) * 100)}%)`,
          )
        }
      }
    }

    // Process agents
    console.log("\n[Sync] Processing agents...")
    for (const agent of agents) {
      try {
        await processItem(agent, "agent")
        updated++
      } catch (error) {
        console.error(`[Error] Failed to process ${agent.name}:`, error)
        failed++
      }

      processed++

      if (processed % 10 === 0) {
        console.log(
          `[Progress] ${processed}/${totalItems} items processed (${Math.round((processed / totalItems) * 100)}%)`,
        )
      }
    }

    console.log("\n" + "=".repeat(60))
    console.log("Sync Complete!")
    console.log("=".repeat(60))
    console.log(`Total Items: ${totalItems}`)
    console.log(`Successfully Updated: ${updated}`)
    console.log(`Failed: ${failed}`)
    console.log(`Success Rate: ${Math.round((updated / totalItems) * 100)}%`)
    console.log("=".repeat(60))
  } catch (error) {
    console.error("[Fatal Error] Sync failed:", error)
    process.exit(1)
  }
}

// Run the sync
syncMarketPrices()
