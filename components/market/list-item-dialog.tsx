"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { listItemOnMarket } from "@/app/actions/market"
import { toast } from "sonner"

export function ListItemDialog() {
  const [open, setOpen] = useState(false)
  const [itemId, setItemId] = useState("")
  const [price, setPrice] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await listItemOnMarket(itemId, Number.parseInt(price))
      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        setItemId("")
        setPrice("")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          List Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List Item on Market</DialogTitle>
          <DialogDescription>
            Select an item from your inventory and set a price to list it on the market.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item</Label>
            <Select value={itemId} onValueChange={setItemId}>
              <SelectTrigger id="item">
                <SelectValue placeholder="Select an item from inventory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Go to inventory to see items</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Note: Visit your inventory page to see available items. This is a simplified demo.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (Credits)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price in credits"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
              required
            />
            <p className="text-xs text-muted-foreground">A 30% tax will be applied when the item sells</p>
          </div>

          <Button type="submit" className="w-full" disabled={isPending || !itemId || !price}>
            List Item
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
