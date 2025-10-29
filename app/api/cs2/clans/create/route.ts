import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-key-validation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const validation = await validateApiKey(request)
  if (!validation.valid) {
    return validation.response
  }

  try {
    const { steam_id, clan_name, clan_tag, description } = await request.json()

    if (!steam_id || !clan_name || !clan_tag) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Verificare daca jucatorul exista
    const { data: user, error: userError } = await supabase.from("users").select("id").eq("steam_id", steam_id).single()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Verificare daca jucatorul este deja intr-un clan
    const { data: existingMember } = await supabase.from("clan_members").select("id").eq("user_id", user.id).single()

    if (existingMember) {
      return NextResponse.json({ success: false, error: "Player already in a clan" }, { status: 400 })
    }

    // Creare clan
    const { data: clan, error: clanError } = await supabase
      .from("clans")
      .insert({
        clan_name,
        clan_tag,
        description,
        leader_id: user.id,
      })
      .select()
      .single()

    if (clanError) {
      return NextResponse.json({ success: false, error: clanError.message }, { status: 400 })
    }

    // Adaugare leader ca membru
    await supabase.from("clan_members").insert({
      clan_id: clan.id,
      user_id: user.id,
      role: "leader",
    })

    // Initializare skill-uri clan
    const skills = ["health", "armor", "speed", "gravity", "damage"]
    await supabase.from("clan_skills").insert(
      skills.map((skill) => ({
        clan_id: clan.id,
        skill_type: skill,
        skill_level: 0,
      })),
    )

    return NextResponse.json({
      success: true,
      clan: {
        id: clan.id,
        name: clan.clan_name,
        tag: clan.clan_tag,
      },
    })
  } catch (error) {
    console.error("[v0] Error creating clan:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
