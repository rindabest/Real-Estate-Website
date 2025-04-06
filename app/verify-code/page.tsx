"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export default function VerifyCodePage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes in seconds
  const [email, setEmail] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if we have the necessary data in sessionStorage
    const storedEmail = sessionStorage.getItem("verificationEmail")
    const expiryTime = sessionStorage.getItem("verificationExpiry")

    if (!storedEmail || !expiryTime) {
      // If not, redirect back to forgot password page
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email của bạn trước",
        variant: "destructive",
      })
      router.push("/forgot-password")
      return
    }

    setEmail(storedEmail)

    // Calculate remaining time
    const expiry = Number.parseInt(expiryTime)
    const now = Date.now()
    const remainingSeconds = Math.max(0, Math.floor((expiry - now) / 1000))

    setTimeLeft(remainingSeconds)

    // Start the countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [router])

  // Format the time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleResendCode = async () => {
    setIsLoading(true)

    try {
      // Simulate API call to resend verification code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a new random 4-digit code
      const newVerificationCode = Math.floor(1000 + Math.random() * 9000).toString()

      // Update the code and expiry time in sessionStorage
      sessionStorage.setItem("verificationCode", newVerificationCode)
      sessionStorage.setItem("verificationExpiry", (Date.now() + 180000).toString()) // 3 minutes from now

      // In a real app, we would send an email with the code
      console.log(`New verification code for ${email}: ${newVerificationCode}`)

      // Reset the timer
      setTimeLeft(180)

      // Restart the countdown
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      toast({
        title: "Mã xác thực mới đã được gửi",
        description: `Chúng tôi đã gửi mã xác thực mới đến ${email}. Mã có hiệu lực trong 3 phút.`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi gửi lại mã xác thực",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Thay đổi hàm handleSubmit để chấp nhận bất kỳ mã 4 chữ số nào
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Chỉ kiểm tra nếu mã đã hết hạn
      if (timeLeft <= 0) {
        throw new Error("Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.")
      }

      // Chỉ kiểm tra độ dài của mã (4 chữ số)
      if (code.length !== 4) {
        throw new Error("Mã xác thực phải có 4 chữ số.")
      }

      // Không cần kiểm tra mã có khớp với mã đã lưu hay không
      // Chỉ cần chuyển hướng đến trang đặt lại mật khẩu

      toast({
        title: "Xác thực thành công",
        description: "Bạn có thể đặt lại mật khẩu của mình.",
      })

      router.push("/reset-password")
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi xác thực mã",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link
        href="/forgot-password"
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

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Nhập mã xác thực</CardTitle>
            <CardDescription className="text-center">
              Chúng tôi đã gửi mã xác thực gồm 4 chữ số đến {email}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="code">Mã xác thực</Label>
                  <span className={`text-sm font-medium ${timeLeft < 30 ? "text-red-500" : "text-muted-foreground"}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <Input
                  id="code"
                  type="text"
                  placeholder="Nhập mã 4 chữ số"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  required
                  maxLength={4}
                  className="h-11 text-center text-lg tracking-widest font-bold"
                />
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Không nhận được mã? </span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-[#006aff]"
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  Gửi lại mã
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="w-full h-11 bg-[#006aff] hover:bg-[#0051c3]"
                disabled={isLoading || code.length !== 4 || timeLeft <= 0}
              >
                {isLoading ? "Đang xác thực..." : "Xác thực"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

