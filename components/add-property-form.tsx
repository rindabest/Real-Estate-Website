"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { addCustomProperty } from "@/lib/image-utils"
import type { Property } from "@/lib/types"

export function AddPropertyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const [formData, setFormData] = useState<Partial<Property>>({
    title: "",
    description: "",
    location: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    type: "",
    features: [],
    status: "for_sale",
    yearBuilt: new Date().getFullYear(),
    parkingSpaces: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "bedrooms" ||
        name === "bathrooms" ||
        name === "area" ||
        name === "yearBuilt" ||
        name === "parkingSpaces"
          ? Number(value)
          : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddImage = () => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl])
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.title || !formData.location || !formData.price || !formData.type) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc")
      }

      if (images.length === 0) {
        throw new Error("Vui lòng thêm ít nhất một hình ảnh")
      }

      // Thêm bất động sản mới
      const newProperty = addCustomProperty(formData, images)

      toast({
        title: "Thêm bất động sản thành công",
        description: "Bất động sản của bạn đã được thêm vào hệ thống.",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        type: "",
        features: [],
        status: "for_sale",
        yearBuilt: new Date().getFullYear(),
        parkingSpaces: 0,
      })
      setImages([])
    } catch (error) {
      toast({
        title: "Thêm bất động sản thất bại",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi thêm bất động sản",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Thêm bất động sản mới</CardTitle>
        <CardDescription>Điền thông tin và thêm hình ảnh cho bất động sản của bạn</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tiêu đề <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề bất động sản"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">
                  Vị trí <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Nhập vị trí bất động sản"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả chi tiết về bất động sản"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={handleChange}
                  placeholder="Nhập giá bất động sản"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">
                  Loại bất động sản <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Căn hộ">Căn hộ</SelectItem>
                    <SelectItem value="Nhà riêng">Nhà riêng</SelectItem>
                    <SelectItem value="Biệt thự">Biệt thự</SelectItem>
                    <SelectItem value="Đất nền">Đất nền</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Văn phòng">Văn phòng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleSelectChange("status", value as "for_sale" | "for_rent" | "sold" | "pending")
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for_sale">Đang bán</SelectItem>
                    <SelectItem value="for_rent">Cho thuê</SelectItem>
                    <SelectItem value="sold">Đã bán</SelectItem>
                    <SelectItem value="pending">Đang chờ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Số phòng ngủ</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Số phòng tắm</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms || ""}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Diện tích (m²)</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={formData.area || ""}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Năm xây dựng</Label>
                <Input
                  id="yearBuilt"
                  name="yearBuilt"
                  type="number"
                  value={formData.yearBuilt || ""}
                  onChange={handleChange}
                  placeholder={new Date().getFullYear().toString()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Hình ảnh <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Nhập URL hình ảnh"
                  className="flex-grow"
                />
                <Button type="button" onClick={handleAddImage}>
                  Thêm
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Thêm URL hình ảnh của bạn. Ví dụ: https://example.com/image.jpg
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-[4/3] rounded-md overflow-hidden border">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Hình ảnh ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-[#006aff] hover:bg-[#0051c3]" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Thêm bất động sản"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

