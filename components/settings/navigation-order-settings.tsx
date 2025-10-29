"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Eye, EyeOff } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { updateNavigationOrder } from "@/app/actions/settings"
import { useToast } from "@/hooks/use-toast"

interface NavItem {
  key: string
  label: string
  order: number
  visible: boolean
}

const defaultNavItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", order: 1, visible: true },
  { key: "shop", label: "Shop", order: 2, visible: true },
  { key: "inventory", label: "Inventory", order: 3, visible: true },
  { key: "market", label: "Market", order: 4, visible: true },
  { key: "ranks", label: "Ranks", order: 5, visible: true },
  { key: "profile", label: "Profile", order: 6, visible: true },
  { key: "moderation", label: "Moderation", order: 7, visible: true },
  { key: "players", label: "Players", order: 8, visible: true },
  { key: "admins", label: "Admins", order: 9, visible: true },
  { key: "manage_admins_vips", label: "Manage Admins+Vips", order: 10, visible: true },
  { key: "settings", label: "Settings", order: 11, visible: true },
  { key: "search", label: "Search Players", order: 12, visible: true },
]

export function NavigationOrderSettings() {
  const [items, setItems] = useState<NavItem[]>(defaultNavItems)
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

  const toggleVisibility = (key: string) => {
    setItems(items.map((item) => (item.key === key ? { ...item, visible: !item.visible } : item)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateNavigationOrder(items)
      toast({
        title: "Success",
        description: "Navigation order updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update navigation order",
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
          <h3 className="text-lg font-bold text-foreground">Navigation Order</h3>
          <p className="text-sm text-muted-foreground">Drag and drop to reorder navigation items</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Order"}
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="navigation">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {items.map((item, index) => (
                <Draggable key={item.key} draggableId={item.key} index={index}>
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
                      <span className="flex-1 font-medium text-foreground">{item.label}</span>
                      <Button variant="ghost" size="sm" onClick={() => toggleVisibility(item.key)} className="gap-2">
                        {item.visible ? (
                          <>
                            <Eye className="w-4 h-4" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hidden
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  )
}
