import { Card } from "@/components/ui/card"
import { Target, Skull, Clock, TrendingUp } from "lucide-react"

interface ProfileStatsProps {
  user: {
    kills: number
    deaths: number
    headshots: number
    time_played: number
  }
}

export function ProfileStats({ user }: ProfileStatsProps) {
  const kdRatio = user.deaths > 0 ? (user.kills / user.deaths).toFixed(2) : user.kills.toFixed(2)
  const headshotPercentage = user.kills > 0 ? ((user.headshots / user.kills) * 100).toFixed(1) : "0.0"
  const hoursPlayed = Math.floor(user.time_played / 60)
  const minutesPlayed = user.time_played % 60

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">Combat Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">K/D Ratio</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{kdRatio}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {user.kills}K / {user.deaths}D
          </p>
        </div>

        <div className="p-4 rounded-lg bg-chart-3/5 border border-chart-3/20">
          <div className="flex items-center gap-2 mb-2">
            <Skull className="w-4 h-4 text-chart-3" />
            <span className="text-xs text-muted-foreground">Headshots</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{headshotPercentage}%</p>
          <p className="text-xs text-muted-foreground mt-1">{user.headshots} total</p>
        </div>

        <div className="p-4 rounded-lg bg-chart-4/5 border border-chart-4/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-chart-4" />
            <span className="text-xs text-muted-foreground">Time Played</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{hoursPlayed}h</p>
          <p className="text-xs text-muted-foreground mt-1">{minutesPlayed}m</p>
        </div>

        <div className="p-4 rounded-lg bg-chart-2/5 border border-chart-2/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-chart-2" />
            <span className="text-xs text-muted-foreground">Total Kills</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{user.kills}</p>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </div>
      </div>
    </Card>
  )
}
