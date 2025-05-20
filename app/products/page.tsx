import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductsFilter } from "@/components/products-filter"
import { ProductsSkeleton } from "@/components/products-skeleton"
import prisma from "@/server/db/prisma"

interface ProductsPageProps {
  searchParams: {
    category?: string
    sort?: string
    min?: string
    max?: string
    search?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ProductsFilter />
        </div>
        <div className="md:col-span-3">
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

async function ProductsList({ searchParams }: ProductsPageProps) {
  const { category, sort, min, max, search } = searchParams

  // Build where clause for filtering
  const where: any = {}

  // Filter by category
  if (category) {
    where.category = category
  }

  // Filter by price range
  if (min || max) {
    where.price = {}
    if (min) where.price.gte = Number.parseFloat(min)
    if (max) where.price.lte = Number.parseFloat(max)
  }

  // Filter by search term
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  // Build orderBy for sorting
  let orderBy: any = { createdAt: "desc" }
  if (sort) {
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" }
        break
      case "price-desc":
        orderBy = { price: "desc" }
        break
      case "name-asc":
        orderBy = { name: "asc" }
        break
      case "name-desc":
        orderBy = { name: "desc" }
        break
      case "rating-desc":
        orderBy = { rating: "desc" }
        break
    }
  }

  try {
    // Fetch products with filters and sorting
    const products = await prisma.product.findMany({
      where,
      orderBy,
    })

    // Get unique categories for filter
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    })

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{products.length}</span> products
          </p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error fetching products:", error)
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-600 mb-2">Error loading products</h3>
        <p className="text-muted-foreground">There was an error loading the products. Please try again later.</p>
      </div>
    )
  }
}
