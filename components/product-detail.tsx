"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, Award, Clock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/types/product"

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const { addItem, isLoading } = useCart()
  const { toast } = useToast()

  // Mock multiple images (in a real app, these would come from the database)
  const productImages = [
    product.image || "/placeholder.svg",
    "/placeholder.svg?height=400&width=400&text=Angle+2",
    "/placeholder.svg?height=400&width=400&text=Angle+3",
    "/placeholder.svg?height=400&width=400&text=Angle+4",
  ]

  const handleAddToCart = () => {
    try {
      addItem(product, quantity)

      // Show confetti animation
      showConfetti()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const showConfetti = () => {
    // Create confetti effect
    const colors = ["#ff77e9", "#ff77ae", "#ff5757", "#7c2ae8", "#4bb4ff"]
    const confettiCount = 100

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div")
      confetti.className = "absolute z-50 block"
      confetti.style.width = "10px"
      confetti.style.height = "10px"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.position = "fixed"
      confetti.style.top = "0"
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.opacity = "1"
      confetti.style.borderRadius = "50%"
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`

      document.body.appendChild(confetti)

      // Animate confetti
      const animation = confetti.animate(
        [
          { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
          {
            transform: `translate(${Math.random() * 200 - 100}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 1500 + Math.random() * 1000,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
      )

      animation.onfinish = () => {
        confetti.remove()
      }
    }

    toast({
      title: "Added to cart!",
      description: `${product.name} (${quantity}) has been added to your cart`,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <motion.div
          className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              <Image
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {product.isNew && (
            <Badge className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 px-3 py-1.5">New</Badge>
          )}
        </motion.div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                selectedImage === index ? "border-primary scale-105" : "border-transparent opacity-70"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.name} view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className="mb-2 bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                {product.name}
              </h1>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setIsLiked(!isLiked)}>
                <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>

              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-2 mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground ml-1">({product.reviews} reviews)</span>
          </div>

          <p className="text-3xl font-bold mb-4 text-primary">₱{product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-3 bg-pink-50 rounded-lg">
              <Award className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm">Premium Quality</span>
            </div>

            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm">Fresh Daily</span>
            </div>

            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <Truck className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm">Fast Delivery</span>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="h-10 w-10 rounded-l-lg rounded-r-none border-r-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="h-10 px-4 flex items-center justify-center border border-input bg-background min-w-[3rem]">
              <span className="font-medium">{quantity}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              className="h-10 w-10 rounded-r-lg rounded-l-none border-l-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="w-full cake-button bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full h-12 text-lg"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="details" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 bg-pink-50/50 rounded-full p-1">
            <TabsTrigger value="details" className="rounded-full data-[state=active]:bg-white">
              Details
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="rounded-full data-[state=active]:bg-white">
              Ingredients
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-full data-[state=active]:bg-white">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="details"
            className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100"
          >
            <p className="leading-relaxed">{product.details || "No details available."}</p>
          </TabsContent>
          <TabsContent
            value="ingredients"
            className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100"
          >
            <p className="leading-relaxed">{product.ingredients || "No ingredients information available."}</p>
          </TabsContent>
          <TabsContent
            value="reviews"
            className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100"
          >
            <p className="leading-relaxed">Customer reviews coming soon.</p>
          </TabsContent>
        </Tabs>
      </motion.div>

      {relatedProducts.length > 0 && (
        <div className="col-span-1 md:col-span-2 mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                <Card className="cake-card h-full hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm border-pink-100">
                  <div className="relative aspect-square">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <CardContent className="p-4 bg-gradient-to-b from-transparent to-pink-50/50">
                    <h3 className="font-semibold truncate">{relatedProduct.name}</h3>
                    <p className="font-bold mt-2 text-primary">₱{relatedProduct.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
