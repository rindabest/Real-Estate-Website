"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Square, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import type { Property } from "@/lib/types"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { id, title, location, price, bedrooms, bathrooms, area, type, imageUrl, images } = property
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  // Use the provided images array or create one with the single imageUrl
  const propertyImages = images || [imageUrl]

  // Format price to display in VND
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price)

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1))
    setImageError(false) // Reset error state when changing image
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === propertyImages.length - 1 ? 0 : prev + 1))
    setImageError(false) // Reset error state when changing image
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Link href={`/property/${id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md group">
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-sm">Image not available</span>
            </div>
          ) : (
            <Image
              src={propertyImages[currentImageIndex] || "/placeholder.svg?height=300&width=400&text=No+Image"}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={handleImageError}
            />
          )}

          {/* Image navigation arrows */}
          {propertyImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 rounded-full h-8 w-8 ${
              isFavorite ? "bg-white text-red-500" : "bg-white/80 hover:bg-white"
            }`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>

          {/* Property type badge */}
          <Badge className="absolute bottom-2 left-2 bg-white/80 text-black hover:bg-white/90">{type}</Badge>

          {/* Image counter */}
          {propertyImages.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1}/{propertyImages.length}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="font-bold text-xl text-blue-600">{formattedPrice}</div>
          <h3 className="font-semibold text-lg mt-1 line-clamp-1">{title}</h3>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{area} m²</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

