import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { encrypt } from "@/server/utils/encryption"

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log("Starting database seeding...")

    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: "admin@sweetdelights.com" },
      update: {},
      create: {
        email: "admin@sweetdelights.com",
        name: "Admin User",
        password: encrypt("admin123"),
        role: "ADMIN",
      },
    })
    console.log(`Created/updated admin user: ${admin.email}`)

    // Create regular user
    const user = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        email: "user@example.com",
        name: "Test User",
        password: encrypt("password123"),
        role: "USER",
      },
    })
    console.log(`Created/updated regular user: ${user.email}`)

    // Create products
    const products = [
      {
        id: "cake-1",
        name: "Chocolate Fudge Cake",
        category: "cakes",
        price: 42.99,
        image: "/placeholder.svg?height=400&width=400",
        description:
          "Rich, moist chocolate cake layered with decadent fudge frosting. Perfect for chocolate lovers and special celebrations.",
        details:
          "Our signature chocolate fudge cake is made with premium cocoa and topped with silky smooth chocolate ganache. Each cake serves 8-10 people and stays fresh for up to 3 days when refrigerated.",
        ingredients:
          "Premium cocoa powder, flour, sugar, eggs, butter, vanilla extract, baking powder, salt, heavy cream, dark chocolate.",
        rating: 4.9,
        reviews: 124,
        isNew: false,
        isFeatured: true,
      },
      {
        id: "cake-2",
        name: "Vanilla Bean Celebration Cake",
        category: "cakes",
        price: 38.99,
        image: "/placeholder.svg?height=400&width=400",
        description:
          "Light and fluffy vanilla cake with real vanilla bean specks, layered with smooth buttercream frosting.",
        details:
          "Our vanilla bean cake is perfect for any celebration. Made with real vanilla beans for authentic flavor and decorated with elegant buttercream. Each cake serves 8-10 people.",
        ingredients: "Flour, sugar, butter, eggs, vanilla beans, milk, baking powder, salt, powdered sugar.",
        rating: 4.8,
        reviews: 86,
        isNew: false,
        isFeatured: true,
      },
      {
        id: "cake-3",
        name: "Red Velvet Dream",
        category: "cakes",
        price: 45.99,
        image: "/placeholder.svg?height=400&width=400",
        description:
          "Classic red velvet cake with a hint of cocoa, topped with cream cheese frosting and elegant decorations.",
        details:
          "Our red velvet cake features a beautiful crimson color and subtle chocolate flavor, complemented perfectly by tangy cream cheese frosting. Each cake serves 8-10 people.",
        ingredients:
          "Flour, sugar, cocoa powder, red food coloring, buttermilk, eggs, butter, vanilla extract, cream cheese, powdered sugar.",
        rating: 4.7,
        reviews: 92,
        isNew: true,
        isFeatured: true,
      },
      {
        id: "cookie-1",
        name: "Chocolate Chip Cookies",
        category: "cookies",
        price: 12.99,
        image: "/placeholder.svg?height=400&width=400",
        description: "Classic chocolate chip cookies with a perfect balance of crispy edges and chewy centers.",
        details:
          "Our chocolate chip cookies are made with premium chocolate chunks and a hint of sea salt. Each order includes a dozen cookies.",
        ingredients:
          "Flour, butter, brown sugar, white sugar, eggs, vanilla extract, chocolate chips, baking soda, salt.",
        rating: 4.9,
        reviews: 156,
        isNew: false,
        isFeatured: true,
      },
      {
        id: "cupcake-1",
        name: "Vanilla Cupcakes",
        category: "cupcakes",
        price: 18.99,
        image: "/placeholder.svg?height=400&width=400",
        description: "Light and fluffy vanilla cupcakes topped with colorful buttercream frosting.",
        details:
          "Our vanilla cupcakes are perfect for any occasion, featuring moist vanilla cake and creamy buttercream frosting. Each order includes 6 cupcakes.",
        ingredients: "Flour, sugar, butter, eggs, vanilla extract, milk, baking powder, salt, powdered sugar.",
        rating: 4.7,
        reviews: 112,
        isNew: false,
        isFeatured: true,
      },
    ]

    for (const product of products) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: product,
      })
      console.log(`Created/updated product: ${product.name}`)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Database seeded successfully!",
        data: {
          adminUser: admin.email,
          regularUser: user.email,
          productsCount: products.length,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed database",
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
