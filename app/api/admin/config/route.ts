import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), "CS2Plugin", "config.json")
    const configFile = await fs.readFile(configPath, "utf-8")
    const config = JSON.parse(configFile)

    return NextResponse.json({
      success: true,
      config,
    })
  } catch (error) {
    console.error("[v0] Error reading config:", error)
    return NextResponse.json({ success: false, error: "Failed to read config" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    const configPath = path.join(process.cwd(), "CS2Plugin", "config.json")
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8")

    const supabase = getSupabaseServerClient()

    // Sync missions
    if (config.Missions) {
      for (const period of ["Daily", "Weekly", "Monthly"]) {
        for (const mission of config.Missions[period]) {
          if (!mission.enabled) continue

          await supabase.from("missions").upsert(
            {
              mission_id: mission.id,
              name: mission.name,
              description: mission.description,
              type: mission.type,
              period: period.toLowerCase(),
              weapon: mission.weapon || null,
              target: mission.target,
              credits_reward: mission.credits_reward,
              xp_reward: mission.xp_reward,
              enabled: mission.enabled,
            },
            { onConflict: "mission_id" },
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Config saved and synced successfully",
    })
  } catch (error) {
    console.error("[v0] Error saving config:", error)
    return NextResponse.json({ success: false, error: "Failed to save config" }, { status: 500 })
  }
}
