"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface InventoryItem {
  id: number
  item_type: string
  item_id: number
  item_name: string
  acquired_from: string
  acquired_at: string
  is_equipped: boolean
}

export function PlayerInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/player/inventory")
      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const groupedInventory = {
    cases: inventory.filter((i) => i.item_type === "case"),
    skins: inventory.filter((i) => i.item_type === "skin"),
    agents: inventory.filter((i) => i.item_type === "agent"),
    charms: inventory.filter((i) => i.item_type === "charm"),
  }

  if (loading) {
    return <div className="text-center py-12">Loading inventory...</div>
  }

  if (inventory.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">Your inventory is empty</p>
        <p className="text-sm">Visit the shop to buy cases, skins, agents, and charms!</p>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">All ({inventory.length})</TabsTrigger>
        <TabsTrigger value="cases">Cases ({groupedInventory.cases.length})</TabsTrigger>
        <TabsTrigger value="skins">Skins ({groupedInventory.skins.length})</TabsTrigger>
        <TabsTrigger value="agents">Agents ({groupedInventory.agents.length})</TabsTrigger>
        <TabsTrigger value="charms">Charms ({groupedInventory.charms.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {inventory.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="aspect-square relative mb-4 bg-muted rounded-lg" />
              <h3 className="font-semibold mb-2">{item.item_name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{item.item_type}</Badge>
                {item.is_equipped && <Badge variant="default">Equipped</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Acquired: {new Date(item.acquired_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </TabsContent>

      {Object.entries(groupedInventory).map(([key, items]) => (
        <TabsContent key={key} value={key}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="aspect-square relative mb-4 bg-muted rounded-lg" />
                <h3 className="font-semibold mb-2">{item.item_name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.acquired_from}</Badge>
                  {item.is_equipped && <Badge variant="default">Equipped</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{new Date(item.acquired_at).toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
