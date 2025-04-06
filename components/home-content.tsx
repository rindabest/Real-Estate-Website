"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PropertyCard } from "@/components/property-card"
import { properties } from "@/lib/mock-data"
import { Home, Building, DollarSign, Search } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { UserNav } from "@/components/user-nav"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function HomeContent() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
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

      <main className="flex-1">
        <section className="py-16 md:py-24 bg-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Find Your Dream Home</h1>
                <p className="text-lg text-gray-600 mb-8">Search properties for sale and to rent in your area</p>

                <form onSubmit={handleSearch} className="flex mb-8">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter address, neighborhood, or ZIP code..."
                    className="h-12 rounded-r-none border-r-0 text-base flex-grow"
                  />
                  <Button type="submit" className="h-12 px-6 rounded-l-none bg-black hover:bg-gray-800">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </form>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
                    alt="Luxury villa with pool"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                    alt="Modern house"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    alt="Luxury apartment"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVudGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                    alt="Penthouse with view"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide a complete range of services for the sale, purchase or rental of real estate
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="border rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Buy a home</h3>
                <p className="text-gray-600">
                  Find your place with an immersive photo experience and the most listings
                </p>
              </div>

              <div className="border rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rent a home</h3>
                <p className="text-gray-600">We're creating a seamless online experience from shopping to renting</p>
              </div>

              <div className="border rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sell a home</h3>
                <p className="text-gray-600">Get a comprehensive marketing plan and expert support to sell your home</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Featured Properties</h2>
              <Link href="/search" className="text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.slice(0, 4).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-50 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold">RealEstate</span>
            </div>

            <div className="flex space-x-6">
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                Contact
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">&copy; {currentYear} RealEstate. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

