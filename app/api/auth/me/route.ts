import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/auth-service"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error: any) {
    console.error("Get current user error:", error)
    return NextResponse.json({ error: error.message || "Failed to get current user" }, { status: 500 })
  }
}
