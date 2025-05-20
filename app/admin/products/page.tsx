import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductsTable } from "@/components/admin/products-table"
import prisma from "@/server/db/prisma"

export default async function AdminProductsPage() {
  // Fetch all products
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
