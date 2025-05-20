import { NextResponse } from "next/server"
import { withAdminAuth } from "@/server/middleware/auth-middleware"
import prisma from "@/server/db/prisma"

// Get a single product
export async function GET(request: Request, { params }: { params: { id: string } }) {
  return withAdminAuth(request, async (req, user) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: params.id },
      })

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      return NextResponse.json({ product }, { status: 200 })
    } catch (error: any) {
      console.error("Error fetching product:", error)
      return NextResponse.json({ error: error.message || "Failed to fetch product" }, { status: 500 })
    }
  })
}

// Update a product
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return withAdminAuth(request, async (req, user) => {
    try {
      const data = await req.json()

      // Validate required fields
      if (!data.name || !data.description || !data.price || !data.category) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: params.id },
      })

      if (!existingProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      // Update product
      const product = await prisma.product.update({
        where: { id: params.id },
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

      return NextResponse.json({ success: true, product }, { status: 200 })
    } catch (error: any) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 })
    }
  })
}

// Delete a product
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return withAdminAuth(request, async (req, user) => {
    try {
      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: params.id },
      })

      if (!existingProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      // Check if product is used in any cart or order
      const cartItems = await prisma.cartItem.findMany({
        where: { productId: params.id },
      })

      const orderItems = await prisma.orderItem.findMany({
        where: { productId: params.id },
      })

      if (cartItems.length > 0 || orderItems.length > 0) {
        return NextResponse.json(
          {
            error: "Cannot delete product that is in use",
            inCart: cartItems.length > 0,
            inOrders: orderItems.length > 0,
          },
          { status: 400 },
        )
      }

      // Delete product
      await prisma.product.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 })
    } catch (error: any) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 })
    }
  })
}
