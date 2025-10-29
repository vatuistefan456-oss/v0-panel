"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Lock, Tag, Shield } from "lucide-react"
import { equipItem } from "@/app/actions/inventory"
import { useTransition } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface InventoryItem {
  id: string
  item_type: string
  item_name: string
  item_skin: string | null
  weapon_type: string | null
  wear_value: number | null
  wear_condition: string | null
  quality: string | null
  price: number
  quantity: number
  equipped_t: boolean
  equipped_ct: boolean
  is_locked: boolean
  nametag: string | null
}

interface InventoryGridProps {
  items: InventoryItem[]
}

const wearColors: Record<string, string> = {
  "Factory New": "text-chart-3",
  "Minimal Wear": "text-chart-4",
  "Field-Tested": "text-chart-2",
  "Well-Worn": "text-chart-5",
  "Battle-Scarred": "text-destructive",
}

export function InventoryGrid({ items }: InventoryGridProps) {
  const [isPending, startTransition] = useTransition()

  const handleEquip = (itemId: string, side: "t" | "ct" | "both") => {
    startTransition(async () => {
      if (side === "both") {
        const resultT = await equipItem(itemId, "t")
        const resultCT = await equipItem(itemId, "ct")
        if (resultT.success && resultCT.success) {
          toast.success("Equipped for both T and CT")
        } else {
          toast.error("Failed to equip for both sides")
        }
      } else {
        const result = await equipItem(itemId, side)
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      }
    })
  }

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No items in inventory</h3>
        <p className="text-sm text-muted-foreground">Purchase items from the shop to get started!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {item.quality === "StatTrak™" && (
                    <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/30 text-xs">
                      ST
                    </Badge>
                  )}
                  {item.quality === "Souvenir" && (
                    <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/30 text-xs">
                      SV
                    </Badge>
                  )}
                </div>
                {item.is_locked && <Lock className="w-4 h-4 text-muted-foreground" />}
              </div>

              <div className="mb-3">
                <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-1">
                  {item.weapon_type || item.item_name}
                </h3>
                {item.item_skin && <p className="text-xs text-muted-foreground line-clamp-1">{item.item_skin}</p>}
                {item.nametag && (
                  <div className="flex items-center gap-1 mt-1">
                    <Tag className="w-3 h-3 text-primary" />
                    <p className="text-xs text-primary line-clamp-1">{item.nametag}</p>
                  </div>
                )}
              </div>

              {item.wear_condition && (
                <div className="mb-3">
                  <p className={`text-xs font-medium ${wearColors[item.wear_condition] || "text-muted-foreground"}`}>
                    {item.wear_condition}
                  </p>
                  {item.wear_value !== null && (
                    <p className="text-xs text-muted-foreground">Float: {item.wear_value.toFixed(4)}</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                  {item.equipped_t && (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/30 text-xs"
                    >
                      T
                    </Badge>
                  )}
                  {item.equipped_ct && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                      CT
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{item.price.toLocaleString()}c</p>
                  <p className="text-xs text-muted-foreground">${(item.price / 1000).toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {item.weapon_type || item.item_name}
                {item.is_locked && <Lock className="w-4 h-4 text-muted-foreground" />}
              </DialogTitle>
              <DialogDescription>
                {item.item_skin && <span className="text-foreground font-medium">{item.item_skin}</span>}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {item.nametag && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Tag className="w-4 h-4 text-primary" />
                  <p className="text-sm text-primary font-medium">{item.nametag}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="text-sm font-medium text-foreground capitalize">{item.item_type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Quality</p>
                  <p className="text-sm font-medium text-foreground">{item.quality || "Normal"}</p>
                </div>
                {item.wear_condition && (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Condition</p>
                      <p className={`text-sm font-medium ${wearColors[item.wear_condition]}`}>{item.wear_condition}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Float Value</p>
                      <p className="text-sm font-medium text-foreground">{item.wear_value?.toFixed(4)}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Price</p>
                  <p className="text-sm font-medium text-foreground">{item.price.toLocaleString()} credits</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                  <p className="text-sm font-medium text-foreground">{item.quantity}</p>
                </div>
              </div>

              {item.item_type === "skin" && !item.is_locked && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Equip Item
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={item.equipped_t ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEquip(item.id, "t")}
                      disabled={isPending}
                    >
                      {item.equipped_t ? "✓ T" : "T"}
                    </Button>
                    <Button
                      variant={item.equipped_ct ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEquip(item.id, "ct")}
                      disabled={isPending}
                    >
                      {item.equipped_ct ? "✓ CT" : "CT"}
                    </Button>
                    <Button
                      variant={item.equipped_t && item.equipped_ct ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEquip(item.id, "both")}
                      disabled={isPending}
                    >
                      {item.equipped_t && item.equipped_ct ? "✓ Both" : "Both"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
