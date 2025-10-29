import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Ban, MessageSquareOff, AlertTriangle, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AdminAction {
  id: string
  action_type: string
  reason: string | null
  duration: number | null
  created_at: string
  admin: {
    username: string
  }
  target_user: {
    username: string
    steam_name: string | null
  }
}

interface AdminActionsListProps {
  actions: AdminAction[]
}

const actionIcons: Record<string, any> = {
  ban: Ban,
  mute: MessageSquareOff,
  kick: AlertTriangle,
  warn: AlertTriangle,
  group_change: Users,
}

const actionColors: Record<string, string> = {
  ban: "bg-destructive/10 text-destructive border-destructive/30",
  mute: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  kick: "bg-chart-5/10 text-chart-5 border-chart-5/30",
  warn: "bg-chart-2/10 text-chart-2 border-chart-2/30",
  group_change: "bg-primary/10 text-primary border-primary/30",
}

export function AdminActionsList({ actions }: AdminActionsListProps) {
  if (actions.length === 0) {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No admin actions recorded</h3>
        <p className="text-sm text-muted-foreground">Admin actions will appear here</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {actions.map((action) => {
        const Icon = actionIcons[action.action_type] || Shield
        const colorClass = actionColors[action.action_type] || "bg-secondary/50"

        return (
          <Card key={action.id} className="p-4 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg border ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`capitalize ${colorClass}`}>
                    {action.action_type.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(action.created_at), { addSuffix: true })}
                  </span>
                </div>

                <p className="text-sm text-foreground mb-2">
                  <span className="font-medium">{action.admin.username}</span> {action.action_type}ed{" "}
                  <span className="font-medium">{action.target_user.steam_name || action.target_user.username}</span>
                </p>

                {action.reason && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Reason:</span> {action.reason}
                  </p>
                )}

                {action.duration && (
                  <p className="text-xs text-muted-foreground mt-1">Duration: {action.duration} minutes</p>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
