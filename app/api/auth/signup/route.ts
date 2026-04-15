export const dynamic = "force-dynamic"

import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    const { email, password, username } = await request.json()

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Missing required fields: email, password, username" }, { status: 400 })
    }

    // Create admin client with service role key (can manage users)
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      // Insert profile for the new user
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: data.user.id,
        username,
        display_name: username,
      })

      if (profileError) {
        console.error("[v0] Profile insert error:", profileError)
        throw new Error(`Failed to create user profile: ${profileError.message}`)
      }
    }

    return NextResponse.json({ user: data.user, success: true }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 })
  }
}
