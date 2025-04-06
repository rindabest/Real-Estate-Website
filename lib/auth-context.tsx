"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  name: string
  email: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse stored user data", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to verify credentials
    // For demo purposes, we'll just simulate a successful login

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a mock user based on the email
    const mockUser = {
      name: email.split("@")[0],
      email: email,
      avatar: `/placeholder.svg?height=40&width=40&text=${email[0].toUpperCase()}`,
    }

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(mockUser))

    // Update state
    setUser(mockUser)
    setIsAuthenticated(true)
  }

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem("user")

    // Update state
    setUser(null)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

