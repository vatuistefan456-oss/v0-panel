"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, Trash2, Clock } from "lucide-react"
import { cancelListing } from "@/app/actions/market"
import { useTransition } from "react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface MyListing {
  id: string
  price: number
  quantity: number
  tax_percentage: number
  created_at: string
  inventory_item: {
    item_name: string
    item_skin: string | null
    weapon_type: string | null
    wear_condition: string | null
    quality: string | null
  }
}

interface MyListingsProps {
  listings: MyListing[]
}

export function MyListings({ listings }: MyListingsProps) {
  const [isPending, startTransition] = useTransition()

  const handleCancel = (listingId: string) => {
    startTransition(async () => {
      const result = await cancelListing(listingId)
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
        <h3 className="text-lg font-semibold text-foreground mb-2">No active listings</h3>
        <p className="text-sm text-muted-foreground">List items from your inventory to start selling!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <Card key={listing.id} className="p-4 bg-card border-border">
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

          <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Listed Price</span>
              <span className="text-lg font-bold text-primary">{listing.price.toLocaleString()}c</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tax: {listing.tax_percentage}% on sale</p>
          </div>

          <Button
            className="w-full"
            variant="destructive"
            size="sm"
            onClick={() => handleCancel(listing.id)}
            disabled={isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Cancel Listing
          </Button>
        </Card>
      ))}
    </div>
  )
}
