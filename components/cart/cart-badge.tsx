"use client"

import Link from "next/link"
import { useCart } from "@/context/cart-context"

export function CartBadge() {
  const { totalQuantity } = useCart()

  if (totalQuantity === 0) return null

  return (
    <Link
      href="/checkout"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg ring-1 ring-black/5 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={`Open cart. ${totalQuantity} item${totalQuantity > 1 ? "s" : ""} in cart`}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-blue-700">
        {totalQuantity}
      </span>
      <span>View Cart</span>
    </Link>
  )
}
