"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Coins, Package, Crown, Gem } from "lucide-react"

const categories = [
  { id: "all", label: "All Items", icon: Package },
  { id: "credits", label: "Credits", icon: Coins },
  { id: "cases", label: "Cases", icon: Package },
  { id: "vip", label: "VIP", icon: Crown },
  { id: "shards", label: "Shards", icon: Gem },
]

export function ShopCategories() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
