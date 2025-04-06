"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { properties } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { UserNav } from "@/components/user-nav"

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string
  const { isAuthenticated } = useAuth()

  // Find the property in our mock data
  const property = properties.find((p) => p.id === propertyId)

  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // If property not found, show error
  if (!property) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <Link href="/">
          <Button>Quay lại trang chủ</Button>
        </Link>
      </div>
    )
  }

  // Use the provided images array or create one with the single imageUrl
  const propertyImages = property.images || [property.imageUrl]

  // Format price to display in millions (VND)
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(property.price)

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === propertyImages.length - 1 ? 0 : prev + 1))
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#006aff]">REMS</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium hover:text-[#006aff]">
                Home
              </Link>
              <Link href="/search?type=buy" className="text-sm font-medium hover:text-[#006aff]">
                Buy
              </Link>
              <Link href="/search?type=sell" className="text-sm font-medium hover:text-[#006aff]">
                Sell
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <UserNav />
              ) : (
                <>
                  <Link href="/login" className="hidden md:block">
                    <Button
                      variant="outline"
                      className="border-[#006aff] text-[#006aff] hover:bg-[#006aff] hover:text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden md:block">
                    <Button className="bg-[#006aff] hover:bg-[#0051c3]">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Link href="/search" className="inline-flex items-center text-[#006aff] hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative rounded-xl overflow-hidden mb-6">
              <div className="relative aspect-[16/9]">
                <Image
                  src={propertyImages[currentImageIndex] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />

                {/* Image navigation arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-10 w-10"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-10 w-10"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1}/{propertyImages.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
              {propertyImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer border-2 ${
                    index === currentImageIndex ? "border-[#006aff]" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image src={img || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  {property.status === "for_rent" ? "Cho thuê" : "Đang bán"}
                </Badge>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full ${isFavorite ? "text-red-500" : ""}`}
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}</span>
              </div>

              <div className="text-3xl font-bold text-[#006aff] mb-6">{formattedPrice}</div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 mb-1 text-gray-500" />
                  <span className="font-semibold">{property.bedrooms}</span>
                  <span className="text-xs text-muted-foreground">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 mb-1 text-gray-500" />
                  <span className="font-semibold">{property.bathrooms}</span>
                  <span className="text-xs text-muted-foreground">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 mb-1 text-gray-500" />
                  <span className="font-semibold">{property.area} m²</span>
                  <span className="text-xs text-muted-foreground">Area</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Car className="h-6 w-6 mb-1 text-gray-500" />
                  <span className="font-semibold">{property.parkingSpaces || 0}</span>
                  <span className="text-xs text-muted-foreground">Parking spaces</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line mb-6">{property.description}</p>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-bold mb-4">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-[#006aff]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.yearBuilt && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-bold mb-4">Additional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">Year built: </span>
                      <span className="ml-1 font-medium">{property.yearBuilt}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="mr-2">{property.type}</Badge>
                      <span className="text-muted-foreground">Property type</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=400&width=800&text=Location+Map"
                  alt="Location map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button className="bg-[#006aff] hover:bg-[#0051c3]">View on map</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Contact Form */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Contact seller</h3>
                  <div className="space-y-4">
                    <Button className="w-full bg-[#006aff] hover:bg-[#0051c3]">Call</Button>
                    <Button variant="outline" className="w-full">
                      Send message
                    </Button>
                    <Button variant="outline" className="w-full">
                      Schedule viewing
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Properties */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Similar properties</h3>
                  <div className="space-y-4">
                    {properties
                      .filter((p) => p.id !== property.id && p.type === property.type)
                      .slice(0, 3)
                      .map((similarProperty) => (
                        <Link href={`/property/${similarProperty.id}`} key={similarProperty.id}>
                          <div className="flex gap-3 group">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={similarProperty.imageUrl || "/placeholder.svg"}
                                alt={similarProperty.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm line-clamp-2 group-hover:text-[#006aff]">
                                {similarProperty.title}
                              </p>
                              <p className="text-[#006aff] font-bold text-sm">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                  maximumFractionDigits: 0,
                                }).format(similarProperty.price)}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Bed className="h-3 w-3 mr-1" />
                                <span>{similarProperty.bedrooms}</span>
                                <Bath className="h-3 w-3 mx-1" />
                                <span>{similarProperty.bathrooms}</span>
                                <Square className="h-3 w-3 mx-1" />
                                <span>{similarProperty.area} m²</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                  <Button variant="link" className="w-full mt-2 text-[#006aff]">
                    View more similar properties
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t py-3 px-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-[#006aff]">{formattedPrice}</div>
            <div className="text-xs text-muted-foreground">{property.location}</div>
          </div>
          <Button className="bg-[#006aff] hover:bg-[#0051c3]">Contact now</Button>
        </div>
      </div>
    </div>
  )
}

