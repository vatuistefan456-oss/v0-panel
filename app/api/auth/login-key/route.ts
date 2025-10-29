import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { uniqueKey, username, password } = await request.json()

    if (!uniqueKey || !username || !password) {
      return NextResponse.json({ error: "Toate câmpurile sunt obligatorii" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Find user by unique key
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("unique_key", uniqueKey.toUpperCase())
      .maybeSingle()

    if (fetchError) throw fetchError

    if (!user) {
      return NextResponse.json({ error: "Cheie invalidă. Verifică cheia și încearcă din nou." }, { status: 404 })
    }

    // Check if this is first login (no username/password set)
    if (!user.username || !user.password_hash) {
      // First login - set username and password
      const hashedPassword = await bcrypt.hash(password, 10)

      const { error: updateError } = await supabase
        .from("users")
        .update({
          username,
          password_hash: hashedPassword,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Set session cookie
      const cookieStore = await cookies()
      cookieStore.set("session", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return NextResponse.json({
        success: true,
        message: "Cont creat cu succes!",
        firstLogin: true,
      })
    }

    // Existing user - verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Parolă incorectă" }, { status: 401 })
    }

    // Verify username matches
    if (user.username !== username) {
      return NextResponse.json({ error: "Nume de utilizator incorect" }, { status: 401 })
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      message: "Autentificare reușită!",
      firstLogin: false,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "A apărut o eroare la autentificare" }, { status: 500 })
  }
}
