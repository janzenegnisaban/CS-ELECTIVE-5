import { ProductGrid } from "@/components/product-grid"
import { HeroSection } from "@/components/hero-section"
import prisma from "@/server/db/prisma"

export default async function Home() {
  try {
    // Fetch featured products from the database
    const featuredProducts = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      take: 6,
    })

    // Fetch new products from the database
    const newProducts = await prisma.product.findMany({
      where: {
        isNew: true,
      },
      take: 4,
    })

    return (
      <main className="flex-1">
        <HeroSection />

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          <ProductGrid products={featuredProducts} />
        </section>

        {newProducts.length > 0 && (
          <section className="container mx-auto px-4 py-12 bg-gray-50">
            <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
            <ProductGrid products={newProducts} />
          </section>
        )}
      </main>
    )
  } catch (error) {
    console.error("Error fetching products:", error)
    return (
      <main className="flex-1">
        <HeroSection />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Products</h2>
          <p className="mt-4">There was an error loading products. Please try again later.</p>
        </div>
      </main>
    )
  }
}
