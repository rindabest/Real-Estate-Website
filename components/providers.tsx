"use client"

import { AuthProvider } from "@/lib/auth-context"
import { SearchProvider } from "@/lib/search-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SearchProvider>{children}</SearchProvider>
    </AuthProvider>
  )
}

