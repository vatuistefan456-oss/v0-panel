"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Store, Plus, Edit, Trash2, Package } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createShopItem, deleteShopItem } from "@/app/actions/admin"

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
  is_active: boolean
}

interface ShopManagementProps {
  items: ShopItem[]
  isDemo: boolean
}

export function ShopManagement({ items, isDemo }: ShopManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null)
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState({
    category: "credits",
    name: "",
    description: "",
    price_credits: "",
    price_real_money: "",
    discount_percentage: "0",
    image_url: "",
    stock: "-1",
    publishToStore: true,
  })

  const handleCreate = () => {
    if (isDemo) {
      toast.error("This feature is disabled in demo mode")
      return
    }

    startTransition(async () => {
      const result = await createShopItem({
        category: formData.category,
        name: formData.name,
        description: formData.description,
        price_credits: formData.price_credits ? Number.parseInt(formData.price_credits) : null,
        price_real_money: formData.price_real_money ? Number.parseFloat(formData.price_real_money) : null,
        discount_percentage: Number.parseInt(formData.discount_percentage),
        image_url: formData.image_url || null,
        stock: Number.parseInt(formData.stock),
        published_to_store: formData.publishToStore,
      })

      if (result.success) {
        toast.success(result.message)
        setIsCreateOpen(false)
        setFormData({
          category: "credits",
          name: "",
          description: "",
          price_credits: "",
          price_real_money: "",
          discount_percentage: "0",
          image_url: "",
          stock: "-1",
          publishToStore: true,
        })
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleDelete = (itemId: string) => {
    if (isDemo) {
      toast.error("This feature is disabled in demo mode")
      return
    }

    startTransition(async () => {
      const result = await deleteShopItem(itemId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Shop Management</h1>
            <p className="text-sm text-muted-foreground">Create and manage shop items</p>
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={isDemo}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Shop Item</DialogTitle>
              <DialogDescription>Add a new item to the shop</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credits">Credits</SelectItem>
                      <SelectItem value="cases">Cases</SelectItem>
                      <SelectItem value="skins">Skins</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="shards">Shards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Item name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Item description"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Credits Price</Label>
                  <Input
                    type="number"
                    value={formData.price_credits}
                    onChange={(e) => setFormData({ ...formData, price_credits: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Real Money Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price_real_money}
                    onChange={(e) => setFormData({ ...formData, price_real_money: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Discount %</Label>
                  <Input
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stock (-1 for unlimited)</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border">
                <div>
                  <Label className="text-base">Publish to Store</Label>
                  <p className="text-sm text-muted-foreground">Make this item visible in the public shop</p>
                </div>
                <Switch
                  checked={formData.publishToStore}
                  onCheckedChange={(checked) => setFormData({ ...formData, publishToStore: checked })}
                />
              </div>

              <Button onClick={handleCreate} disabled={isPending || isDemo} className="w-full">
                Create Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between mb-3">
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" disabled={isDemo}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending || isDemo}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="text-sm font-bold text-foreground mb-1">{item.name}</h3>
            {item.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>}

            <div className="space-y-1 pt-3 border-t border-border">
              {item.price_credits && (
                <p className="text-xs text-muted-foreground">Credits: {item.price_credits.toLocaleString()}</p>
              )}
              {item.price_real_money && (
                <p className="text-xs text-muted-foreground">Money: ${item.price_real_money.toFixed(2)}</p>
              )}
              {item.discount_percentage > 0 && (
                <p className="text-xs text-chart-3">Discount: {item.discount_percentage}%</p>
              )}
              <p className="text-xs text-muted-foreground">Stock: {item.stock === -1 ? "Unlimited" : item.stock}</p>
              <Badge variant={item.is_active ? "default" : "secondary"} className="text-xs">
                {item.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card className="p-12 text-center bg-card border-border">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No shop items</h3>
          <p className="text-sm text-muted-foreground">Create your first shop item to get started</p>
        </Card>
      )}
    </div>
  )
}
