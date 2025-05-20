import { NextResponse } from "next/server"
import { validateDatabaseConnection } from "@/server/db/prisma"

export async function GET() {
  try {
    // Check database connection with retry mechanism
    const isConnected = await validateDatabaseConnection(3, 1000)

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed after multiple attempts",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Return detailed health information
    return NextResponse.json(
      {
        status: "ok",
        message: "System is healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || "1.0.0",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
