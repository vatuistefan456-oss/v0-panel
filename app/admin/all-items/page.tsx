"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Grid3x3, Loader2, X, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPlayersOwningItem } from "@/app/actions/inventory"
import { getItemPrice } from "@/app/actions/item-prices"

interface CS2Agent {
  id: string
  name: string
  description: string
  rarity: {
    id: string
    name: string
    color: string
  }
  collections: Array<{
    id: string
    name: string
    image: string
  }>
  team: {
    id: string
    name: string
  }
  image: string
  market_hash_name: string
}

interface CS2Charm {
  id: string
  name: string
  description: string
  rarity: {
    id: string
    name: string
    color: string
  }
  collections: Array<{
    id: string
    name: string
    image: string
  }>
  image: string
  market_hash_name: string
}

interface CS2Skin {
  id: string
  name: string
  description: string
  weapon: {
    id: string
    weapon_id: number
    name: string
  }
  category: {
    id: string
    name: string
  }
  pattern: {
    id: string
    name: string
  }
  rarity: {
    id: string
    name: string
    color: string
  }
  paint_index: string
  image: string
  min_float: number | null
  max_float: number | null
  stattrak: boolean
  souvenir: boolean
  crates?: Array<{
    id: string
    name: string
    image: string
  }>
}

type CS2Item = CS2Skin | CS2Agent | CS2Charm

interface PlayerInventoryItem {
  id: string
  userId: string
  steamName: string
  steamAvatar: string
  steamId: string
  wearValue: number
  wearCondition: string
  quality: string
  price: number
  createdAt: string
}

