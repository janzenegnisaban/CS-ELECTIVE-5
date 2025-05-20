"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CakeSlice, Gift, Star, ChevronRight } from "lucide-react"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Delicious Handcrafted Cakes",
      description:
        "Indulge in our premium selection of freshly baked cakes and treats, made with the finest ingredients and delivered right to your door.",
      image: "/Delicious Handcrafted Cakes.jpg?height=800&width=800?",
      color: "from-pink-200 to-purple-200",
    },
    {
      title: "Special Occasion Cakes",
      description:
        "Make your celebrations unforgettable with our custom-designed cakes for birthdays, weddings, and special events.",
      image: "/Special Occasion Cakes.jpg?height=800&width=800",
      color: "from-blue-200 to-purple-200",
    },
    {
      title: "Seasonal Favorites",
      description:
        "Try our limited-time seasonal flavors crafted with fresh, local ingredients for a truly unique taste experience.",
      image: "/Seasonal Favorites.jpg?height=800&width=800",
      color: "from-yellow-200 to-orange-200",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative overflow-hidden">
      {/* Background with animated sprinkles */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-purple-50 sprinkles"></div>

      {/* Carousel */}
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center mb-4">
              <CakeSlice className="h-8 w-8 text-primary mr-2" />
              <span className="text-lg font-medium text-primary">QuiCake Bakery</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              {slides[currentSlide].title}
            </h1>

            <p className="text-lg mb-8 text-gray-700">{slides[currentSlide].description}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="cake-button bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full px-8"
              >
                <Link href="/products">
                  Shop Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="cake-button rounded-full border-pink-300 hover:bg-pink-50 px-8"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 border-2 border-white flex items-center justify-center text-white text-xs"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-sm text-gray-600">Loved by 2,000+ happy customers</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            key={`image-${currentSlide}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${slides[currentSlide].color} blur-3xl opacity-60 -z-10 transform -rotate-6`}
            ></div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={slides[currentSlide].image || "/placeholder.svg"}
                alt="Delicious cake"
                fill
                className="object-cover"
                priority
              />

              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full py-2 px-4 flex items-center">
                <Gift className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">Free delivery on orders over ₱50</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 mx-1 rounded-full transition-all ${
                currentSlide === index ? "bg-primary w-8" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="frosting-border"></div>
    </section>
  )
}
