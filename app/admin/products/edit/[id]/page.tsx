import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import prisma from "@/server/db/prisma"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  // Fetch product data
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}
