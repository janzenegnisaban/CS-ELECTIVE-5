// This script tests the database connection
// Run with: node scripts/test-db-connection.js

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log("Testing database connection...")

    // Test the connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`

    console.log("✅ Database connection successful!")
    console.log("Result:", result)

    // Try to get user count
    const userCount = await prisma.user.count()
    console.log(`✅ User count: ${userCount}`)

    // Try to get product count
    const productCount = await prisma.product.count()
    console.log(`✅ Product count: ${productCount}`)

    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
  .then((success) => {
    if (success) {
      console.log("Database connection test completed successfully.")
    } else {
      console.error("Database connection test failed.")
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error("Unexpected error during database test:", error)
    process.exit(1)
  })
