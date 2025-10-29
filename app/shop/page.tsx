import { ShopCases } from "@/components/shop-cases"
import { PlayerBalance } from "@/components/player-balance"

export default function ShopPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">CS2 Shop</h1>
        <p className="text-muted-foreground">Buy cases, skins, agents, and charms</p>
      </div>

      <PlayerBalance />

      <div className="mt-8">
        <ShopCases />
      </div>
    </main>
  )
}
