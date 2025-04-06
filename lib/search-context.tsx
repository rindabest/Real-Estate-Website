"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { properties } from "./mock-data"
import type { Property } from "./types"

type SearchFiltersType = {
  priceRange: [number, number]
  bedrooms: string
  bathrooms: string
  homeType: string[]
  searchQuery: string
  status?: "for_sale" | "for_rent" | "sold" | "pending"
}

type SearchContextType = {
  searchFilters: SearchFiltersType
  filteredProperties: Property[]
  updateFilters: (filters: Partial<SearchFiltersType>) => void
  resetFilters: () => void
}

const defaultFilters: SearchFiltersType = {
  priceRange: [0, 30000000000],
  bedrooms: "",
  bathrooms: "",
  homeType: [],
  searchQuery: "",
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType>(defaultFilters)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties)

  // Sử dụng useCallback để tránh tạo lại hàm mỗi khi component re-render
  const updateFilters = useCallback((filters: Partial<SearchFiltersType>) => {
    setSearchFilters((prev) => {
      // Nếu filters giống với prev, trả về prev để tránh re-render
      if (
        Object.keys(filters).length === 0 ||
        Object.keys(filters).every(
          (key) =>
            JSON.stringify(filters[key as keyof SearchFiltersType]) ===
            JSON.stringify(prev[key as keyof SearchFiltersType]),
        )
      ) {
        return prev
      }
      return { ...prev, ...filters }
    })
  }, [])

  const resetFilters = useCallback(() => {
    setSearchFilters(defaultFilters)
  }, [])

  // Cập nhật kết quả lọc khi bộ lọc thay đổi
  useEffect(() => {
    const filtered = properties.filter((property) => {
      // Lọc theo khoảng giá
      if (property.price < searchFilters.priceRange[0] || property.price > searchFilters.priceRange[1]) {
        return false
      }

      // Lọc theo số phòng ngủ
      if (searchFilters.bedrooms && searchFilters.bedrooms !== "any") {
        const minBedrooms = Number.parseInt(searchFilters.bedrooms, 10)
        if (property.bedrooms < minBedrooms) {
          return false
        }
      }

      // Lọc theo số phòng tắm
      if (searchFilters.bathrooms && searchFilters.bathrooms !== "any") {
        const minBathrooms = Number.parseInt(searchFilters.bathrooms, 10)
        if (property.bathrooms < minBathrooms) {
          return false
        }
      }

      // Lọc theo loại bất động sản
      if (searchFilters.homeType.length > 0) {
        const propertyTypeMap: Record<string, string> = {
          house: "Nhà riêng",
          apartment: "Căn hộ",
          villa: "Biệt thự",
          land: "Đất nền",
          office: "Văn phòng",
          retail: "Mặt bằng kinh doanh",
        }

        const matchesType = searchFilters.homeType.some((type) => {
          if (type === "any") return true
          const vietnameseType = propertyTypeMap[type]
          return property.type.includes(vietnameseType) || property.type.toLowerCase().includes(type.toLowerCase())
        })

        if (!matchesType) {
          return false
        }
      }

      // Lọc theo trạng thái (for_sale, for_rent)
      if (searchFilters.status && property.status !== searchFilters.status) {
        return false
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchFilters.searchQuery) {
        const query = searchFilters.searchQuery.toLowerCase()
        const matchesQuery =
          property.title.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query)

        if (!matchesQuery) {
          return false
        }
      }

      return true
    })

    setFilteredProperties(filtered)
  }, [searchFilters])

  return (
    <SearchContext.Provider
      value={{
        searchFilters,
        filteredProperties,
        updateFilters,
        resetFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}

