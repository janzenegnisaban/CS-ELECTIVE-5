import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/server/middleware/auth-middleware"
import prisma from "@/server/db/prisma"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // Get user's cart
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      if (!cart) {
        // Create cart if it doesn't exist
        const newCart = await prisma.cart.create({
          data: {
            userId: user.id,
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        })

        return NextResponse.json({ cart: newCart }, { status: 200 })
      }

      return NextResponse.json({ cart }, { status: 200 })
    } catch (error: any) {
      console.error("Error fetching cart:", error)
      return NextResponse.json({ error: error.message || "Failed to fetch cart" }, { status: 500 })
    }
  })
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const { productId, quantity } = await req.json()

      // Validate input
      if (!productId || !quantity || quantity < 1) {
        return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 })
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      // Get user's cart
      let cart = await prisma.cart.findUnique({
        where: { userId: user.id },
      })

      // Create cart if it doesn't exist
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: user.id,
          },
        })
      }

      // Check if product exists in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      })

      if (existingItem) {
        // Update quantity
        await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        })
      } else {
        // Add new item
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        })
      }

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
      console.error("Error adding item to cart:", error)
      return NextResponse.json({ error: error.message || "Failed to add item to cart" }, { status: 500 })
    }
  })
}
