"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getDemoLeaderboard } from "@/lib/demo-data"

export function RanksTable() {
  const [page, setPage] = useState(1)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const itemsPerPage = 10

  useEffect(() => {
    // In demo mode, use demo data
    const data = getDemoLeaderboard()
    setLeaderboard(data)
  }, [])

  const totalPages = Math.ceil(leaderboard.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = leaderboard.slice(startIndex, endIndex)

  const getPositionColor = (position: number) => {
    if (position === 1) return "bg-gradient-to-r from-yellow-500 to-orange-500"
    if (position === 2) return "bg-gradient-to-r from-purple-500 to-pink-500"
    if (position === 3) return "bg-gradient-to-r from-green-500 to-emerald-500"
    return "bg-muted"
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Position</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Player</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Kills</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Deaths</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">K/D</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Headshots</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">MVP</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentItems.map((player, index) => {
                const position = startIndex + index + 1
                const kd = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills.toFixed(2)
                const hours = Math.floor(player.time_played / 60)

                return (
                  <tr key={player.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <Badge className={getPositionColor(position)}>{position}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={player.steam_avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{player.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{player.username}</div>
                          <div className="text-sm text-muted-foreground">{player.steam_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant="outline" className="font-mono">
                        {player.kills.toLocaleString()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{player.deaths.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-medium">{kd}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{player.headshots.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{player.mvp.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{hours}h</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, leaderboard.length)} of {leaderboard.length} players
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}
          {totalPages > 5 && (
            <>
              <span className="text-muted-foreground">...</span>
              <Button variant="outline" size="sm" disabled>
                {totalPages}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
