"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, Coins, User, Clock } from "lucide-react"
import { purchaseMarketItem } from "@/app/actions/market"
import { useTransition } from "react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface MarketListing {
  id: string
  seller_id: string
  price: number
  quantity: number
  tax_percentage: number
  tax_amount: number
  created_at: string
  seller: {
    username: string
    steam_name: string | null
  }
  inventory_item: {
    item_name: string
    item_skin: string | null
    weapon_type: string | null
    wear_condition: string | null
    quality: string | null
  }
}

interface MarketListingsProps {
  listings: MarketListing[]
  currentUserId: string
  userCredits: number
}

export function MarketListings({ listings, currentUserId, userCredits }: MarketListingsProps) {
  const [isPending, startTransition] = useTransition()

  const handlePurchase = (listingId: string) => {
    startTransition(async () => {
      const result = await purchaseMarketItem(listingId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  if (listings.length === 0) {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No listings available</h3>
        <p className="text-sm text-muted-foreground">Be the first to list an item on the market!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => {
        const totalPrice = listing.price + (listing.tax_amount || 0)
        const canAfford = userCredits >= totalPrice
        const isOwnListing = listing.seller_id === currentUserId

        return (
          <Card key={listing.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {listing.inventory_item.quality === "StatTrak™" && (
                  <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/30 text-xs">
                    ST
                  </Badge>
                )}
                {listing.inventory_item.quality === "Souvenir" && (
                  <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/30 text-xs">
                    SV
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-sm font-bold text-foreground mb-1">
                {listing.inventory_item.weapon_type || listing.inventory_item.item_name}
              </h3>
              {listing.inventory_item.item_skin && (
                <p className="text-xs text-muted-foreground">{listing.inventory_item.item_skin}</p>
              )}
              {listing.inventory_item.wear_condition && (
                <p className="text-xs text-muted-foreground mt-1">{listing.inventory_item.wear_condition}</p>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-secondary/50">
              <User className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Seller</p>
                <p className="text-sm font-medium text-foreground truncate">
                  {listing.seller.steam_name || listing.seller.username}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Item Price</span>
                <span className="text-sm font-medium text-foreground">{listing.price.toLocaleString()}c</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tax ({listing.tax_percentage}%)</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {(listing.tax_amount || 0).toLocaleString()}c
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-primary/20">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-primary">{totalPrice.toLocaleString()}c</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="sm"
              onClick={() => handlePurchase(listing.id)}
              disabled={isPending || !canAfford || isOwnListing}
            >
              <Coins className="w-4 h-4 mr-2" />
              {isOwnListing ? "Your Listing" : !canAfford ? "Insufficient Credits" : "Purchase"}
            </Button>
          </Card>
        )
      })}
    </div>
  )
}
