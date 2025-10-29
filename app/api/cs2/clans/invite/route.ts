import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-key-validation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const validation = await validateApiKey(request)
  if (!validation.valid) {
    return validation.response
  }

  try {
    const { inviter_steam_id, invited_steam_id } = await request.json()

    if (!inviter_steam_id || !invited_steam_id) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Gasire inviter si clan
    const { data: inviter } = await supabase.from("users").select("id").eq("steam_id", inviter_steam_id).single()

    if (!inviter) {
      return NextResponse.json({ success: false, error: "Inviter not found" }, { status: 404 })
    }

    const { data: inviterMember } = await supabase
      .from("clan_members")
      .select("clan_id, role")
      .eq("user_id", inviter.id)
      .single()

    if (!inviterMember || (inviterMember.role !== "leader" && inviterMember.role !== "officer")) {
      return NextResponse.json({ success: false, error: "No permission to invite" }, { status: 403 })
    }

    // Gasire invited user
    const { data: invited } = await supabase.from("users").select("id").eq("steam_id", invited_steam_id).single()

    if (!invited) {
      return NextResponse.json({ success: false, error: "Invited user not found" }, { status: 404 })
    }

    // Verificare daca invited user este deja intr-un clan
    const { data: existingMember } = await supabase.from("clan_members").select("id").eq("user_id", invited.id).single()

    if (existingMember) {
      return NextResponse.json({ success: false, error: "Player already in a clan" }, { status: 400 })
    }

    // Creare invitatie
    const { error: inviteError } = await supabase.from("clan_invites").insert({
      clan_id: inviterMember.clan_id,
      invited_user_id: invited.id,
      invited_by_id: inviter.id,
    })

    if (inviteError) {
      return NextResponse.json({ success: false, error: inviteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error creating invite:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
