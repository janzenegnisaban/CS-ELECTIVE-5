"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "@/types/product"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  isLoading: boolean
  error: string | null
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  subtotal: 0,
  isLoading: false,
  error: null,
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Fetch cart from API when user is authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (authLoading) return // Wait for auth to finish loading

      if (!isAuthenticated || !user) {
        // Clear cart when user logs out
        setItems([])
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/cart")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch cart")
        }

        const data = await response.json()

        if (data.cart) {
          // Transform cart items to match CartItem interface
          const cartItems = data.cart.items.map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
          }))

          setItems(cartItems)
        }
      } catch (error: any) {
        console.error("Error fetching cart:", error)
        setError(error.message || "Failed to load your cart")
        toast({
          title: "Error",
          description: "Failed to load your cart. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [isAuthenticated, user, authLoading])

  // Calculate subtotal whenever items change
  useEffect(() => {
    const newSubtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
    setSubtotal(newSubtotal)
  }, [items])

  const addItem = async (product: Product, quantity = 1) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add item to cart")
      }

      const data = await response.json()

      // Transform cart items to match CartItem interface
      const cartItems = data.cart.items.map((item: any) => ({
        ...item.product,
        quantity: item.quantity,
      }))

      setItems(cartItems)

      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart`,
      })
    } catch (error: any) {
      console.error("Error adding item to cart:", error)
      setError(error.message || "Failed to add item to cart")
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (productId: string) => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      setError(null)
      // Find the cart item with the product ID
      const cartItem = items.find((item) => item.id === productId)
      if (!cartItem) return

      // Find the cart item ID from the API
      const response = await fetch("/api/cart")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch cart")
      }

      const data = await response.json()

      const apiCartItem = data.cart.items.find((item: any) => item.product.id === productId)
      if (!apiCartItem) return

      // Delete the cart item
      const deleteResponse = await fetch(`/api/cart/${apiCartItem.id}`, {
        method: "DELETE",
      })

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json()
        throw new Error(errorData.error || "Failed to remove item from cart")
      }

      const deleteData = await deleteResponse.json()

      // Transform cart items to match CartItem interface
      const cartItems = deleteData.cart.items.map((item: any) => ({
        ...item.product,
        quantity: item.quantity,
      }))

      setItems(cartItems)

      toast({
        title: "Item removed",
        description: `${cartItem.name} removed from your cart`,
      })
    } catch (error: any) {
      console.error("Error removing item from cart:", error)
      setError(error.message || "Failed to remove item from cart")
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated || quantity < 1) return

    try {
      setIsLoading(true)
      setError(null)
      // Find the cart item with the product ID
      const cartItem = items.find((item) => item.id === productId)
      if (!cartItem) return

      // Find the cart item ID from the API
      const response = await fetch("/api/cart")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch cart")
      }

      const data = await response.json()

      const apiCartItem = data.cart.items.find((item: any) => item.product.id === productId)
      if (!apiCartItem) return

      // Update the cart item
      const updateResponse = await fetch(`/api/cart/${apiCartItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
        }),
      })

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json()
        throw new Error(errorData.error || "Failed to update item quantity")
      }

      const updateData = await updateResponse.json()

      // Transform cart items to match CartItem interface
      const cartItems = updateData.cart.items.map((item: any) => ({
        ...item.product,
        quantity: item.quantity,
      }))

      setItems(cartItems)
    } catch (error: any) {
      console.error("Error updating item quantity:", error)
      setError(error.message || "Failed to update item quantity")
      toast({
        title: "Error",
        description: error.message || "Failed to update item quantity",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, isLoading, error }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
