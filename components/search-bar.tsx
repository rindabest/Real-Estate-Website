"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, SlidersHorizontal } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SearchFilters } from "./search-filters"
import { useSearch } from "@/lib/search-context"
import { useRouter } from "next/navigation"

export function SearchBar() {
  const { searchFilters, updateFilters } = useSearch()
  const [searchQuery, setSearchQuery] = useState(searchFilters.searchQuery)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ searchQuery })
    router.push("/search")
  }

  const handlePropertyTypeClick = (type: string) => {
    updateFilters({ homeType: [type] })
    router.push("/search")
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex">
          <div className="relative flex-grow">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập địa điểm, khu vực hoặc mã BĐS..."
              className="pl-10 h-14 rounded-l-lg border-r-0 text-base"
            />
          </div>
          <Button type="submit" className="h-14 px-6 rounded-l-none bg-[#006aff] hover:bg-[#0051c3]">
            <Search className="h-5 w-5 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => handlePropertyTypeClick("house")}>
            Nhà riêng
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => handlePropertyTypeClick("apartment")}
          >
            Căn hộ
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => handlePropertyTypeClick("villa")}>
            Biệt thự
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => handlePropertyTypeClick("land")}>
            Đất nền
          </Button>
        </div>

        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Bộ lọc
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] md:w-[520px] p-0" align="end">
            <div className="p-4">
              <SearchFilters onClose={() => setIsFiltersOpen(false)} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

