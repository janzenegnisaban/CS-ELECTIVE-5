import { encrypt, verifyPassword } from "../utils/encryption"
import prisma from "../db/prisma"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// Use the JWT secret from environment variable or fallback to hardcoded value
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "janzenpogi111")

export async function registerUser(email: string, password: string, name: string) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  // Encrypt password
  const encryptedPassword = encrypt(password)

  try {
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: encryptedPassword,
        name,
      },
    })

    // Create empty cart for user
    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user. Please try again.")
  }
}

export async function loginUser(email: string, password: string) {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Verify password
    const isPasswordValid = verifyPassword(user.password, password)

    if (!isPasswordValid) {
      throw new Error("Invalid email or password")
    }

    // Create JWT token
    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name || "",
      role: user.role,
    })

    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function createToken(payload: any) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(JWT_SECRET)
  } catch (error) {
    console.error("Token creation error:", error)
    throw new Error("Authentication failed. Please try again.")
  }
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload
  } catch (error) {
    console.error("Token verification error:", error)
    throw new Error("Invalid token")
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)

    // Get fresh user data
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
    })

    if (!user) {
      return null
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === "ADMIN"
}