export default function AllItemsPage() {
  const [skins, setSkins] = useState<CS2Skin[]>([])
  const [agents, setAgents] = useState<CS2Agent[]>([])
  const [charms, setCharms] = useState<CS2Charm[]>([])
  const [filteredItems, setFilteredItems] = useState<CS2Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("skins")
  const [selectedRarity, setSelectedRarity] = useState<string>("all")
  const [selectedWeapon, setSelectedWeapon] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<CS2Item | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPlayersInventory, setShowPlayersInventory] = useState(false)
  const [playersWithItem, setPlayersWithItem] = useState<PlayerInventoryItem[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(false)
  const [itemPrices, setItemPrices] = useState<Record<string, any>>({})
  const [loadingPrices, setLoadingPrices] = useState(false)

  useEffect(() => {
    fetchAllItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [searchQuery, selectedCategory, selectedRarity, selectedWeapon, skins, agents, charms])

  const fetchAllItems = async () => {
    try {
      setLoading(true)

      let skinsData: CS2Skin[] = []
      let agentsData: CS2Agent[] = []
      let charmsData: CS2Charm[] = []

      // Fetch skins
      try {
        console.log("[v0] Fetching skins...")
        const skinsRes = await fetch("https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json")
        if (skinsRes.ok) {
          skinsData = await skinsRes.json()
          console.log("[v0] Skins loaded:", skinsData.length)
        } else {
          console.error("[v0] Failed to fetch skins:", skinsRes.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching skins:", error)
      }

      // Fetch agents
      try {
        console.log("[v0] Fetching agents...")
        const agentsRes = await fetch(
          "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/agents.json",
        )
        if (agentsRes.ok) {
          agentsData = await agentsRes.json()
          console.log("[v0] Agents loaded:", agentsData.length)
        } else {
          console.error("[v0] Failed to fetch agents:", agentsRes.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching agents:", error)
      }

      // Fetch charms (may not exist in API)
      try {
        console.log("[v0] Fetching charms...")
        const charmsRes = await fetch(
          "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/charms.json",
        )
        if (charmsRes.ok) {
          charmsData = await charmsRes.json()
          console.log("[v0] Charms loaded:", charmsData.length)
        } else {
          console.log("[v0] Charms endpoint not available (this is expected)")
        }
      } catch (error) {
        console.log("[v0] Charms endpoint not available (this is expected)")
      }

      setSkins(skinsData)
      setAgents(agentsData)
      setCharms(charmsData)
      setFilteredItems(skinsData)
    } catch (error) {
      console.error("[v0] Error in fetchAllItems:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered: CS2Item[] = []

    if (selectedCategory === "skins") {
      filtered = [...skins]
      if (selectedWeapon !== "all") {
        filtered = filtered.filter((item) => "weapon" in item && item.weapon?.id === selectedWeapon)
      }
    } else if (selectedCategory === "agents") {
      filtered = [...agents]
    } else if (selectedCategory === "charms") {
      filtered = [...charms]
    }

    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const name = item.name?.toLowerCase() || ""
        if ("weapon" in item) {
          const weaponName = item.weapon?.name?.toLowerCase() || ""
          const patternName = item.pattern?.name?.toLowerCase() || ""
          return (
            name.includes(searchQuery.toLowerCase()) ||
            weaponName.includes(searchQuery.toLowerCase()) ||
            patternName.includes(searchQuery.toLowerCase())
          )
        }
        return name.includes(searchQuery.toLowerCase())
      })
    }

    if (selectedRarity !== "all") {
      filtered = filtered.filter((item) => item.rarity?.id === selectedRarity)
    }

    setFilteredItems(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("skins")
    setSelectedRarity("all")
    setSelectedWeapon("all")
  }

  const openItemDetail = async (item: CS2Item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
    setShowPlayersInventory(false)
    setLoadingPrices(true)

    // Fetch pricing from database
    let itemName = ""
    let skinName = ""

    if ("weapon" in item) {
      itemName = item.weapon?.name || ""
      skinName = item.pattern?.name || ""
    } else {
      itemName = item.name || ""
      skinName = ""
    }

    console.log("[v0] Fetching price for:", itemName, skinName)
    const result = await getItemPrice(itemName, skinName)
    console.log("[v0] Price result:", result)

    if (result.success) {
      const key = `${itemName}_${skinName}`
      if (result.price) {
        // Price found in database
        setItemPrices((prev) => ({
          ...prev,
          [key]: result.price,
        }))
      } else {
        // No price found - generate default prices based on rarity
        const defaultPrices = generateDefaultPrices(item)
        setItemPrices((prev) => ({
          ...prev,
          [key]: defaultPrices,
        }))
      }
    }

    setLoadingPrices(false)
  }

  const closeItemDetail = () => {
    setIsModalOpen(false)
    setShowPlayersInventory(false)
    setTimeout(() => setSelectedItem(null), 300)
  }

  const handleInspect = () => {
    if (selectedItem && "weapon" in selectedItem) {
      const steamLink = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198084749846A${selectedItem.paint_index}D7935523645256378573`
      window.location.href = steamLink
    }
  }

  const handleViewPlayersInventory = async () => {
    if (!selectedItem) return

    setLoadingPlayers(true)
    try {
      let itemName = ""
      let skinName = ""

      if ("weapon" in selectedItem) {
        itemName = selectedItem.weapon?.name || ""
        skinName = selectedItem.pattern?.name || ""
      } else {
        itemName = selectedItem.name || ""
        skinName = ""
      }

      const result = await getPlayersOwningItem(itemName, skinName)

      if (result.success) {
        setPlayersWithItem(result.players)
      } else {
        console.error("[v0] Failed to fetch players:", result)
        setPlayersWithItem([])
      }
    } catch (error) {
      console.error("[v0] Error fetching players inventory:", error)
      setPlayersWithItem([])
    } finally {
      setLoadingPlayers(false)
    }

    setShowPlayersInventory(true)
  }

  const rarities = Array.from(
    new Set([...skins, ...agents, ...charms].filter((item) => item?.rarity?.id).map((item) => item.rarity.id)),
  )
  const weapons = Array.from(new Set(skins.filter((s) => s?.weapon?.id).map((s) => s.weapon.id)))

  const getRarityName = (id: string) => {
    const item = [...skins, ...agents, ...charms].find((item) => item?.rarity?.id === id)
    return item?.rarity?.name || id
  }
  const getWeaponName = (id: string) => skins.find((s) => s?.weapon?.id === id)?.weapon?.name || id

  const getCurrentPrices = () => {
    if (!selectedItem) return null

    let itemName = ""
    let skinName = ""

    if ("weapon" in selectedItem) {
      itemName = selectedItem.weapon?.name || ""
      skinName = selectedItem.pattern?.name || ""
    } else {
      itemName = selectedItem.name || ""
      skinName = ""
    }

    const key = `${itemName}_${skinName}`
    return itemPrices[key] || null
  }

  const currentPrices = getCurrentPrices()
  const totalItems = skins.length + agents.length + charms.length

  const isWeaponSkin = (item: CS2Item): item is CS2Skin => {
    return "weapon" in item
  }

  const isAgent = (item: CS2Item): item is CS2Agent => {
    return "team" in item
  }

  const isCharm = (item: CS2Item): item is CS2Charm => {
    return !("weapon" in item) && !("team" in item)
  }

  const generateDefaultPrices = (item: CS2Item) => {
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

    const basePrice = isWeaponSkin(item) ? 100 : isAgent(item) ? 5000 : 50
    const multiplier = rarityMultipliers[item.rarity?.id || "rarity_common"] || 1

    const normalMin = Math.floor(basePrice * multiplier * 0.7)
    const normalMax = Math.floor(basePrice * multiplier * 1.8)
    const stattrakMin = Math.floor(normalMin * 1.5)
    const stattrakMax = Math.floor(normalMax * 1.5)
    const souvenirMin = Math.floor(normalMin * 1.75)
    const souvenirMax = Math.floor(normalMax * 1.75)

    return {
      normalMin,
      normalMax,
      stattrakMin,
      stattrakMax,
      souvenirMin,
      souvenirMax,
    }
  }

  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Grid3x3 className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">All CS2 Items</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Browse all {totalItems} available items from our server (Skins: {skins.length}, Agents: {agents.length},
          Charms: {charms.length})
        </p>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          <Button
            variant={selectedCategory === "skins" ? "default" : "outline"}
            onClick={() => setSelectedCategory("skins")}
            className={`flex-shrink-0 ${selectedCategory === "skins" ? "bg-cyan-500 hover:bg-cyan-600" : ""}`}
          >
            Skins
            <Badge variant="secondary" className="ml-2">
              {skins.length}
            </Badge>
          </Button>
          <Button
            variant={selectedCategory === "agents" ? "default" : "outline"}
            onClick={() => setSelectedCategory("agents")}
            className={`flex-shrink-0 ${selectedCategory === "agents" ? "bg-cyan-500 hover:bg-cyan-600" : ""}`}
          >
            Agents
            <Badge variant="secondary" className="ml-2">
              {agents.length}
            </Badge>
          </Button>
          <Button
            variant={selectedCategory === "charms" ? "default" : "outline"}
            onClick={() => setSelectedCategory("charms")}
            className={`flex-shrink-0 ${selectedCategory === "charms" ? "bg-cyan-500 hover:bg-cyan-600" : ""}`}
          >
            Charms
            <Badge variant="secondary" className="ml-2">
              {charms.length}
            </Badge>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 min-w-full sm:min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3 sm:gap-4">
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="flex-1 sm:w-[180px]">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                {rarities.map((rarity) => (
                  <SelectItem key={rarity} value={rarity}>
                    {getRarityName(rarity)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategory === "skins" && (
              <Select value={selectedWeapon} onValueChange={setSelectedWeapon}>
                <SelectTrigger className="flex-1 sm:w-[180px]">
                  <SelectValue placeholder="Weapon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Weapons</SelectItem>
                  {weapons.map((weapon) => (
                    <SelectItem key={weapon} value={weapon}>
                      {getWeaponName(weapon)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button variant="outline" onClick={clearFilters} className="flex-shrink-0 bg-transparent">
              <Filter className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Clear Filters</span>
            </Button>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
          Showing {filteredItems.length} of {totalItems} items
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-20">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-cyan-400" />
          <span className="ml-3 text-sm sm:text-base text-muted-foreground">Loading CS2 items...</span>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => openItemDetail(item)}
              className="hover:border-cyan-400/50 transition-colors cursor-pointer bg-[#0f1419] border-[#1e2936]"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="aspect-video bg-[#1a1f2e] rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                  {item.image ? (
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <Grid3x3 className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>

                <h3 className="font-semibold text-foreground mb-1 text-sm line-clamp-2" title={item.name}>
                  {isWeaponSkin(item) ? `${item.weapon?.name || ""} | ${item.pattern?.name || ""}` : item.name}
                </h3>

                {isAgent(item) && <p className="text-xs text-muted-foreground mb-2">{item.team?.name || ""}</p>}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: item.rarity?.color || "#666",
                      color: item.rarity?.color || "#666",
                    }}
                  >
                    {item.rarity?.name || "Unknown"}
                  </Badge>

                  {isWeaponSkin(item) && (
                    <div className="flex gap-1">
                      {item.stattrak && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/30"
                        >
                          ST
                        </Badge>
                      )}
                      {item.souvenir && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        >
                          SV
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {isWeaponSkin(item) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Float: {item.min_float?.toFixed(2) ?? "N/A"} - {item.max_float?.toFixed(2) ?? "N/A"}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-12 sm:py-20">
          <Grid3x3 className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No items found</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">Try adjusting your filters or search query</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full sm:max-w-2xl h-full sm:h-auto bg-[#1a1f2e] border-[#2a3441] text-foreground p-0 gap-0 overflow-y-auto">
          {selectedItem && !showPlayersInventory && (
            <>
              <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-[#2a3441] sticky top-0 bg-[#1a1f2e] z-10">
                <DialogTitle className="text-lg sm:text-xl font-bold text-foreground pr-8">
                  {isWeaponSkin(selectedItem)
                    ? `${selectedItem.weapon?.name || "Unknown"} | ${selectedItem.pattern?.name || "Unknown"}`
                    : selectedItem.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isWeaponSkin(selectedItem)
                    ? `View details, pricing, and player inventory for this weapon skin`
                    : isAgent(selectedItem)
                      ? `View details, pricing, and player inventory for this agent`
                      : `View details, pricing, and player inventory for this charm`}
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="w-full sm:w-72">
                    <Card className="bg-[#0f1419] border-[#2a3441]">
                      <CardContent className="p-3 sm:p-4">
                        <div className="aspect-video bg-[#1a1f2e] rounded-lg flex items-center justify-center overflow-hidden relative mb-3">
                          {selectedItem.image ? (
                            <Image
                              src={selectedItem.image || "/placeholder.svg"}
                              alt={selectedItem.name}
                              fill
                              className="object-contain p-4"
                              unoptimized
                            />
                          ) : (
                            <Grid3x3 className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {isWeaponSkin(selectedItem) ? selectedItem.weapon?.name || "Unknown" : selectedItem.name}
                        </h3>
                        {isWeaponSkin(selectedItem) && (
                          <p className="text-xs text-muted-foreground">{selectedItem.pattern?.name || "Unknown"}</p>
                        )}
                        {isAgent(selectedItem) && (
                          <p className="text-xs text-muted-foreground">{selectedItem.team?.name || ""}</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-[#0f1419] rounded-lg p-3 sm:p-4 border border-[#2a3441]">
                      <h3 className="text-xs sm:text-sm text-muted-foreground mb-2">Wear (0.0 - 1.0)</h3>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">
                        {isWeaponSkin(selectedItem) ? (selectedItem.min_float?.toFixed(1) ?? "0") : "0"}
                      </p>
                    </div>

                    <div className="bg-[#0f1419] rounded-lg p-3 sm:p-4 border border-[#2a3441]">
                      <h3 className="text-xs sm:text-sm text-muted-foreground mb-2">Seed (0 - 1,000)</h3>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">0</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">Prices</h3>
                  {loadingPrices ? (
                    <div className="bg-[#0f1419] rounded-lg p-6 sm:p-8 border border-[#2a3441] flex items-center justify-center">
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-cyan-400 mr-2" />
                      <span className="text-sm sm:text-base text-muted-foreground">Loading prices...</span>
                    </div>
                  ) : isWeaponSkin(selectedItem) ? (
                    <Tabs defaultValue="normal" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-[#0f1419]">
                        <TabsTrigger value="normal" className="text-xs sm:text-sm">
                          Normal
                        </TabsTrigger>
                        <TabsTrigger value="stattrak" className="text-xs sm:text-sm">
                          StatTrak
                        </TabsTrigger>
                        <TabsTrigger value="souvenir" className="text-xs sm:text-sm">
                          Souvenir
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="normal" className="mt-4">
                        <div className="bg-[#0f1419] rounded-lg p-3 sm:p-4 border border-[#2a3441]">
                          <p className="text-xl sm:text-2xl font-bold text-foreground">
                            {currentPrices
                              ? `${currentPrices.normalMin.toLocaleString()} - ${currentPrices.normalMax.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="stattrak" className="mt-4">
                        <div className="bg-[#0f1419] rounded-lg p-3 sm:p-4 border border-[#2a3441]">
                          <p className="text-xl sm:text-2xl font-bold text-foreground">
                            {currentPrices
                              ? `${currentPrices.stattrakMin.toLocaleString()} - ${currentPrices.stattrakMax.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="souvenir" className="mt-4">
                        <div className="bg-[#0f1419] rounded-lg p-3 sm:p-4 border border-[#2a3441]">
                          <p className="text-xl sm:text-2xl font-bold text-foreground">
                            {currentPrices
                              ? `${currentPrices.souvenirMin.toLocaleString()} - ${currentPrices.souvenirMax.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="bg-[#0f1419] rounded-lg p-3 sm:p-4 border border-[#2a3441]">
                      <h3 className="text-xs sm:text-sm text-muted-foreground mb-2">Normal</h3>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">
                        {currentPrices ? currentPrices.normalMin.toLocaleString() : "N/A"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm text-muted-foreground mb-3">Cases drop</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {selectedItem.collections?.map((collection) => (
                      <Card
                        key={collection.id}
                        className="bg-[#0f1419] border-[#2a3441] hover:border-cyan-400/50 transition-colors cursor-pointer"
                      >
                        <CardContent className="p-2 sm:p-3 flex flex-col items-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2 relative">
                            <Image
                              src={collection.image || "/placeholder.svg"}
                              alt={collection.name}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                          <p className="text-xs text-center text-foreground line-clamp-2">{collection.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row gap-3 pt-2 sticky bottom-0 bg-[#1a1f2e] pb-2 sm:pb-0 sm:static">
                  {isWeaponSkin(selectedItem) && (
                    <Button
                      variant="outline"
                      className="flex-1 bg-[#2a3441] hover:bg-[#3a4451] border-[#3a4451]"
                      onClick={handleInspect}
                    >
                      Inspect
                    </Button>
                  )}
                  <Button
                    className="flex-1 bg-[#ff6b35] hover:bg-[#ff7f50] text-white"
                    onClick={handleViewPlayersInventory}
                  >
                    View players inventory
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedItem && showPlayersInventory && (
            <>
              <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-[#2a3441] sticky top-0 bg-[#1a1f2e] z-10">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
                    Players owning this item ({playersWithItem.length})
                  </DialogTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowPlayersInventory(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <DialogDescription className="text-sm text-muted-foreground">
                  View all players who currently own this item in their inventory
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 sm:p-6 max-h-[calc(100vh-120px)] sm:max-h-[600px] overflow-y-auto">
                {loadingPlayers ? (
                  <div className="flex items-center justify-center py-12 sm:py-20">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-cyan-400" />
                    <span className="ml-3 text-sm sm:text-base text-muted-foreground">Loading players...</span>
                  </div>
                ) : playersWithItem.length === 0 ? (
                  <div className="text-center py-12 sm:py-20">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                      No players own this item yet
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Be the first to add it to your inventory!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {playersWithItem.map((player) => (
                      <Card
                        key={player.id}
                        className="bg-[#0f1419] border-[#2a3441] hover:border-cyan-400/50 transition-colors"
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold">
                                💰
                              </div>
                              <span className="text-xs sm:text-sm font-semibold text-foreground">
                                {player.wearValue.toFixed(2)} ({player.wearCondition})
                              </span>
                            </div>
                            {player.quality !== "Normal" && (
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  player.quality === "StatTrak"
                                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                }`}
                              >
                                {player.quality === "StatTrak" ? "ST" : "SV"}
                              </Badge>
                            )}
                          </div>

                          <div className="aspect-video bg-[#1a1f2e] rounded-lg flex items-center justify-center overflow-hidden relative mb-3">
                            {selectedItem.image ? (
                              <Image
                                src={selectedItem.image || "/placeholder.svg"}
                                alt={selectedItem.name}
                                fill
                                className="object-contain p-2"
                                unoptimized
                              />
                            ) : (
                              <Grid3x3 className="w-12 h-12 text-muted-foreground" />
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground text-sm">
                                {isWeaponSkin(selectedItem)
                                  ? selectedItem.weapon?.name || "Unknown"
                                  : selectedItem.name}
                              </h3>
                              {isWeaponSkin(selectedItem) && (
                                <p className="text-xs text-muted-foreground">
                                  {selectedItem.pattern?.name || "Unknown"}
                                </p>
                              )}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden relative">
                              {player.steamAvatar ? (
                                <Image
                                  src={player.steamAvatar || "/placeholder.svg"}
                                  alt={player.steamName}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <Users className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 truncate" title={player.steamName}>
                            {player.steamName}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
