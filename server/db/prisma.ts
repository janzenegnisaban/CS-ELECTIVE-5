import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Create a new PrismaClient instance with connection retry logic
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Add connection retry logic
    errorFormat: "pretty",
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Enhanced connection validation with retry mechanism
export async function validateDatabaseConnection(retries = 3, delay = 1000) {
  let currentTry = 0

  while (currentTry < retries) {
    try {
      // Test the connection with a simple query
      await prisma.$queryRaw`SELECT 1`
      console.log("✅ Database connection successful")
      return true
    } catch (error) {
      currentTry++
      console.error(`❌ Database connection attempt ${currentTry}/${retries} failed:`, error)

      if (currentTry < retries) {
        console.log(`Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        // Increase delay for next retry (exponential backoff)
        delay *= 2
      }
    }
  }

  console.error("❌ All database connection attempts failed")
  return false
}

// Helper function to handle Prisma operations gracefully with detailed logging
export async function handlePrismaOperation<T>(
  operation: () => Promise<T>,
  operationName = "Database operation",
): Promise<[T | null, Error | null]> {
  try {
    console.log(`🔄 Executing: ${operationName}`)
    const result = await operation()
    console.log(`✅ Success: ${operationName}`)
    return [result, null]
  } catch (error) {
    console.error(`❌ Failed: ${operationName}`, error)
    return [null, error as Error]
  }
}

export default prisma
