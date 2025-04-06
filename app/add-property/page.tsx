import { AddPropertyForm } from "@/components/add-property-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AddPropertyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <Link href="/" className="inline-flex items-center text-[#006aff] hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại trang chủ
        </Link>

        <h1 className="text-2xl font-bold mb-6">Thêm bất động sản mới</h1>

        <AddPropertyForm />
      </div>
    </div>
  )
}

