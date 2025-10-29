import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileCharts } from "@/components/profile/profile-charts"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getPlayer(username: string) {
  const supabase = await getSupabaseServerClient()
  const { data: player } = await supabase.from("users").select("*").eq("username", username).single()

  return player
}

async function getPlayerInventory(userId: string) {
  const supabase = await getSupabaseServerClient()
  const { data: inventory } = await supabase
    .from("inventory")
    .select("*")
    .eq("user_id", userId)
    .order("price", { ascending: false })
    .limit(12)

  return inventory || []
}

export default async function PlayerProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const player = await getPlayer(params.username)

  if (!player) {
    notFound()
  }

  const inventory = await getPlayerInventory(player.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileHeader user={player} isPublicView={true} />

          {/* Stats */}
          <ProfileStats user={player} />

          {/* Charts */}
          <ProfileCharts />

          {/* Inventory Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Inventory Preview</h2>
              <Badge variant="secondary">{inventory.length} items</Badge>
            </div>
            {inventory.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card-foreground/5 rounded-lg p-3 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-2xl">🔫</span>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{item.item_name}</p>
                    {item.item_skin && <p className="text-xs text-muted-foreground truncate">{item.item_skin}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {item.wear_condition}
                      </Badge>
                      {item.quality !== "Normal" && (
                        <Badge variant="secondary" className="text-xs">
                          {item.quality}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items in inventory</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
