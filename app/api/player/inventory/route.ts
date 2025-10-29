import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get player inventory
    const { data: inventory, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("steam_id", user.id)
      .order("acquired_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(inventory || [])
  } catch (error: any) {
    console.error("[v0] Error fetching inventory:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch inventory",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
