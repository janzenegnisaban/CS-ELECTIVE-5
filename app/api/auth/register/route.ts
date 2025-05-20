import { NextResponse } from "next/server"
import { registerUser } from "@/server/auth/auth-service"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Register user
    const user = await registerUser(email, password, name)

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}
