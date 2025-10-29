import type React from "react"
import { Card } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"

interface ServerStatsProps {
  icon: React.ReactNode
  label: string
  value: string
  subtext: string
  trend: string
}

export function ServerStats({ icon, label, value, subtext, trend }: ServerStatsProps) {
  const isPositive = trend.startsWith("+")
  const isNeutral = trend === "0%"

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary">
          {icon}
        </div>
        {!isNeutral && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-chart-3" : "text-destructive"}`}
          >
            {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </div>
    </Card>
  )
}
