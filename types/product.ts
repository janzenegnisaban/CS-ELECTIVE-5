export interface Product {
  id: string
  name: string
  description: string
  details?: string
  ingredients?: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  isNew: boolean
  isFeatured: boolean
}
