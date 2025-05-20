import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "../auth/auth-service"

export async function withAuth(request: NextRequest, handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const payload = await verifyToken(token)

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }

    // Call handler with user
    return await handler(request, payload)
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}

export async function withAdminAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const payload = await verifyToken(token)

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }

    // Check if user is admin
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 })
    }

    // Call handler with user
    return await handler(request, payload)
  } catch (error) {
    console.error("Admin authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
