"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export function InventoryFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [itemType, setItemType] = useState("all")
  const [wearCondition, setWearCondition] = useState("all")
  const [quality, setQuality] = useState("all")

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={itemType} onValueChange={setItemType}>
          <SelectTrigger>
            <SelectValue placeholder="Item Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="skin">Skins</SelectItem>
            <SelectItem value="agent">Agents</SelectItem>
            <SelectItem value="charm">Charms</SelectItem>
            <SelectItem value="case">Cases</SelectItem>
            <SelectItem value="shard">Shards</SelectItem>
            <SelectItem value="voucher">Vouchers</SelectItem>
          </SelectContent>
        </Select>

        <Select value={wearCondition} onValueChange={setWearCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Wear Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="Factory New">Factory New</SelectItem>
            <SelectItem value="Minimal Wear">Minimal Wear</SelectItem>
            <SelectItem value="Field-Tested">Field-Tested</SelectItem>
            <SelectItem value="Well-Worn">Well-Worn</SelectItem>
            <SelectItem value="Battle-Scarred">Battle-Scarred</SelectItem>
          </SelectContent>
        </Select>

        <Select value={quality} onValueChange={setQuality}>
          <SelectTrigger>
            <SelectValue placeholder="Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Qualities</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="StatTrak™">StatTrak™</SelectItem>
            <SelectItem value="Souvenir">Souvenir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("")
            setItemType("all")
            setWearCondition("all")
            setQuality("all")
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
