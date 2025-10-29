"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Package } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { updateShopItemOrder } from "@/app/actions/settings"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface ShopItem {
  id: number
  name: string
  category: string
  order: number
  price_credits: number | null
  price_real_money: number | null
}

interface ShopItemOrderProps {
  items: ShopItem[]
}

export function ShopItemOrder({ items: initialItems }: ShopItemOrderProps) {
  const [items, setItems] = useState<ShopItem[]>(initialItems.sort((a, b) => a.order - b.order))
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)

    // Update order numbers
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }))

    setItems(updatedItems)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const orderData = items.map((item) => ({
        id: item.id,
        order: item.order,
        category: item.category,
      }))

      const result = await updateShopItemOrder(orderData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update shop item order",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Shop Item Order</h3>
          <p className="text-sm text-muted-foreground">Drag and drop to reorder shop items</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Order"}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No shop items to reorder</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="shop-items">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {items.map((item, index) => (
                  <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-3 p-4 rounded-lg border ${
                          snapshot.isDragging ? "bg-accent border-primary" : "bg-card border-border"
                        }`}
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{item.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {item.price_credits && <span>{item.price_credits.toLocaleString()} credits</span>}
                            {item.price_real_money && <span>${item.price_real_money.toFixed(2)}</span>}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">#{item.order}</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Card>
  )
}
