export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"

// This endpoint is a placeholder for login - actual authentication happens via Supabase client SDK
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields: email, password" }, { status: 400 })
    }

    // The actual authentication is handled by the Supabase client SDK in the browser
    // This endpoint can be used for additional server-side logic if needed
    return NextResponse.json({ success: true, message: "Use Supabase client for authentication" }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 })
  }
}
