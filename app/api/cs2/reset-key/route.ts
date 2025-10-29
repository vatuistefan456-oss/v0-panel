import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { validateApiKey, checkRateLimit } from "@/lib/api-key-validation"
import crypto from "crypto"

// Reset a player's unique key
export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 })
  }

  try {
    const { steam_id, old_key } = await request.json()

    if (!steam_id || !old_key) {
      return NextResponse.json({ error: "Steam ID and old key are required" }, { status: 400 })
    }

    const rateLimit = checkRateLimit(`reset-key:${steam_id}`, 1, 300000)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait 5 minutes before resetting your key again." },
        { status: 429 },
      )
    }

    const supabase = getSupabaseServerClient()

    // Verify user exists and old key matches
    const { data: user } = await supabase
      .from("users")
      .select("id, unique_key, key_reset_count")
      .eq("steam_id", steam_id)
      .eq("unique_key", old_key)
      .maybeSingle()

    if (!user) {
      return NextResponse.json({ error: "Invalid Steam ID or key" }, { status: 404 })
    }

    // Generate new unique key
    const generateUniqueKey = () => {
      return crypto.randomBytes(16).toString("hex").toUpperCase()
    }

    let newKey = generateUniqueKey()
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const { data: keyExists } = await supabase.from("users").select("id").eq("unique_key", newKey).maybeSingle()

      if (!keyExists) break

      newKey = generateUniqueKey()
      attempts++
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: "Failed to generate unique key" }, { status: 500 })
    }

    // Update user with new key
    const { error: updateError } = await supabase
      .from("users")
      .update({
        unique_key: newKey,
        key_reset_count: (user.key_reset_count || 0) + 1,
        key_created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) throw updateError

    // Log the key reset
    await supabase.from("key_reset_history").insert({
      user_id: user.id,
      old_key: old_key,
      new_key: newKey,
      reset_at: new Date().toISOString(),
      reason: "Player requested key reset",
    })

    return NextResponse.json({
      success: true,
      key: newKey,
      message: "Key reset successfully",
    })
  } catch (error) {
    console.error("[v0] Error resetting key:", error)
    return NextResponse.json({ error: "Failed to reset key" }, { status: 500 })
  }
}
