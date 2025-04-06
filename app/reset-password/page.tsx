"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)

  useEffect(() => {
    // Chỉ kiểm tra email, không cần kiểm tra mã xác thực
    const storedEmail = sessionStorage.getItem("verificationEmail")

    if (!storedEmail) {
      // Nếu không có email, tạo một email mặc định
      const defaultEmail = "user@example.com"
      sessionStorage.setItem("verificationEmail", defaultEmail)
      setEmail(defaultEmail)
    } else {
      setEmail(storedEmail)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords
      if (formData.password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự")
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Mật khẩu xác nhận không khớp")
      }

      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, we would send the new password to the server
      console.log(`Password reset for ${email}: ${formData.password}`)

      // Clear the verification data from sessionStorage
      sessionStorage.removeItem("verificationCode")
      sessionStorage.removeItem("verificationEmail")
      sessionStorage.removeItem("verificationExpiry")

      // Set success state instead of redirecting
      setResetSuccess(true)

      toast({
        title: "Đặt lại mật khẩu thành công",
        description: "Mật khẩu của bạn đã được đặt lại.",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi đặt lại mật khẩu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link
        href="/verify-code"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm text-muted-foreground hover:text-[#006aff]"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Quay lại
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-[#006aff]">REMS</span>
          </Link>
        </div>

        {resetSuccess ? (
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Đặt lại mật khẩu thành công</CardTitle>
              <CardDescription className="text-center">
                Bạn đã đặt lại mật khẩu thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-4">
              <Button onClick={() => router.push("/login")} className="w-full h-11 bg-[#006aff] hover:bg-[#0051c3]">
                Quay lại trang đăng nhập
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Đặt lại mật khẩu</CardTitle>
              <CardDescription className="text-center">Tạo mật khẩu mới cho tài khoản của bạn</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full h-11 bg-[#006aff] hover:bg-[#0051c3]" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}

