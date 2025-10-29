import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PlayerCard } from "./player-card"

export async function TopPlayers() {
  const supabase = await getSupabaseServerClient()

  const { data: players } = await supabase.from("users").select("*").order("kills", { ascending: false }).limit(8)

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No top players found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {players.map((player, index) => (
        <div key={player.id} className="relative">
          {index < 3 && (
            <div className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background">
              <span className="text-xs font-bold text-primary-foreground">#{index + 1}</span>
            </div>
          )}
          <PlayerCard player={player} />
        </div>
      ))}
    </div>
  )
}
