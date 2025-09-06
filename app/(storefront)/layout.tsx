"use client"

import type React from "react"
import { useEffect } from "react"
import { CartProvider } from "@/context/cart-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartBadge } from "@/components/cart/cart-badge"

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("[v0] StorefrontLayout mounted - CartProvider active")
  }, [])

  return (
    <CartProvider>
      <main className="min-h-dvh bg-gray-50">
        <Navbar />
        {children}
        <Footer />
        <CartBadge />
      </main>
    </CartProvider>
  )
}
