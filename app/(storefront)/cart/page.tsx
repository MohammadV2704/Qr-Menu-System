"use client"

import Link from "next/link"
import { CartSummary } from "@/components/cart/cart-summary"

export default function CartPage() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>
        <Link href="/menu/demo-restaurant?table=5" className="text-sm text-blue-700 hover:underline">
          Continue shopping
        </Link>
      </div>
      <CartSummary />
    </section>
  )
}
