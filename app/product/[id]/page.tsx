import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product-detail"
import prisma from "@/server/db/prisma"

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      notFound()
    }

    // Get related products (same category, excluding current product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: {
          not: product.id,
        },
      },
      take: 4,
    })

    return (
      <main className="container mx-auto px-4 py-12">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
    )
  } catch (error) {
    console.error("Error fetching product:", error)
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error Loading Product</h1>
          <p className="text-muted-foreground mt-2">There was an error loading this product. Please try again later.</p>
        </div>
      </main>
    )
  }
}
