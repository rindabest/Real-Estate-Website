"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PropertyCard } from "@/components/property-card"
import { useSearch } from "@/lib/search-context"
import { useAuth } from "@/lib/auth-context"
import { UserNav } from "@/components/user-nav"
import { Grid, List, Search, Heart, MapPin, X, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams, useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export function SearchContent() {
  const { filteredProperties, searchFilters, updateFilters, resetFilters } = useSearch()
  const { isAuthenticated } = useAuth()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("default")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [bedrooms, setBedrooms] = useState("any")
  const [bathrooms, setBathrooms] = useState("any")
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("buy")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000000000])
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Get search parameters from URL
    const query = searchParams.get("query") || ""
    const type = searchParams.get("type") || "buy"

    setSearchQuery(query)
    setActiveTab(type)

    // Update filters based on URL parameters
    const filters: any = {}
    if (query) filters.searchQuery = query
    if (type === "buy") filters.status = "for_sale"
    if (type === "rent") filters.status = "for_rent"

    updateFilters(filters)
  }, [searchParams, updateFilters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ searchQuery })
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
  }

  const handlePropertyTypeChange = (type: string) => {
    setPropertyTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const handleApplyFilters = () => {
    const filters: any = {}

    if (searchQuery) filters.searchQuery = searchQuery
    if (priceRange[0] !== 0 || priceRange[1] !== 30000000000) {
      filters.priceRange = priceRange
    }
    if (bedrooms !== "any") filters.bedrooms = bedrooms
    if (bathrooms !== "any") filters.bathrooms = bathrooms
    if (propertyTypes.length > 0) filters.homeType = propertyTypes
    if (activeTab === "buy") filters.status = "for_sale"
    if (activeTab === "rent") filters.status = "for_rent"

    updateFilters(filters)
    setShowFilterOptions(true)
  }

  const handleResetFilters = () => {
    setPriceRange([0, 30000000000])
    setBedrooms("any")
    setBathrooms("any")
    setPropertyTypes([])
    resetFilters()
    setShowFilterOptions(false)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    const filters: any = {}

    if (tab === "buy") filters.status = "for_sale"
    if (tab === "rent") filters.status = "for_rent"

    updateFilters(filters)
    router.push(`/search?type=${tab}${searchQuery ? `&query=${searchQuery}` : ""}`)
  }

  // Sort results based on selected option
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "newest":
        return (b.yearBuilt || 0) - (a.yearBuilt || 0)
      default:
        return 0
    }
  })

  // Format price for display (in billions VND)
  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ`
    }
    return `${(price / 1000000).toFixed(0)} triệu`
  }

  // Generate filter options based on current filters
  const filterOptions = useMemo(() => {
    // Get unique locations from filtered properties
    const locations = Array.from(new Set(filteredProperties.map((p) => p.location.split(",")[0].trim()))).slice(0, 5) // Limit to 5 locations

    // Get unique property types from filtered properties
    const types = Array.from(new Set(filteredProperties.map((p) => p.type))).slice(0, 5) // Limit to 5 types

    // Get price ranges
    const prices = [
      { label: "Dưới 2 tỷ", value: [0, 2000000000] },
      { label: "2 - 5 tỷ", value: [2000000000, 5000000000] },
      { label: "5 - 10 tỷ", value: [5000000000, 10000000000] },
      { label: "Trên 10 tỷ", value: [10000000000, 30000000000] },
    ]

    // Get bedroom options
    const bedroomOptions = [
      { label: "1+ phòng ngủ", value: "1" },
      { label: "2+ phòng ngủ", value: "2" },
      { label: "3+ phòng ngủ", value: "3" },
      { label: "4+ phòng ngủ", value: "4" },
    ]

    return { locations, types, prices, bedroomOptions }
  }, [filteredProperties])

  // Apply a specific filter option
  const applyFilterOption = (type: string, value: any) => {
    switch (type) {
      case "location":
        updateFilters({ searchQuery: value })
        setSearchQuery(value)
        break
      case "type":
        updateFilters({ homeType: [value.toLowerCase()] })
        setPropertyTypes([value.toLowerCase()])
        break
      case "price":
        updateFilters({ priceRange: value })
        setPriceRange(value)
        break
      case "bedrooms":
        updateFilters({ bedrooms: value })
        setBedrooms(value)
        break
    }
  }

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filters = []

    if (searchQuery) {
      filters.push({ type: "search", label: `Search: ${searchQuery}` })
    }

    if (priceRange[0] > 0 || priceRange[1] < 30000000000) {
      filters.push({
        type: "price",
        label: `Price: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`,
      })
    }

    if (bedrooms !== "any") {
      filters.push({ type: "bedrooms", label: `${bedrooms}+ Bedrooms` })
    }

    if (bathrooms !== "any") {
      filters.push({ type: "bathrooms", label: `${bathrooms}+ Bathrooms` })
    }

    if (propertyTypes.length > 0) {
      filters.push({
        type: "propertyType",
        label: `Type: ${propertyTypes.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}`,
      })
    }

    return filters
  }, [searchQuery, priceRange, bedrooms, bathrooms, propertyTypes])

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 z-50 bg-white">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold">RealEstate</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium hover:text-blue-600">
                Home
              </Link>
              <Link href="/search?type=buy" className="text-sm font-medium hover:text-blue-600">
                Buy
              </Link>
              <Link href="/search?type=sell" className="text-sm font-medium hover:text-blue-600">
                Sell
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <UserNav />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-black hover:bg-gray-800 text-white">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with filters */}
          <div className="md:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Filters</h2>

              <div className="space-y-6">
                <div>
                  <Label className="text-base">Price Range</Label>
                  <div className="flex justify-between mt-2 mb-1">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                  <Slider
                    defaultValue={[0, 30000000000]}
                    max={30000000000}
                    step={500000000}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms" className="block mb-2">
                    Bedrooms
                  </Label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger id="bedrooms">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bathrooms" className="block mb-2">
                    Bathrooms
                  </Label>
                  <Select value={bathrooms} onValueChange={setBathrooms}>
                    <SelectTrigger id="bathrooms">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block mb-2">Property Type</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="house"
                        checked={propertyTypes.includes("house")}
                        onCheckedChange={() => handlePropertyTypeChange("house")}
                      />
                      <label htmlFor="house" className="text-sm">
                        House
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="apartment"
                        checked={propertyTypes.includes("apartment")}
                        onCheckedChange={() => handlePropertyTypeChange("apartment")}
                      />
                      <label htmlFor="apartment" className="text-sm">
                        Apartment
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="villa"
                        checked={propertyTypes.includes("villa")}
                        onCheckedChange={() => handlePropertyTypeChange("villa")}
                      />
                      <label htmlFor="villa" className="text-sm">
                        Villa
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="land"
                        checked={propertyTypes.includes("land")}
                        onCheckedChange={() => handlePropertyTypeChange("land")}
                      />
                      <label htmlFor="land" className="text-sm">
                        Land
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
                    Reset
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleApplyFilters}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            {/* Search bar */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter address, neighborhood, or ZIP code..."
                  className="pl-10 h-12 text-base"
                />
              </form>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <Button
                variant={activeTab === "buy" ? "default" : "outline"}
                className={activeTab === "buy" ? "bg-blue-600 hover:bg-blue-700" : ""}
                onClick={() => handleTabChange("buy")}
              >
                Buy
              </Button>
              <Button
                variant={activeTab === "rent" ? "default" : "outline"}
                className={activeTab === "rent" ? "bg-blue-600 hover:bg-blue-700" : ""}
                onClick={() => handleTabChange("rent")}
              >
                Rent
              </Button>
            </div>

            {/* Active filters */}
            {activeFilters.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium">Active filters:</span>
                  {activeFilters.map((filter, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1 px-3 py-1">
                      {filter.label}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          if (filter.type === "search") setSearchQuery("")
                          if (filter.type === "price") setPriceRange([0, 30000000000])
                          if (filter.type === "bedrooms") setBedrooms("any")
                          if (filter.type === "bathrooms") setBathrooms("any")
                          if (filter.type === "propertyType") setPropertyTypes([])

                          // Update filters
                          const newFilters: any = {}
                          if (filter.type === "search") newFilters.searchQuery = ""
                          if (filter.type === "price") newFilters.priceRange = [0, 30000000000]
                          if (filter.type === "bedrooms") newFilters.bedrooms = "any"
                          if (filter.type === "bathrooms") newFilters.bathrooms = "any"
                          if (filter.type === "propertyType") newFilters.homeType = []

                          updateFilters(newFilters)
                        }}
                      />
                    </Badge>
                  ))}
                  {activeFilters.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-sm">
                      Clear all
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Filter options */}
            {showFilterOptions && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Suggested options
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilterOptions(false)}>
                    Hide
                  </Button>
                </div>

                {/* Location options */}
                {filterOptions.locations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Locations</h4>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.locations.map((location, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => applyFilterOption("location", location)}
                        >
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property type options */}
                {filterOptions.types.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Property Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.types.map((type, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => applyFilterOption("type", type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price range options */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Price Ranges</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.prices.map((price, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => applyFilterOption("price", price.value)}
                      >
                        {price.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bedroom options */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Bedrooms</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.bedroomOptions.map((option, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => applyFilterOption("bedrooms", option.value)}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold">Found {sortedProperties.length} properties</h1>

              <div className="flex items-center gap-4">
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Recommended</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className={`h-9 w-9 rounded-none rounded-l-md ${viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className={`h-9 w-9 rounded-none rounded-r-md ${viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {sortedProperties.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h2 className="text-lg font-semibold mb-2">No properties found</h2>
                <p className="text-muted-foreground mb-4">No properties match your search criteria.</p>
                <Button onClick={handleResetFilters}>Clear filters</Button>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {sortedProperties.map((property) => (
                  <div key={property.id} className={viewMode === "list" ? "border rounded-lg p-4 flex gap-4" : ""}>
                    {viewMode === "list" ? (
                      <>
                        <div className="relative w-48 h-36">
                          <Image
                            src={property.imageUrl || "/placeholder.svg"}
                            alt={property.title}
                            fill
                            className="object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=300&width=400&text=Image+Error"
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xl text-black">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              maximumFractionDigits: 0,
                            }).format(property.price)}
                          </div>
                          <h3 className="font-semibold text-lg mt-1">{property.title}</h3>
                          <div className="flex items-center mt-2 text-gray-500">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-4 text-sm">
                            <div className="flex items-center">
                              <span>{property.bedrooms} beds</span>
                            </div>
                            <div className="flex items-center">
                              <span>{property.bathrooms} baths</span>
                            </div>
                            <div className="flex items-center">
                              <span>{property.area} m²</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <PropertyCard property={property} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

