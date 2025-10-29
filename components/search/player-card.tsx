import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Clock } from "lucide-react"

interface Player {
  id: string
  username: string
  steam_name: string | null
  steam_avatar_url: string | null
  rank: string
  vip_tier: string
  kills: number
  deaths: number
  headshots: number
  time_played: number
}

export function PlayerCard({ player }: { player: Player }) {
  const kdRatio = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills.toFixed(2)
  const hsPercentage = player.kills > 0 ? ((player.headshots / player.kills) * 100).toFixed(1) : "0.0"
  const hoursPlayed = Math.floor(player.time_played / 3600)

  return (
    <Link href={`/player/${player.username}`}>
      <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer group">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
            {player.steam_avatar_url ? (
              <img
                src={player.steam_avatar_url || "/placeholder.svg"}
                alt={player.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-primary">{player.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {player.username}
            </h3>
            {player.steam_name && <p className="text-xs text-muted-foreground truncate">{player.steam_name}</p>}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {player.rank}
              </Badge>
              {player.vip_tier !== "DEFAULT" && (
                <Badge variant="secondary" className="text-xs">
                  {player.vip_tier}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-card-foreground/5 rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-3 h-3 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">{kdRatio}</p>
            <p className="text-xs text-muted-foreground">K/D</p>
          </div>
          <div className="bg-card-foreground/5 rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-3 h-3 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">{hsPercentage}%</p>
            <p className="text-xs text-muted-foreground">HS</p>
          </div>
          <div className="bg-card-foreground/5 rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">{hoursPlayed}h</p>
            <p className="text-xs text-muted-foreground">Played</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
