"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquareOff, User, Clock, Shield } from "lucide-react"
import { revokeMute } from "@/app/actions/moderation"
import { useTransition } from "react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface MuteItem {
  id: string
  reason: string
  duration: number | null
  created_at: string
  expires_at: string | null
  user: {
    username: string
    steam_name: string | null
  }
  admin: {
    username: string
  }
}

interface MutesListProps {
  mutes: MuteItem[]
  currentAdminId: string
}

export function MutesList({ mutes, currentAdminId }: MutesListProps) {
  const [isPending, startTransition] = useTransition()

  const handleRevoke = (muteId: string) => {
    startTransition(async () => {
      const result = await revokeMute(muteId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  if (mutes.length === 0) {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <MessageSquareOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No active mutes</h3>
        <p className="text-sm text-muted-foreground">All players can communicate freely</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {mutes.map((mute) => (
        <Card key={mute.id} className="p-4 bg-card border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chart-4/10 border border-chart-4/20 text-chart-4">
                <MessageSquareOff className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{mute.user.steam_name || mute.user.username}</h3>
                  {mute.duration ? (
                    <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/30">
                      Temporary
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Permanent</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-muted-foreground min-w-20">Reason:</span>
                    <span className="text-sm text-foreground">{mute.reason}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Muted by {mute.admin.username}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(mute.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {mute.expires_at && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Expires {formatDistanceToNow(new Date(mute.expires_at), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => handleRevoke(mute.id)} disabled={isPending}>
              Revoke Mute
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
