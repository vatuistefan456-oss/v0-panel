"use client"

import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

const data = [
  { time: "00:00", players: 12, tickRate: 128, ping: 25 },
  { time: "04:00", players: 8, tickRate: 128, ping: 28 },
  { time: "08:00", players: 15, tickRate: 128, ping: 22 },
  { time: "12:00", players: 24, tickRate: 128, ping: 30 },
  { time: "16:00", players: 28, tickRate: 128, ping: 26 },
  { time: "20:00", players: 32, tickRate: 128, ping: 24 },
  { time: "23:59", players: 24, tickRate: 128, ping: 27 },
]

export function PerformanceCharts() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Server Performance</h2>
            <p className="text-sm text-muted-foreground">Last 24 hours</p>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Area
              type="monotone"
              dataKey="players"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPlayers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
