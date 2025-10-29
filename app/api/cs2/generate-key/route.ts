import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { validateApiKey, checkRateLimit } from "@/lib/api-key-validation"
import crypto from "crypto"

// Generate a unique key for a player
export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 })
  }

  try {
    const { steam_id, steam_name, steam_avatar_url } = await request.json()

    if (!steam_id) {
      return NextResponse.json({ error: "Steam ID is required" }, { status: 400 })
    }

    const rateLimit = checkRateLimit(`generate-key:${steam_id}`, 1, 60000)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before requesting a new key." },
        { status: 429 },
      )
    }

    const supabase = getSupabaseServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("unique_key, steam_id")
      .eq("steam_id", steam_id)
      .maybeSingle()

    if (existingUser?.unique_key) {
      // User already has a key
      return NextResponse.json({
        success: true,
        key: existingUser.unique_key,
        message: "Key already exists",
      })
    }

    // Generate unique key (32 characters, alphanumeric)
    const generateUniqueKey = () => {
      return crypto.randomBytes(16).toString("hex").toUpperCase()
    }

    let uniqueKey = generateUniqueKey()
    let attempts = 0
    const maxAttempts = 10

    // Ensure key is truly unique
    while (attempts < maxAttempts) {
      const { data: keyExists } = await supabase.from("users").select("id").eq("unique_key", uniqueKey).maybeSingle()

      if (!keyExists) break

      uniqueKey = generateUniqueKey()
      attempts++
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: "Failed to generate unique key" }, { status: 500 })
    }

    // Create or update user with the key
    if (existingUser) {
      // Update existing user
      const { error } = await supabase
        .from("users")
        .update({
          unique_key: uniqueKey,
          steam_name,
          steam_avatar_url,
          key_created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("steam_id", steam_id)

      if (error) throw error
    } else {
      // Create new user
      const { error } = await supabase.from("users").insert({
        steam_id,
        steam_name,
        steam_avatar_url,
        unique_key: uniqueKey,
        key_created_at: new Date().toISOString(),
        credits: 0,
        real_money_balance: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
    }

    return NextResponse.json({
      success: true,
      key: uniqueKey,
      message: "Key generated successfully",
    })
  } catch (error) {
    console.error("[v0] Error generating key:", error)
    return NextResponse.json({ error: "Failed to generate key" }, { status: 500 })
  }
}
