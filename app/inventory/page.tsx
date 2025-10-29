import { PlayerInventory } from "@/components/player-inventory"

export default function InventoryPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Inventory</h1>
        <p className="text-muted-foreground">View and manage your CS2 items</p>
      </div>

      <PlayerInventory />
    </main>
  )
}
