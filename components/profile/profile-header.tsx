import { Target, ArrowLeft, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ProfileHeaderProps {
  user: {
    username: string
    steam_name: string | null
    steam_avatar_url: string | null
    rank: string
    vip_tier: string
    created_at: string
    last_login: string
  }
  isPublicView?: boolean
}

export function ProfileHeader({ user, isPublicView = false }: ProfileHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isPublicView ? (
              <Link href="/search">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
            ) : (
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            )}
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 border border-primary/30">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Player Profile</h1>
              <p className="text-sm text-muted-foreground">View your stats and achievements</p>
            </div>
          </div>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {user.steam_avatar_url ? (
                <img
                  src={user.steam_avatar_url || "/placeholder.svg"}
                  alt={user.username}
                  className="w-20 h-20 rounded-lg border-2 border-primary/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{user.username.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-foreground">{user.username}</h2>
                {user.vip_tier !== "NONE" && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    <Crown className="w-3 h-3 mr-1" />
                    {user.vip_tier}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">First connection</p>
                  <p className="text-foreground font-medium">
                    {new Date(user.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    {new Date(user.created_at).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Last connection</p>
                  <p className="text-foreground font-medium">
                    {new Date(user.last_login).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    {new Date(user.last_login).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Panel registered</p>
                  <p className="text-foreground font-medium">Yes</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Activity</p>
                  <p className="text-foreground font-medium">0h. team / 0h. spec</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </header>
  )
}
