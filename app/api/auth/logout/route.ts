import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear token cookie
    cookies().delete("token")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: error.message || "Logout failed" }, { status: 500 })
  }
}
