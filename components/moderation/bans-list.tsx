"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ban, User, Clock, Shield } from "lucide-react"
import { revokeBan } from "@/app/actions/moderation"
import { useTransition } from "react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface BanItem {
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

interface BansListProps {
  bans: BanItem[]
  currentAdminId: string
}

export function BansList({ bans, currentAdminId }: BansListProps) {
  const [isPending, startTransition] = useTransition()

  const handleRevoke = (banId: string) => {
    startTransition(async () => {
      const result = await revokeBan(banId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  if (bans.length === 0) {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <Ban className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No active bans</h3>
        <p className="text-sm text-muted-foreground">All players are currently in good standing</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bans.map((ban) => (
        <Card key={ban.id} className="p-4 bg-card border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                <Ban className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{ban.user.steam_name || ban.user.username}</h3>
                  {ban.duration ? (
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
                    <span className="text-sm text-foreground">{ban.reason}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Banned by {ban.admin.username}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(ban.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {ban.expires_at && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Expires {formatDistanceToNow(new Date(ban.expires_at), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => handleRevoke(ban.id)} disabled={isPending}>
              Revoke Ban
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
