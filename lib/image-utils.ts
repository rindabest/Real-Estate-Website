// Hàm để thêm hình ảnh bất động sản mới vào danh sách
export function addCustomPropertyImages(propertyType: string, imageUrls: string[]) {
  // Import realEstateImages từ mock-data
  const { realEstateImages } = require("./mock-data")

  // Kiểm tra xem loại bất động sản đã tồn tại chưa
  if (realEstateImages[propertyType]) {
    // Nếu đã tồn tại, thêm các hình ảnh mới vào mảng hiện có
    realEstateImages[propertyType] = [...imageUrls, ...realEstateImages[propertyType]]
  } else {
    // Nếu chưa tồn tại, tạo mới mảng hình ảnh cho loại bất động sản này
    realEstateImages[propertyType] = imageUrls
  }

  return realEstateImages
}

// Hàm để thêm một bất động sản mới với hình ảnh tùy chỉnh
export function addCustomProperty(propertyData: any, imageUrls: string[]) {
  // Import properties từ mock-data
  const { properties } = require("./mock-data")

  // Tạo ID mới cho bất động sản
  const newId = (Math.max(...properties.map((p: any) => Number.parseInt(p.id))) + 1).toString()

  // Tạo bất động sản mới với hình ảnh tùy chỉnh
  const newProperty = {
    id: newId,
    ...propertyData,
    imageUrl: imageUrls[0], // Sử dụng hình ảnh đầu tiên làm ảnh đại diện
    images: imageUrls, // Sử dụng tất cả hình ảnh
  }

  // Thêm bất động sản mới vào danh sách
  properties.push(newProperty)

  return newProperty
}

// Ví dụ cách sử dụng:
/*
// 1. Thêm hình ảnh mới cho loại bất động sản hiện có
const myVillaImages = [
  "https://example.com/my-villa-1.jpg",
  "https://example.com/my-villa-2.jpg",
];
addCustomPropertyImages("villa", myVillaImages);

// 2. Thêm bất động sản mới với hình ảnh tùy chỉnh
const myPropertyData = {
  title: "Biệt thự của tôi",
  description: "Biệt thự sang trọng với view đẹp",
  location: "Quận 2, TP. Hồ Chí Minh",
  price: 15000000000,
  bedrooms: 5,
  bathrooms: 6,
  area: 400,
  type: "Biệt thự",
  features: ["Hồ bơi", "Sân vườn", "Garage"],
  status: "for_sale",
  yearBuilt: 2022,
  parkingSpaces: 3,
};

const myPropertyImages = [
  "https://example.com/my-property-1.jpg",
  "https://example.com/my-property-2.jpg",
  "https://example.com/my-property-3.jpg",
];

const newProperty = addCustomProperty(myPropertyData, myPropertyImages);
*/

