export interface Property {
  id: string
  title: string
  description?: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  imageUrl: string
  images?: string[]
  features?: string[]
  status?: "for_sale" | "for_rent" | "sold" | "pending"
  yearBuilt?: number
  parkingSpaces?: number
}

