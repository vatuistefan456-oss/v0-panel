// Demo user data for unauthenticated access
export const DEMO_USER = {
  id: "demo-user-id",
  username: "DemoPlayer",
  steam_name: "Demo Player",
  steam_id: "STEAM_0:0:00000000",
  steam_avatar_url: null,
  unique_key: "DEMO-KEY-12345",
  rank: "Gold Nova III",
  vip_tier: "DEFAULT",
  credits: 1500,
  real_money_balance: 25.5,
  time_played: 12450,
  kills: 3420,
  deaths: 2890,
  headshots: 1245,
  discord_verified: false,
  discord_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const DEMO_SHOP_ITEMS = [
  {
    id: "1",
    name: "100 Credits",
    description: "Get 100 credits instantly",
    category: "credits",
    price: 100,
    real_money_price: null,
    image_url: "/credits.jpg",
    stock: 999,
    is_active: true,
  },
  {
    id: "2",
    name: "Weapon Case",
    description: "Contains random weapon skins",
    category: "cases",
    price: 250,
    real_money_price: 2.5,
    image_url: "/weapon-case.jpg",
    stock: 50,
    is_active: true,
  },
  {
    id: "3",
    name: "VIP LEGEND (30 days)",
    description: "20% discount on all purchases",
    category: "vip",
    price: 1000,
    real_money_price: 9.99,
    image_url: "/vip-badge.png",
    stock: 999,
    is_active: true,
  },
]

export const DEMO_INVENTORY_ITEMS = [
  {
    id: "1",
    user_id: "demo-user-id",
    item_type: "skin",
    item_name: "M4A4",
    item_skin: "In Living Color",
    weapon_type: "rifle",
    wear_value: 0.2,
    wear_condition: "Field-Tested",
    quality: "Normal",
    price: 540,
    quantity: 1,
    equipped_t: false,
    equipped_ct: true,
    is_locked: false,
    nametag: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo-user-id",
    item_type: "skin",
    item_name: "Dual Berettas",
    item_skin: "Hemoglobin",
    weapon_type: "pistol",
    wear_value: 0.46,
    wear_condition: "Battle-Scarred",
    quality: "Normal",
    price: 509,
    quantity: 1,
    equipped_t: false,
    equipped_ct: false,
    is_locked: false,
    nametag: null,
    created_at: new Date().toISOString(),
  },
]

export function getDemoLeaderboard() {
  const players = []

  // Generate 295 demo players with realistic stats
  const names = [
    "nf-",
    "q6-",
    "CHRuuu",
    "blaze",
    "Wosen",
    "©Ka$Shi©",
    "⚡ V-A-L-I ⚡🔥_",
    "»fR. $nelc",
    "Vladd romania.llg.ro",
    "®Alex®™ romania.llg.ro",
    "ProGamer",
    "ShadowHunter",
    "NightWolf",
    "DragonSlayer",
    "PhantomKiller",
    "SilentAssassin",
    "ThunderStrike",
    "IceBreaker",
    "FireStorm",
    "DarkKnight",
    "LightningBolt",
  ]

  for (let i = 0; i < 295; i++) {
    const kills = Math.floor(Math.random() * 5000) + 500
    const deaths = Math.floor(Math.random() * 4000) + 400
    const headshots = Math.floor(kills * (0.3 + Math.random() * 0.3))
    const mvp = Math.floor(Math.random() * 500) + 50
    const time_played = Math.floor(Math.random() * 50000) + 5000
    const matches_played = Math.floor(Math.random() * 1000) + 100
    const wins = Math.floor(matches_played * (0.4 + Math.random() * 0.2))

    players.push({
      id: `player-${i + 1}`,
      username: names[i % names.length] + (i > names.length ? i : ""),
      steam_name: names[i % names.length] + (i > names.length ? ` #${i}` : ""),
      steam_avatar_url: `/placeholder.svg?height=40&width=40&query=player+${i + 1}`,
      kills,
      deaths,
      headshots,
      mvp,
      time_played,
      matches_played,
      wins,
      rank: ["Silver I", "Silver II", "Gold Nova I", "Gold Nova III", "Master Guardian", "Legendary Eagle"][
        Math.floor(Math.random() * 6)
      ],
    })
  }

  // Sort by kills descending
  return players.sort((a, b) => b.kills - a.kills)
}
