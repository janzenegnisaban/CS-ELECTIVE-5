"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [likedProducts, setLikedProducts] = useState<string[]>([])

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    )
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      addItem(product, 1)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleLike = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()

    setLikedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <Link
            href={`/product/${product.id}`}
            className="group block"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <Card className="cake-card overflow-hidden h-full bg-white/80 backdrop-blur-sm border-pink-100">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Quick action buttons */}
                <div
                  className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
                    onClick={(e) => toggleLike(e, product.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${likedProducts.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>

                  <Button
                    size="icon"
                    className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shadow-md"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </Button>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-xs font-medium">New</Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-purple-500 hover:bg-purple-600 px-2 py-1 text-xs font-medium">Featured</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4 bg-gradient-to-b from-transparent to-pink-50/50">
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 h-10 mt-1">{product.description}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1 font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <span className="font-bold text-lg text-primary">₱{product.price.toFixed(2)}</span>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 border-pink-200"
                >
                  {product.category}
                </Badge>
              </CardFooter>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
