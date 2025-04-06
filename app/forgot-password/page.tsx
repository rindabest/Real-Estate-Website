"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate email
      if (!email || !email.includes("@")) {
        throw new Error("Vui lòng nhập địa chỉ email hợp lệ")
      }

      // Simulate API call to send verification code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random 4-digit code (in a real app, this would be done on the server)
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString()

      // Store the code and email in sessionStorage (in a real app, this would be stored on the server)
      sessionStorage.setItem("verificationCode", verificationCode)
      sessionStorage.setItem("verificationEmail", email)
      sessionStorage.setItem("verificationExpiry", (Date.now() + 180000).toString()) // 3 minutes from now

      // In a real app, we would send an email with the code
      console.log(`Verification code for ${email}: ${verificationCode}`)

      toast({
        title: "Mã xác thực đã được gửi",
        description: `Chúng tôi đã gửi mã xác thực đến ${email}. Mã có hiệu lực trong 3 phút.`,
      })

      // Redirect to verification page
      router.push("/verify-code")
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi gửi mã xác thực",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link
        href="/login"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm text-muted-foreground hover:text-[#006aff]"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Quay lại đăng nhập
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-[#006aff]">REMS</span>
          </Link>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Quên mật khẩu</CardTitle>
            <CardDescription className="text-center">Nhập địa chỉ email của bạn để nhận mã xác thực</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full h-11 bg-[#006aff] hover:bg-[#0051c3]" disabled={isLoading}>
                {isLoading ? "Đang gửi..." : "Gửi mã xác thực"}
              </Button>
              <div className="mt-4 text-center text-sm">
                Đã nhớ mật khẩu?{" "}
                <Link href="/login" className="text-[#006aff] hover:underline">
                  Đăng nhập
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

