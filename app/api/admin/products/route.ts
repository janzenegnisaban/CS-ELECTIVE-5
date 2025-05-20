import { NextResponse } from "next/server"
import { withAdminAuth } from "@/server/middleware/auth-middleware"
import prisma from "@/server/db/prisma"

// Create a new product
export async function POST(request: Request) {
  return withAdminAuth(request, async (req, user) => {
    try {
      const data = await req.json()

      // Validate required fields
      if (!data.name || !data.description || !data.price || !data.category) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      // Create product
      const product = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          details: data.details || null,
          ingredients: data.ingredients || null,
          price: Number(data.price),
          image: data.image || "/placeholder.svg?height=400&width=400",
          category: data.category,
          rating: Number(data.rating) || 0,
          reviews: Number(data.reviews) || 0,
          isNew: Boolean(data.isNew),
          isFeatured: Boolean(data.isFeatured),
        },
      })

      return NextResponse.json({ success: true, product }, { status: 201 })
    } catch (error: any) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 })
    }
  })
}

// Get all products (admin view)
export async function GET(request: Request) {
  return withAdminAuth(request, async (req, user) => {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json({ products }, { status: 200 })
    } catch (error: any) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 })
    }
  })
}
