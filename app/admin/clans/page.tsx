import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Target, TrendingUp } from "lucide-react"

export default async function ClansPage() {
  const supabase = getSupabaseServerClient()

  const { data: clans } = await supabase
    .from("clans")
    .select(`
      *,
      leader:users!clans_leader_id_fkey(steam_name),
      members:clan_members(count)
    `)
    .eq("is_active", true)
    .order("level", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Clan-uri</h1>
        <p className="text-sm md:text-base text-muted-foreground">Topul clan-urilor de pe server</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clans?.map((clan, index) => (
          <Card key={clan.id} className="relative overflow-hidden">
            {index < 3 && (
              <div className="absolute top-2 right-2">
                <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-cyan-400">[{clan.clan_tag}]</span>
                {clan.clan_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Leader: {clan.leader?.steam_name}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {clan.description && <p className="text-sm text-muted-foreground">{clan.description}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Level</p>
                    <p className="font-semibold">{clan.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Membri</p>
                    <p className="font-semibold">
                      {clan.members?.[0]?.count || 0}/{clan.max_members}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">K/D</p>
                    <p className="font-semibold">
                      {clan.total_deaths > 0 ? (clan.total_kills / clan.total_deaths).toFixed(2) : clan.total_kills}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Victorii</p>
                    <p className="font-semibold">{clan.total_wins}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
