import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-key-validation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const validation = await validateApiKey(request)
  if (!validation.valid) {
    return validation.response
  }

  try {
    const { steam_id, objective_type, weapon, amount = 1 } = await request.json()

    if (!steam_id || !objective_type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Gasire user
    const { data: user } = await supabase.from("users").select("id").eq("steam_id", steam_id).single()

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Gasire misiuni active care se potrivesc
    const now = new Date()
    const { data: missions } = await supabase
      .from("missions")
      .select("*")
      .eq("is_active", true)
      .eq("objective_type", objective_type)
      .or(`objective_weapon.is.null,objective_weapon.eq.${weapon || "null"}`)

    if (!missions || missions.length === 0) {
      return NextResponse.json({ success: true, completed: [] })
    }

    const completedMissions = []

    for (const mission of missions) {
      // Calcul reset_at bazat pe mission_type
      let resetAt: Date
      if (mission.mission_type === "daily") {
        resetAt = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      } else if (mission.mission_type === "weekly") {
        const day = now.getDay()
        const diff = now.getDate() - day + (day === 0 ? -6 : 1)
        resetAt = new Date(now.getFullYear(), now.getMonth(), diff)
      } else {
        resetAt = new Date(now.getFullYear(), now.getMonth(), 1)
      }

      // Gasire sau creare progress
      const { data: progress } = await supabase
        .from("user_mission_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("mission_id", mission.id)
        .eq("reset_at", resetAt.toISOString())
        .single()

      if (progress && progress.is_completed) {
        continue
      }

      const newProgress = (progress?.current_progress || 0) + amount
      const isCompleted = newProgress >= mission.objective_target

      if (progress) {
        await supabase
          .from("user_mission_progress")
          .update({
            current_progress: newProgress,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", progress.id)
      } else {
        await supabase.from("user_mission_progress").insert({
          user_id: user.id,
          mission_id: mission.id,
          current_progress: newProgress,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          reset_at: resetAt.toISOString(),
        })
      }

      if (isCompleted && !progress?.is_completed) {
        // Acordare recompense
        await supabase
          .from("users")
          .update({
            credits: supabase.raw(`credits + ${mission.reward_credits}`),
          })
          .eq("id", user.id)

        // Salvare istoric
        await supabase.from("completed_missions_history").insert({
          user_id: user.id,
          mission_id: mission.id,
          reward_credits: mission.reward_credits,
          reward_experience: mission.reward_experience,
        })

        completedMissions.push({
          mission_name: mission.mission_name,
          reward_credits: mission.reward_credits,
          reward_experience: mission.reward_experience,
        })
      }
    }

    return NextResponse.json({
      success: true,
      completed: completedMissions,
    })
  } catch (error) {
    console.error("[v0] Error updating mission progress:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
