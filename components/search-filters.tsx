"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useSearch } from "@/lib/search-context"
import { useRouter } from "next/navigation"

interface SearchFiltersProps {
  onClose?: () => void
  standalone?: boolean
}

export function SearchFilters({ onClose, standalone = false }: SearchFiltersProps) {
  const { searchFilters, updateFilters, resetFilters } = useSearch()
  const router = useRouter()

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(searchFilters.priceRange)
  const [localBedrooms, setLocalBedrooms] = useState(searchFilters.bedrooms)
  const [localBathrooms, setLocalBathrooms] = useState(searchFilters.bathrooms)
  const [localHomeType, setLocalHomeType] = useState<string[]>(searchFilters.homeType)

  // Đồng bộ state cục bộ với context khi component mount
  useEffect(() => {
    setLocalPriceRange(searchFilters.priceRange)
    setLocalBedrooms(searchFilters.bedrooms)
    setLocalBathrooms(searchFilters.bathrooms)
    setLocalHomeType(searchFilters.homeType)
  }, [searchFilters])

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]])
  }

  const handleHomeTypeChange = (type: string) => {
    setLocalHomeType((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]))
  }

  const handleReset = () => {
    resetFilters()
    setLocalPriceRange([0, 30000000000])
    setLocalBedrooms("")
    setLocalBathrooms("")
    setLocalHomeType([])
  }

  const handleApply = () => {
    // Cập nhật bộ lọc trong context
    updateFilters({
      priceRange: localPriceRange,
      bedrooms: localBedrooms,
      bathrooms: localBathrooms,
      homeType: localHomeType,
    })

    // Nếu đang ở trang chủ, chuyển hướng đến trang tìm kiếm
    if (!standalone) {
      router.push("/search")
    }

    // Đóng popover nếu có
    if (onClose) onClose()
  }

  // Format giá để hiển thị (tỷ VNĐ)
  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ`
    }
    return `${(price / 1000000).toFixed(0)} triệu`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bộ lọc</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base">Khoảng giá</Label>
          <div className="flex justify-between mt-2 mb-1">
            <span>{formatPrice(localPriceRange[0])}</span>
            <span>{formatPrice(localPriceRange[1])}</span>
          </div>
          <Slider
            defaultValue={[0, 30000000000]}
            max={30000000000}
            step={500000000}
            value={localPriceRange}
            onValueChange={handlePriceChange}
          />
          <div className="flex gap-4 mt-2">
            <div className="w-1/2">
              <Input
                type="number"
                value={localPriceRange[0]}
                onChange={(e) => setLocalPriceRange([Number.parseInt(e.target.value) || 0, localPriceRange[1]])}
                min={0}
                max={localPriceRange[1]}
                className="text-sm"
              />
            </div>
            <div className="w-1/2">
              <Input
                type="number"
                value={localPriceRange[1]}
                onChange={(e) => setLocalPriceRange([localPriceRange[0], Number.parseInt(e.target.value) || 0])}
                min={localPriceRange[0]}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bedrooms">Phòng ngủ</Label>
            <Select value={localBedrooms} onValueChange={setLocalBedrooms}>
              <SelectTrigger id="bedrooms">
                <SelectValue placeholder="Bất kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Bất kỳ</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bathrooms">Phòng tắm</Label>
            <Select value={localBathrooms} onValueChange={setLocalBathrooms}>
              <SelectTrigger id="bathrooms">
                <SelectValue placeholder="Bất kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Bất kỳ</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-base mb-2 block">Loại bất động sản</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="house"
                checked={localHomeType.includes("house")}
                onCheckedChange={() => handleHomeTypeChange("house")}
              />
              <label htmlFor="house" className="text-sm">
                Nhà riêng
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="apartment"
                checked={localHomeType.includes("apartment")}
                onCheckedChange={() => handleHomeTypeChange("apartment")}
              />
              <label htmlFor="apartment" className="text-sm">
                Căn hộ
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="villa"
                checked={localHomeType.includes("villa")}
                onCheckedChange={() => handleHomeTypeChange("villa")}
              />
              <label htmlFor="villa" className="text-sm">
                Biệt thự
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="land"
                checked={localHomeType.includes("land")}
                onCheckedChange={() => handleHomeTypeChange("land")}
              />
              <label htmlFor="land" className="text-sm">
                Đất nền
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="office"
                checked={localHomeType.includes("office")}
                onCheckedChange={() => handleHomeTypeChange("office")}
              />
              <label htmlFor="office" className="text-sm">
                Văn phòng
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="retail"
                checked={localHomeType.includes("retail")}
                onCheckedChange={() => handleHomeTypeChange("retail")}
              />
              <label htmlFor="retail" className="text-sm">
                Mặt bằng kinh doanh
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button variant="outline" className="w-1/2" onClick={handleReset}>
            Đặt lại
          </Button>
          <Button className="w-1/2 bg-[#006aff] hover:bg-[#0051c3]" onClick={handleApply}>
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  )
}

