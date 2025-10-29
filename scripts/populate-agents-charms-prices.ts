// Script to populate pricing for CS2 Agents and Charms
// Run this after creating the item_prices table

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface Agent {
  id: string
  name: string
  rarity: {
    id: string
    name: string
  }
}

interface Charm {
  id: string
  name: string
  rarity: {
    id: string
    name: string
  }
}

// Pricing based on rarity for Agents
const AGENT_RARITY_PRICES: Record<string, number> = {
  rarity_common_character: 500, // Distinguished
  rarity_uncommon_character: 1500, // Exceptional
  rarity_rare_character: 5000, // Superior
  rarity_mythical_character: 12000, // Exceptional
  rarity_legendary_character: 22000, // Superior
  rarity_ancient_character: 45000, // Master
}

// Pricing based on rarity for Charms
const CHARM_RARITY_PRICES: Record<string, number> = {
  rarity_common: 15, // Base Grade
  rarity_uncommon: 25, // Consumer Grade
  rarity_rare: 50, // Industrial Grade
  rarity_mythical: 100, // Mil-Spec Grade
  rarity_legendary: 250, // Restricted
  rarity_ancient: 500, // Classified
}

async function populateAgentsPrices() {
  console.log("[v0] Fetching CS2 Agents...")

  const response = await fetch("https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/agents.json")
  const agents: Agent[] = await response.json()

  console.log(`[v0] Found ${agents.length} agents`)

  const prices = agents.map((agent) => {
    const basePrice = AGENT_RARITY_PRICES[agent.rarity.id] || 1000

    return {
      weapon_name: agent.name,
      skin_name: "",
      rarity: agent.rarity.name,
      item_type: "agent",
      normal_min: basePrice,
      normal_max: basePrice, // Agents have fixed price
      stattrak_min: 0, // Agents don't have StatTrak
      stattrak_max: 0,
      souvenir_min: 0, // Agents don't have Souvenir
      souvenir_max: 0,
    }
  })

  console.log("[v0] Inserting agent prices into database...")

  const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/item_prices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(prices),
  })

  if (!supabaseResponse.ok) {
    const error = await supabaseResponse.text()
    console.error("[v0] Error inserting agent prices:", error)
  } else {
    console.log(`[v0] Successfully inserted ${prices.length} agent prices`)
  }
}

async function populateCharmsPrices() {
  console.log("[v0] Fetching CS2 Charms...")

  const response = await fetch("https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/charms.json")
  const charms: Charm[] = await response.json()

  console.log(`[v0] Found ${charms.length} charms`)

  const prices = charms.map((charm) => {
    const basePrice = CHARM_RARITY_PRICES[charm.rarity.id] || 20

    return {
      weapon_name: charm.name,
      skin_name: "",
      rarity: charm.rarity.name,
      item_type: "charm",
      normal_min: basePrice,
      normal_max: basePrice, // Charms have fixed price
      stattrak_min: 0, // Charms don't have StatTrak
      stattrak_max: 0,
      souvenir_min: 0, // Charms don't have Souvenir
      souvenir_max: 0,
    }
  })

  console.log("[v0] Inserting charm prices into database...")

  const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/item_prices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(prices),
  })

  if (!supabaseResponse.ok) {
    const error = await supabaseResponse.text()
    console.error("[v0] Error inserting charm prices:", error)
  } else {
    console.log(`[v0] Successfully inserted ${prices.length} charm prices`)
  }
}

async function main() {
  console.log("[v0] Starting population of Agents and Charms prices...")

  await populateAgentsPrices()
  await populateCharmsPrices()

  console.log("[v0] Completed!")
}

main()
