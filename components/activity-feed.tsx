"use client"

import { Card } from "@/components/ui/card"
import { Activity, UserPlus, UserMinus, AlertTriangle, Trophy } from "lucide-react"

const activities = [
  { id: 1, type: "join", user: "ProGamer_2024", message: "joined the server", time: "2m ago", icon: UserPlus },
  { id: 2, type: "kill", user: "SniperElite", message: "got an ACE", time: "5m ago", icon: Trophy },
  { id: 3, type: "leave", user: "NoobPlayer", message: "left the server", time: "8m ago", icon: UserMinus },
  { id: 4, type: "warning", user: "ToxicPlayer", message: "received a warning", time: "12m ago", icon: AlertTriangle },
  { id: 5, type: "join", user: "AWP_Master", message: "joined the server", time: "15m ago", icon: UserPlus },
  { id: 6, type: "kill", user: "Clutch_God", message: "1v5 clutch", time: "18m ago", icon: Trophy },
  { id: 7, type: "join", user: "FlashBang_King", message: "joined the server", time: "22m ago", icon: UserPlus },
  { id: 8, type: "leave", user: "RageQuitter", message: "left the server", time: "25m ago", icon: UserMinus },
]

export function ActivityFeed() {
  return (
    <Card className="p-6 bg-card border-border h-fit sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Activity Feed</h2>
          <p className="text-sm text-muted-foreground">Recent events</p>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
                  activity.type === "join"
                    ? "bg-chart-3/10 text-chart-3 border border-chart-3/30"
                    : activity.type === "leave"
                      ? "bg-muted/50 text-muted-foreground border border-border"
                      : activity.type === "warning"
                        ? "bg-destructive/10 text-destructive border border-destructive/30"
                        : "bg-chart-4/10 text-chart-4 border border-chart-4/30"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.message}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
