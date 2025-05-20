"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X, SlidersHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export function ProductsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Get current filter values from URL
  const currentCategory = searchParams.get("category") || ""
  const currentMin = searchParams.get("min") || "0"
  const currentMax = searchParams.get("max") || "100"
  const currentSearch = searchParams.get("search") || ""

  // Local state for filter values
  const [category, setCategory] = useState(currentCategory)
  const [priceRange, setPriceRange] = useState([Number.parseFloat(currentMin), Number.parseFloat(currentMax)])
  const [search, setSearch] = useState(currentSearch)

  // Categories (in a real app, these would come from the database)
  const categories = [
    { id: "cakes", name: "Cakes", icon: "🎂" },
    { id: "cupcakes", name: "Cupcakes", icon: "🧁" },
    { id: "cookies", name: "Cookies", icon: "🍪" },
  ]

  const applyFilters = () => {
    startTransition(() => {
      // Create new URLSearchParams
      const params = new URLSearchParams()

      // Add category if selected
      if (category) {
        params.set("category", category)
      }

      // Add price range
      params.set("min", priceRange[0].toString())
      params.set("max", priceRange[1].toString())

      // Add search term
      if (search) {
        params.set("search", search)
      }

      // Preserve sort parameter if it exists
      const sort = searchParams.get("sort")
      if (sort) {
        params.set("sort", sort)
      }

      // Update URL
      router.push(`/products?${params.toString()}`)

      // Close filter on mobile after applying
      if (window.innerWidth < 768) {
        setIsFilterOpen(false)
      }
    })
  }

  const resetFilters = () => {
    startTransition(() => {
      setCategory("")
      setPriceRange([0, 100])
      setSearch("")
      router.push("/products")

      // Close filter on mobile after resetting
      if (window.innerWidth < 768) {
        setIsFilterOpen(false)
      }
    })
  }

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 rounded-full border-pink-200 hover:bg-pink-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      <motion.div
        className={`${isFilterOpen ? "block" : "hidden"} md:block`}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isFilterOpen || window.innerWidth >= 768 ? 1 : 0,
          height: isFilterOpen || window.innerWidth >= 768 ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-pink-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center text-primary">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              disabled={isPending}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" /> Reset
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 rounded-full border-pink-200 focus-visible:ring-pink-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Categories</Label>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      category === cat.id ? "bg-pink-100 text-primary" : "hover:bg-pink-50"
                    }`}
                    onClick={() => setCategory(category === cat.id ? "" : cat.id)}
                  >
                    <Checkbox
                      id={`category-${cat.id}`}
                      checked={category === cat.id}
                      onCheckedChange={() => setCategory(category === cat.id ? "" : cat.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={`category-${cat.id}`}
                      className="cursor-pointer flex items-center text-sm font-medium"
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Price Range</Label>
                <span className="text-sm bg-pink-100 text-primary px-2 py-1 rounded-full">
                  ₱{priceRange[0]} - ₱{priceRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={priceRange}
                min={0}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="[&>span]:bg-primary"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>₱0</span>
                <span>₱50</span>
                <span>₱100</span>
              </div>
            </div>

            <Button
              className="w-full cake-button bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full"
              onClick={applyFilters}
              disabled={isPending}
            >
              {isPending ? "Applying..." : "Apply Filters"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
