import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PlayerCard } from "./player-card"

export async function PlayerSearchResults({
  query,
  limit = 20,
}: {
  query: string
  limit?: number
}) {
  const supabase = await getSupabaseServerClient()

  let queryBuilder = supabase.from("users").select("*").order("kills", { ascending: false }).limit(limit)

  if (query) {
    queryBuilder = queryBuilder.or(`username.ilike.%${query}%,steam_name.ilike.%${query}%`)
  }

  const { data: players } = await queryBuilder

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {query ? "No players found matching your search." : "No players found."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
