import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-key-validation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const apiKeyValidation = await validateApiKey(request)
    if (!apiKeyValidation.valid) {
      return NextResponse.json({ success: false, error: apiKeyValidation.error }, { status: apiKeyValidation.status })
    }

    const supabase = getSupabaseServerClient()

    const { data: missions, error } = await supabase
      .from("missions")
      .select("*")
      .eq("enabled", true)
      .order("period", { ascending: true })
      .order("target", { ascending: true })

    if (error) {
      throw error
    }

    const config = {
      daily: missions?.filter((m) => m.period === "daily") || [],
      weekly: missions?.filter((m) => m.period === "weekly") || [],
      monthly: missions?.filter((m) => m.period === "monthly") || [],
    }

    return NextResponse.json({
      success: true,
      missions: config,
    })
  } catch (error) {
    console.error("[v0] Error fetching config:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch config" }, { status: 500 })
  }
}
