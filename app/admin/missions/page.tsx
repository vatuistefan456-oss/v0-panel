import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Calendar, TrendingUp, Award } from "lucide-react"

async function getUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")
  if (!sessionCookie) return null

  const supabase = getSupabaseServerClient()
  const { data: user } = await supabase.from("users").select("*").eq("id", sessionCookie.value).single()

  return user
}

export default async function MissionsPage() {
  const user = await getUser()
  const supabase = getSupabaseServerClient()

  if (!user) {
    return (
      <div className="p-6">
        <p>Trebuie sa fii autentificat pentru a vedea misiunile.</p>
      </div>
    )
  }

  const now = new Date()
  const dailyReset = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weeklyReset = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
  )
  const monthlyReset = new Date(now.getFullYear(), now.getMonth(), 1)

  const { data: dailyMissions } = await supabase
    .from("missions")
    .select(`
      *,
      progress:user_mission_progress(*)
    `)
    .eq("mission_type", "daily")
    .eq("is_active", true)
    .eq("progress.user_id", user.id)
    .eq("progress.reset_at", dailyReset.toISOString())

  const { data: weeklyMissions } = await supabase
    .from("missions")
    .select(`
      *,
      progress:user_mission_progress(*)
    `)
    .eq("mission_type", "weekly")
    .eq("is_active", true)
    .eq("progress.user_id", user.id)
    .eq("progress.reset_at", weeklyReset.toISOString())

  const { data: monthlyMissions } = await supabase
    .from("missions")
    .select(`
      *,
      progress:user_mission_progress(*)
    `)
    .eq("mission_type", "monthly")
    .eq("is_active", true)
    .eq("progress.user_id", user.id)
    .eq("progress.reset_at", monthlyReset.toISOString())

  const renderMissions = (missions: any[], type: string, icon: any) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-bold capitalize">{type} Missions</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {missions?.map((mission) => {
          const progress = mission.progress?.[0]
          const currentProgress = progress?.current_progress || 0
          const percentage = Math.min((currentProgress / mission.objective_target) * 100, 100)
          const isCompleted = progress?.is_completed || false

          return (
            <Card key={mission.id} className={isCompleted ? "border-green-500" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{mission.mission_name}</CardTitle>
                  {isCompleted && (
                    <Badge variant="default" className="bg-green-500">
                      Completat
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{mission.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progres</span>
                    <span className="font-semibold">
                      {currentProgress}/{mission.objective_target}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>{mission.reward_credits} credite</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <span>{mission.reward_experience} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Misiuni</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Completeaza misiuni pentru a castiga credite si experienta
        </p>
      </div>

      {renderMissions(dailyMissions || [], "daily", <Calendar className="h-5 w-5 text-cyan-400" />)}
      {renderMissions(weeklyMissions || [], "weekly", <Target className="h-5 w-5 text-cyan-400" />)}
      {renderMissions(monthlyMissions || [], "monthly", <Award className="h-5 w-5 text-cyan-400" />)}
    </div>
  )
}
