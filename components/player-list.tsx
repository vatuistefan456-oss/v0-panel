"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Ban, MessageSquare } from "lucide-react"

const players = [
  { id: 1, name: "ProGamer_2024", team: "CT", kills: 18, deaths: 12, ping: 25, status: "active" },
  { id: 2, name: "SniperElite", team: "T", kills: 22, deaths: 10, ping: 32, status: "active" },
  { id: 3, name: "RushB_NoStop", team: "CT", kills: 15, deaths: 15, ping: 45, status: "active" },
  { id: 4, name: "AWP_Master", team: "T", kills: 20, deaths: 11, ping: 28, status: "active" },
  { id: 5, name: "FlashBang_King", team: "CT", kills: 12, deaths: 18, ping: 55, status: "active" },
  { id: 6, name: "Clutch_God", team: "T", kills: 25, deaths: 8, ping: 22, status: "active" },
]

export function PlayerList() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Active Players</h2>
            <p className="text-sm text-muted-foreground">24 players online</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
          <div className="col-span-4">Player</div>
          <div className="col-span-2 text-center">Team</div>
          <div className="col-span-1 text-center">K</div>
          <div className="col-span-1 text-center">D</div>
          <div className="col-span-1 text-center">Ping</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {/* Player Rows */}
        {players.map((player) => (
          <div
            key={player.id}
            className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors items-center"
          >
            <div className="col-span-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                {player.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-foreground truncate">{player.name}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <Badge
                variant="outline"
                className={
                  player.team === "CT"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-destructive/10 text-destructive border-destructive/30"
                }
              >
                {player.team}
              </Badge>
            </div>
            <div className="col-span-1 text-center text-sm font-medium text-foreground">{player.kills}</div>
            <div className="col-span-1 text-center text-sm font-medium text-muted-foreground">{player.deaths}</div>
            <div className="col-span-1 text-center">
              <span className={`text-sm font-medium ${player.ping < 50 ? "text-chart-3" : "text-chart-4"}`}>
                {player.ping}
              </span>
            </div>
            <div className="col-span-3 flex items-center justify-end gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Shield className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                <Ban className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
