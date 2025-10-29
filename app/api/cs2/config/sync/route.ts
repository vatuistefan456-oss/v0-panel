import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-key-validation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const apiKeyValidation = await validateApiKey(request)
    if (!apiKeyValidation.valid) {
      return NextResponse.json({ success: false, error: apiKeyValidation.error }, { status: apiKeyValidation.status })
    }

    const config = await request.json()
    const supabase = getSupabaseServerClient()

    if (config.Missions) {
      // Sync Daily Missions
      for (const mission of config.Missions.Daily) {
        if (!mission.enabled) continue

        const { error } = await supabase.from("missions").upsert(
          {
            mission_id: mission.id,
            name: mission.name,
            description: mission.description,
            type: mission.type,
            period: "daily",
            weapon: mission.weapon || null,
            target: mission.target,
            credits_reward: mission.credits_reward,
            xp_reward: mission.xp_reward,
            enabled: mission.enabled,
          },
          { onConflict: "mission_id" },
        )

        if (error) {
          console.error(`[v0] Error syncing mission ${mission.id}:`, error)
        }
      }

      // Sync Weekly Missions
      for (const mission of config.Missions.Weekly) {
        if (!mission.enabled) continue

        await supabase.from("missions").upsert(
          {
            mission_id: mission.id,
            name: mission.name,
            description: mission.description,
            type: mission.type,
            period: "weekly",
            weapon: mission.weapon || null,
            target: mission.target,
            credits_reward: mission.credits_reward,
            xp_reward: mission.xp_reward,
            enabled: mission.enabled,
          },
          { onConflict: "mission_id" },
        )
      }

      // Sync Monthly Missions
      for (const mission of config.Missions.Monthly) {
        if (!mission.enabled) continue

        await supabase.from("missions").upsert(
          {
            mission_id: mission.id,
            name: mission.name,
            description: mission.description,
            type: mission.type,
            period: "monthly",
            weapon: mission.weapon || null,
            target: mission.target,
            credits_reward: mission.credits_reward,
            xp_reward: mission.xp_reward,
            enabled: mission.enabled,
          },
          { onConflict: "mission_id" },
        )
      }

      const allMissionIds = [
        ...config.Missions.Daily.filter((m: any) => m.enabled).map((m: any) => m.id),
        ...config.Missions.Weekly.filter((m: any) => m.enabled).map((m: any) => m.id),
        ...config.Missions.Monthly.filter((m: any) => m.enabled).map((m: any) => m.id),
      ]

      await supabase
        .from("missions")
        .update({ enabled: false })
        .not("mission_id", "in", `(${allMissionIds.join(",")})`)
    }

    return NextResponse.json({
      success: true,
      message: "Config synced successfully",
      synced: {
        daily: config.Missions?.Daily?.filter((m: any) => m.enabled).length || 0,
        weekly: config.Missions?.Weekly?.filter((m: any) => m.enabled).length || 0,
        monthly: config.Missions?.Monthly?.filter((m: any) => m.enabled).length || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Error syncing config:", error)
    return NextResponse.json({ success: false, error: "Failed to sync config" }, { status: 500 })
  }
}
