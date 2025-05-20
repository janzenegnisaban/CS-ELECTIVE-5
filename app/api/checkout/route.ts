import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/server/middleware/auth-middleware"
import prisma from "@/server/db/prisma"

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const { shippingInfo, paymentMethod } = await req.json()

      // Validate required fields
      if (!shippingInfo || !paymentMethod) {
        return NextResponse.json({ error: "Shipping information and payment method are required" }, { status: 400 })
      }

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

      if (!cart || cart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
      }

      // Calculate total
      const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const shipping = subtotal > 50 ? 0 : 10
      const tax = subtotal * 0.08
      const orderTotal = subtotal + shipping + tax

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          total: orderTotal,
          shippingInfo,
          paymentMethod,
          status: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: true,
        },
      })

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      })

      return NextResponse.json({ success: true, order }, { status: 201 })
    } catch (error: any) {
      console.error("Checkout error:", error)
      return NextResponse.json({ error: error.message || "Failed to process checkout" }, { status: 500 })
    }
  })
}
