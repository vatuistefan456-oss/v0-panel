import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { key, username, password } = await request.json()

    if (!key || !username || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Find user by unique key and username
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("unique_key", key)
      .eq("username", username)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Create session (simplified - in production use proper session management)
    const response = NextResponse.json(
      { message: "Login successful", user: { id: user.id, username: user.username } },
      { status: 200 },
    )

    // Set session cookie
    response.cookies.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
