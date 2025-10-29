"use client"

import { Trophy } from "lucide-react"

export function RanksHeader() {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Leaderboards</h1>
            <p className="text-sm text-muted-foreground">Top players ranked by performance</p>
          </div>
        </div>
      </div>
    </div>
  )
}
