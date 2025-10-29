/**
 * Quick Price Update Script
 *
 * Updates prices for the most popular/expensive items only.
 * Use this for frequent updates without hitting rate limits.
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const PRICE_CONVERSION_RATE = 1000
const STEAM_API_DELAY = 3000

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// List of high-value items to update frequently
const PRIORITY_ITEMS = [
  // Knives
  { weapon: "Karambit", skin: "Fade" },
  { weapon: "Karambit", skin: "Doppler" },
  { weapon: "M9 Bayonet", skin: "Fade" },
  { weapon: "Butterfly Knife", skin: "Fade" },

  // Popular Rifles
  { weapon: "AK-47", skin: "Redline" },
  { weapon: "AK-47", skin: "Asiimov" },
  { weapon: "AK-47", skin: "Vulcan" },
  { weapon: "M4A4", skin: "Howl" },
  { weapon: "M4A1-S", skin: "Hyper Beast" },
  { weapon: "AWP", skin: "Dragon Lore" },
  { weapon: "AWP", skin: "Asiimov" },
  { weapon: "AWP", skin: "Hyper Beast" },

  // Popular Agents
  { weapon: "Bio-Haz Specialist", skin: "" },
  { weapon: "1st Lieutenant Farlow", skin: "" },
  { weapon: "Sir Bloody Miami Darryl", skin: "" },
]

async function fetchSteamPrice(marketHashName: string): Promise<number | null> {
  try {
    const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encodeURIComponent(marketHashName)}`
    const response = await fetch(url)

    if (!response.ok) return null

    const data = await response.json()
    if (!data.success || !data.lowest_price) return null

    const priceUSD = Number.parseFloat(data.lowest_price.replace(/[^0-9.]/g, ""))
    return isNaN(priceUSD) ? null : priceUSD
  } catch (error) {
    return null
  }
}

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

async function quickUpdate() {
  console.log("Quick Price Update - Priority Items Only")
  console.log("=".repeat(60))

  let updated = 0
  let failed = 0

  for (const item of PRIORITY_ITEMS) {
    const marketHashName = item.skin ? `${item.weapon} | ${item.skin}` : item.weapon
    console.log(`[Processing] ${marketHashName}`)

    const priceUSD = await fetchSteamPrice(marketHashName)

    if (priceUSD && priceUSD > 0) {
      const prices = convertToCredits(priceUSD)

      const { error } = await supabase.from("item_prices").upsert(
        {
          item_type: item.skin ? "weapon" : "agent",
          weapon_name: item.weapon,
          skin_name: item.skin || "",
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
        console.error(`[Failed] ${marketHashName}`)
        failed++
      } else {
        console.log(
          `[Success] ${marketHashName}: $${priceUSD.toFixed(2)} = ${prices.normalMin}-${prices.normalMax} credits`,
        )
        updated++
      }
    } else {
      console.log(`[Skipped] ${marketHashName}: No price data`)
      failed++
    }

    await new Promise((resolve) => setTimeout(resolve, STEAM_API_DELAY))
  }

  console.log("=".repeat(60))
  console.log(`Updated: ${updated}, Failed: ${failed}`)
}

quickUpdate()
