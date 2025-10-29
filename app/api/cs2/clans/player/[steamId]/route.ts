import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest, { params }: { params: { steamId: string } }) {
  try {
    const supabase = createServerClient()
    const { steamId } = params

    // Get user
    const { data: user } = await supabase.from("users").select("id").eq("steam_id", steamId).single()

    if (!user) {
      return NextResponse.json({ hasClan: false })
    }

    // Get clan membership
    const { data: membership } = await supabase
      .from("clan_members")
      .select(`
        role,
        contribution_credits,
        joined_at,
        clans (
          id,
          clan_name,
          clan_tag,
          description,
          level,
          experience,
          clan_credits,
          max_members
        )
      `)
      .eq("user_id", user.id)
      .single()

    if (!membership || !membership.clans) {
      return NextResponse.json({ hasClan: false })
    }

    const clan = membership.clans

    // Get all clan members
    const { data: members } = await supabase
      .from("clan_members")
      .select(`
        role,
        contribution_credits,
        joined_at,
        users (
          steam_id,
          steam_name,
          updated_at
        )
      `)
      .eq("clan_id", clan.id)

    // Get clan missions progress
    const { count: completedMissions } = await supabase
      .from("user_mission_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_completed", true)

    const { count: totalMissions } = await supabase
      .from("missions")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    return NextResponse.json({
      hasClan: true,
      clanName: clan.clan_name,
      clanTag: clan.clan_tag,
      description: clan.description || "",
      level: clan.level || 1,
      experience: clan.experience || 0,
      nextLevelXP: (clan.level || 1) * 1000,
      clanPoints: Math.floor((clan.clan_credits || 0) / 1000),
      memberCount: members?.length || 0,
      maxMembers: clan.max_members || 10,
      completedMissions: completedMissions || 0,
      totalMissions: totalMissions || 114,
      role: membership.role,
      members:
        members?.map((m) => ({
          name: m.users?.steam_name || "Unknown",
          steamId: m.users?.steam_id || "",
          role: m.role,
          shopPoints: Math.floor((m.contribution_credits || 0) / 1000),
          currentMission: "AWP Killer",
          joinedAt: m.joined_at,
          lastConnected: m.users?.updated_at || new Date(),
        })) || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching clan data:", error)
    return NextResponse.json({ error: "Failed to fetch clan data" }, { status: 500 })
  }
}
