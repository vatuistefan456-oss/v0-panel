import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: cases, error } = await supabase
      .from("cs2_cases")
      .select("*")
      .eq("is_active", true)
      .order("release_date", { ascending: false })

    if (error) throw error

    return NextResponse.json(cases || [])
  } catch (error: any) {
    console.error("[v0] Error fetching cases:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch cases",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
