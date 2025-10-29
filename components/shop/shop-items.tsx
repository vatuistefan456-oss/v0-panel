"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, DollarSign, Package, Crown, Gem } from "lucide-react"
import { purchaseItem } from "@/app/actions/shop"
import { useTransition } from "react"
import { toast } from "sonner"

interface ShopItem {
  id: string
  category: string
  name: string
  description: string | null
  price_credits: number | null
  price_real_money: number | null
  discount_percentage: number
  image_url: string | null
  stock: number
}

interface ShopItemsProps {
  items: ShopItem[]
  user: {
    id: string
    credits: number
    real_money_balance: number
    vip_tier: string
  }
}

const categoryIcons: Record<string, any> = {
  credits: Coins,
  cases: Package,
  vip: Crown,
  shards: Gem,
}

export function ShopItems({ items, user }: ShopItemsProps) {
  const [isPending, startTransition] = useTransition()

  const handlePurchase = (itemId: string, paymentMethod: "credits" | "real_money") => {
    startTransition(async () => {
      const result = await purchaseItem(itemId, paymentMethod)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No items available</h3>
        <p className="text-sm text-muted-foreground">Check back later for new items!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const Icon = categoryIcons[item.category] || Package
        const discountedCredits =
          item.price_credits && item.discount_percentage
            ? Math.floor(item.price_credits * (1 - item.discount_percentage / 100))
            : item.price_credits
        const discountedMoney =
          item.price_real_money && item.discount_percentage
            ? (item.price_real_money * (1 - item.discount_percentage / 100)).toFixed(2)
            : item.price_real_money

        return (
          <Card key={item.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Icon className="w-6 h-6" />
              </div>
              {item.discount_percentage > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{item.discount_percentage}%
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">{item.name}</h3>
            {item.description && <p className="text-sm text-muted-foreground mb-4">{item.description}</p>}

            <div className="space-y-2 mb-4">
              {item.price_credits && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-chart-3" />
                    <span className="text-sm text-muted-foreground">Credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.discount_percentage > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        {item.price_credits.toLocaleString()}
                      </span>
                    )}
                    <span className="text-lg font-bold text-foreground">{discountedCredits?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {item.price_real_money && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-chart-4" />
                    <span className="text-sm text-muted-foreground">Real Money</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.discount_percentage > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${item.price_real_money.toFixed(2)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-foreground">${discountedMoney}</span>
                  </div>
                </div>
              )}
            </div>

            {item.stock !== -1 && (
              <p className="text-xs text-muted-foreground mb-4">
                {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
              </p>
            )}

            <div className="flex gap-2">
              {item.price_credits && (
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={() => handlePurchase(item.id, "credits")}
                  disabled={
                    isPending || (item.stock !== -1 && item.stock === 0) || user.credits < (discountedCredits || 0)
                  }
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Buy
                </Button>
              )}
              {item.price_real_money && (
                <Button
                  className="flex-1 bg-transparent"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePurchase(item.id, "real_money")}
                  disabled={
                    isPending ||
                    (item.stock !== -1 && item.stock === 0) ||
                    user.real_money_balance < Number.parseFloat(discountedMoney || "0")
                  }
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Buy
                </Button>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
