import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/server/middleware/auth-middleware"
import prisma from "@/server/db/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user) => {
    try {
      const { quantity } = await req.json()
      const itemId = params.id

      // Validate input
      if (!quantity || quantity < 1) {
        return NextResponse.json({ error: "Quantity is required and must be at least 1" }, { status: 400 })
      }

      // Get user's cart
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: true },
      })

      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 })
      }

      // Check if item exists in cart
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: itemId,
          cartId: cart.id,
        },
      })

      if (!cartItem) {
        return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
      }

      // Update quantity
      await prisma.cartItem.update({
        where: {
          id: itemId,
        },
        data: {
          quantity,
        },
      })

      // Get updated cart
      const updatedCart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return NextResponse.json({ cart: updatedCart }, { status: 200 })
    } catch (error: any) {
      console.error("Error updating cart item:", error)
      return NextResponse.json({ error: error.message || "Failed to update cart item" }, { status: 500 })
    }
  })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user) => {
    try {
      const itemId = params.id

      // Get user's cart
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: true },
      })

      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 })
      }

      // Check if item exists in cart
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: itemId,
          cartId: cart.id,
        },
      })

      if (!cartItem) {
        return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
      }

      // Delete item
      await prisma.cartItem.delete({
        where: {
          id: itemId,
        },
      })

      // Get updated cart
      const updatedCart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return NextResponse.json({ cart: updatedCart }, { status: 200 })
    } catch (error: any) {
      console.error("Error deleting cart item:", error)
      return NextResponse.json({ error: error.message || "Failed to delete cart item" }, { status: 500 })
    }
  })
}
